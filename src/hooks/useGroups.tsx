import { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  addDoc, 
  getDoc, 
  doc, 
  updateDoc, 
  onSnapshot,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from '../firebase';
import { Group, Participant } from '../../types';

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false); // Start with false - no loading screen
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;
    let hasTriedFallback = false;

    const setupQuery = (useOrderBy: boolean) => {
      const q = useOrderBy 
        ? query(collection(db, 'groups'), orderBy('createdAt', 'desc'))
        : query(collection(db, 'groups'));
      
      unsubscribe = onSnapshot(q, (snapshot) => {
        const groupsData: Group[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          groupsData.push({
            id: doc.id,
            name: data.name || 'Unnamed Group',
            participants: data.participants || [],
            drawCompleted: data.drawCompleted || false
          });
        });
        
        // Sort manually if not using orderBy
        if (!useOrderBy) {
          groupsData.sort((a, b) => {
            // Try to sort by createdAt if available, otherwise by name
            const aCreated = (snapshot.docs.find(d => d.id === a.id)?.data()?.createdAt as string) || '';
            const bCreated = (snapshot.docs.find(d => d.id === b.id)?.data()?.createdAt as string) || '';
            if (aCreated && bCreated) {
              return bCreated.localeCompare(aCreated); // desc
            }
            return a.name.localeCompare(b.name);
          });
        }
        
        setGroups(groupsData);
      }, (error: any) => {
        console.error('Error fetching groups:', error);
        // If orderBy query fails due to missing index, try without orderBy
        if ((error.code === 'failed-precondition' || error.code === 9 || error.message?.includes('index')) && !hasTriedFallback) {
          console.warn('Index not found, fetching without orderBy');
          hasTriedFallback = true;
          if (unsubscribe) unsubscribe();
          setupQuery(false);
        }
      });
      
      unsubscribeRef.current = unsubscribe;
    };

    // Try with orderBy first
    setupQuery(true);

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, []);

  const createGroup = async (name: string): Promise<string> => {
    try {
      const docRef = await addDoc(collection(db, 'groups'), {
        name: name.trim(),
        participants: [],
        drawCompleted: false,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  };

  const addParticipant = async (groupId: string, participant: Participant) => {
    try {
      const groupRef = doc(db, 'groups', groupId);
      const groupDoc = await getDoc(groupRef);

      if (!groupDoc.exists()) {
        throw new Error('Group not found');
      }

      const data = groupDoc.data();
      const groupData: Group = {
        id: groupDoc.id,
        name: data.name,
        participants: data.participants || [],
        drawCompleted: data.drawCompleted || false
      };

      // Check if participant already exists
      const existingParticipant = groupData.participants.find(
        p => p.name.toLowerCase() === participant.name.toLowerCase()
      );

      if (existingParticipant) {
        throw new Error('Participant already exists in this group');
      }

      const updatedParticipants = [...groupData.participants, participant];
      
      await updateDoc(groupRef, {
        participants: updatedParticipants
      });
    } catch (error) {
      console.error('Error adding participant:', error);
      throw error;
    }
  };

  const updateParticipantWishlist = async (
    groupId: string, 
    participantId: string, 
    wishlist: string
  ) => {
    try {
      const groupRef = doc(db, 'groups', groupId);
      const groupDoc = await getDoc(groupRef);

      if (!groupDoc.exists()) {
        throw new Error('Group not found');
      }

      const data = groupDoc.data();
      const groupData: Group = {
        id: groupDoc.id,
        name: data.name,
        participants: data.participants || [],
        drawCompleted: data.drawCompleted || false
      };

      const updatedParticipants = groupData.participants.map(p => 
        p.id === participantId ? { ...p, wishlist: wishlist.trim() } : p
      );
      
      await updateDoc(groupRef, {
        participants: updatedParticipants
      });
    } catch (error) {
      console.error('Error updating wishlist:', error);
      throw error;
    }
  };

  const operateDraw = async (groupId: string) => {
    try {
      const groupRef = doc(db, 'groups', groupId);
      const groupDoc = await getDoc(groupRef);

      if (!groupDoc.exists()) {
        throw new Error('Group not found');
      }

      const data = groupDoc.data();
      const groupData: Group = {
        id: groupDoc.id,
        name: data.name,
        participants: data.participants || [],
        drawCompleted: data.drawCompleted || false
      };

      if (groupData.participants.length < 2) {
        throw new Error('Need at least 2 participants to operate the draw');
      }

      if (groupData.drawCompleted) {
        throw new Error('Draw already completed');
      }

      // Shuffle participants using Fisher-Yates algorithm
      const shuffled = [...groupData.participants];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      // Assign each participant to the next one in the shuffled array (circular)
      // With 2+ participants, circular assignment guarantees no self-assignment
      const assignedParticipants = shuffled.map((participant, index) => ({
        ...participant,
        assignedTo: shuffled[(index + 1) % shuffled.length].id
      }));
      
      // Safety check: Verify no one is assigned to themselves (should never happen with 2+ participants)
      const hasSelfAssignment = assignedParticipants.some(p => p.id === p.assignedTo);
      if (hasSelfAssignment) {
        throw new Error('Draw failed: Invalid assignment detected. Please try again.');
      }

      await updateDoc(groupRef, {
        participants: assignedParticipants,
        drawCompleted: true,
        drawCompletedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error operating draw:', error);
      throw error;
    }
  };

  return {
    groups,
    loading,
    createGroup,
    addParticipant,
    updateParticipantWishlist,
    operateDraw
  };
};

