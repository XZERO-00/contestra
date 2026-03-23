import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Fetch additional user details from Firestore
          const docRef = doc(db, 'users', firebaseUser.uid);
          
          const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 4000));
          const docSnap = await Promise.race([getDoc(docRef), timeoutPromise]);
          
          if (docSnap.exists()) {
            setUser({ ...firebaseUser, ...docSnap.data() });
          } else {
            // Fallback if document doesn't exist
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || 'User',
              role: 'Participant' // Default
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const docRef = doc(db, 'users', userCredential.user.uid);
      
      const getDocPromise = getDoc(docRef);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('firestore-timeout')), 5000));
      
      const docSnap = await Promise.race([getDocPromise, timeoutPromise]);
      
      if (docSnap && docSnap.exists()) {
        const userData = { ...userCredential.user, ...docSnap.data() };
        setUser(userData);
        return userData;
      }
      return { role: 'Participant' };
    } catch (error) {
       console.error("Login Error:", error);
       if (error.message === 'firestore-timeout') {
           throw new Error("Database connection timed out. Have you created your Firestore Database in the Firebase Console yet?");
       }
       throw new Error("Invalid email or password.");
    }
  };

  const register = async (userData) => {
    try {
      const { email, password, name, role, organization } = userData;
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const userProfile = {
          name,
          email,
          role,
          organization: role === 'Host' || organization ? organization : '',
          createdAt: new Date().toISOString()
      };
      
      const setDocPromise = setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('firestore-timeout')), 5000));
      
      await Promise.race([setDocPromise, timeoutPromise]);
      
      return true;
    } catch (error) {
       console.error("Register Error:", error);
       if (error.code === 'auth/email-already-in-use') {
           throw new Error('Email already registered.');
       }
       if (error.code === 'auth/weak-password') {
           throw new Error('Password should be at least 6 characters.');
       }
       if (error.code === 'auth/password-does-not-meet-requirements') {
           throw new Error('Password must contain at least one special character and a number.');
       }
       if (error.message === 'firestore-timeout' || error.message.includes('offline')) {
           throw new Error('Database connection timed out. Have you created your Firestore Database in the Firebase Console yet?');
       }
       throw new Error(error.message);
    }
  };

  const updateUserProfile = async (updates) => {
    if (!user || (!user.uid && user.uid !== 0)) return false;
    
    try {
      const docRef = doc(db, 'users', user.uid);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('firestore-timeout')), 5000));
      
      await Promise.race([setDoc(docRef, updates, { merge: true }), timeoutPromise]);
      setUser(prev => ({ ...prev, ...updates }));
      return true;
    } catch (error) {
       console.error("Update Profile Error:", error);
       if (error.message === 'firestore-timeout' || error.message?.includes('offline')) {
           throw new Error("Database connection timed out. Changes could not be saved.");
       }
       throw new Error(error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      console.error("Password Reset Error:", error);
      throw new Error(error.message);
    }
  };

  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUserProfile,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'Admin' || (ADMIN_EMAIL && user?.email === ADMIN_EMAIL),
    isHost: user?.role === 'Host' || (ADMIN_EMAIL && user?.email === ADMIN_EMAIL),
    isParticipant: user?.role === 'Participant' || !user?.role || (ADMIN_EMAIL && user?.email === ADMIN_EMAIL)
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
