import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, database } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, onValue } from 'firebase/database';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);

      if (user) {
        // Fetch user role from database
        const userRef = ref(database, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          setUserRole(data?.role || 'student');
          setLoading(false);
        }, { onlyOnce: true });
      } else {
        setUserRole(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    currentUser,
    user: {
      id: currentUser?.uid || '',
      name: currentUser?.displayName || currentUser?.email || 'User',
      role: userRole || 'student'
    },
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};