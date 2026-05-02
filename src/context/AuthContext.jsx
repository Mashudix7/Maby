import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { onAuthStateChanged, signInWithEmailAndPassword, signOut as firebaseSignOut, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [coupleId, setCoupleId] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadUserData(firebaseUser) {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);
      
      let userData = null;
      const FIXED_COUPLE_ID = 'maby-space-1';

      if (userSnap.exists()) {
        userData = userSnap.data();
      } else {
        userData = {
          display_name: firebaseUser.displayName || 'Pengguna',
          avatar_url: '',
          couple_id: FIXED_COUPLE_ID
        };
        await setDoc(userRef, userData);
      }
      
      setProfile(userData);
      setCoupleId(FIXED_COUPLE_ID);
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  }

  useEffect(() => {
    let mounted = true;
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (mounted) setUser(firebaseUser);
      
      if (firebaseUser) {
        if (!profile && mounted) setLoading(true);
        await loadUserData(firebaseUser);
        if (mounted) setLoading(false);
      } else {
        if (mounted) {
          setProfile(null);
          setCoupleId(null);
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  async function signIn(email, password) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  }
  
  async function signUp(email, password, displayName) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential.user;
  }

  async function signOut() {
    await firebaseSignOut(auth);
    setUser(null);
    setProfile(null);
    setCoupleId(null);
  }

  async function refreshCouple() {
    // Dengan firebase + single couple, tidak perlu refresh membership
    setCoupleId('maby-space-1');
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        coupleId,
        loading,
        signIn,
        signUp,
        signOut,
        refreshCouple,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
