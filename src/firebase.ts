import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// Analytics is disabled by default to avoid errors - uncomment if needed
// import { getAnalytics, isSupported } from 'firebase/analytics';

// Get environment variables with proper fallbacks
const getEnvVar = (key: string, fallback: string): string => {
  const value = import.meta.env[key];
  // Check if value is undefined, null, empty string, or placeholder
  if (!value || value === 'your-project-id' || value.includes('your-')) {
    return fallback;
  }
  return value;
};

const firebaseConfig = {
  apiKey: getEnvVar('VITE_FIREBASE_API_KEY', 'AIzaSyBDBIxUWnEl3corRx0MLWG3zG8BEvdxIG0'),
  authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN', 'mission-107ee.firebaseapp.com'),
  projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID', 'mission-107ee'),
  storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET', 'mission-107ee.firebasestorage.app'),
  messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID', '323438792339'),
  appId: getEnvVar('VITE_FIREBASE_APP_ID', '1:323438792339:web:bdbf97ca14d583c5fd8766'),
  measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID', 'G-7M47N2VG5R'),
};

// Log Firebase config for debugging (always log to help diagnose issues)
if (typeof window !== 'undefined') {
  console.log('🔧 Firebase Config:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    hasApiKey: !!firebaseConfig.apiKey,
    envProjectId: import.meta.env.VITE_FIREBASE_PROJECT_ID
  });
  
  // Verify project ID is not placeholder
  if (firebaseConfig.projectId === 'your-project-id' || firebaseConfig.projectId.includes('your-project')) {
    console.error('❌ ERROR: Firebase project ID is a placeholder!');
    console.error('Please create a .env file with: VITE_FIREBASE_PROJECT_ID=mission-107ee');
    console.error('Or update your existing .env file.');
  } else {
    console.log('✅ Firebase project ID is set to:', firebaseConfig.projectId);
  }
}

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  throw error;
}

export const auth = getAuth(app);

// Initialize Firestore with explicit database URL to avoid issues
export const db = (() => {
  try {
    const firestoreDb = getFirestore(app);
    console.log('✅ Firestore initialized successfully for project:', firebaseConfig.projectId);
    return firestoreDb;
  } catch (error) {
    console.error('❌ Firestore initialization failed:', error);
    throw error;
  }
})();

// Analytics is optional and only works in supported browsers
// Disable analytics initialization to avoid errors if not properly configured
// Uncomment the import above and the code below to enable analytics
export let analytics: any = null;
// export let analytics: ReturnType<typeof getAnalytics> | null = null;
// Uncomment below to enable analytics (requires proper Firebase Analytics setup)
/*
if (typeof window !== 'undefined') {
  isSupported()
    .then((supported) => {
      if (supported && firebaseConfig.measurementId) {
        try {
          analytics = getAnalytics(app);
        } catch (error) {
          console.warn('Analytics initialization failed:', error);
          analytics = null;
        }
      }
    })
    .catch(() => {
      // ignore analytics errors
      analytics = null;
    });
}
*/

export default app;
// (file intentionally ends here)