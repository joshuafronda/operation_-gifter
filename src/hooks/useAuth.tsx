import { useState, useEffect } from 'react';
import { 
  signInAnonymously, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { CurrentUser, Role } from '../../types';

export const useAuth = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(false); // Start with false - no loading screen

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        // Fetch user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setCurrentUser({
              name: userData.name,
              role: userData.role as Role
            });
          } else {
            // If user doc doesn't exist, create it
            // This shouldn't happen in normal flow, but handle it gracefully
            setCurrentUser({
              name: firebaseUser.displayName || 'Unknown',
              role: null
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const loginAgent = async (name: string) => {
    try {
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;
      
      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name.trim(),
        role: 'USER',
        createdAt: new Date().toISOString()
      });
      
      // Update currentUser immediately
      setCurrentUser({
        name: name.trim(),
        role: 'USER'
      });
    } catch (error) {
      console.error('Error logging in agent:', error);
      throw error;
    }
  };

  const loginAdmin = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store/update admin user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: 'Admin',
        role: 'ADMIN',
        email: email,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      
      // Update currentUser immediately
      setCurrentUser({
        name: 'Admin',
        role: 'ADMIN'
      });
    } catch (error: any) {
      console.error('Error logging in admin:', error);
      // Provide more helpful error messages
      if (error.code === 'auth/operation-not-allowed') {
        throw new Error('Email/Password authentication is not enabled. Please enable it in Firebase Console → Authentication → Sign-in method');
      } else if (error.code === 'auth/user-not-found') {
        throw new Error('Admin user not found. Please create an admin user in Firebase Console → Authentication → Users');
      } else if (error.code === 'auth/wrong-password') {
        throw new Error('Invalid password');
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address');
      }
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  return {
    user,
    currentUser,
    loading,
    loginAgent,
    loginAdmin,
    logout
  };
};

