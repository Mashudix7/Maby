import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [coupleId, setCoupleId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile + couple membership for a given user id
  async function loadUserData(userId) {
    try {
      // Fetch profile
      const { data: prof } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      setProfile(prof);

      // Fetch couple membership
      let { data: membership } = await supabase
        .from('couple_members')
        .select('couple_id')
        .eq('user_id', userId)
        .single();
        
      let finalCoupleId = membership?.couple_id;

      // AUTO-COUPLE LOGIC FOR MABY
      if (!finalCoupleId) {
         const { data: existingCouples } = await supabase.from('couples').select('id').limit(1);
         if (existingCouples && existingCouples.length > 0) {
            const cId = existingCouples[0].id;
            await supabase.from('couple_members').insert({ user_id: userId, couple_id: cId });
            finalCoupleId = cId;
         } else {
            const { data: newCouple } = await supabase.from('couples').insert({}).select('id').single();
            if (newCouple) {
              await supabase.from('couple_members').insert({ user_id: userId, couple_id: newCouple.id });
              finalCoupleId = newCouple.id;
            }
         }
      }

      setCoupleId(finalCoupleId || null);
    } catch (err) {
      console.error('Error loading user data:', err);
    }
  }

  useEffect(() => {
    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        loadUserData(currentUser.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user || null;
        setUser(currentUser);
        if (currentUser) {
          await loadUserData(currentUser.id);
        } else {
          setProfile(null);
          setCoupleId(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Auth actions
  async function signUp(email, password, displayName) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName },
      },
    });
    if (error) throw error;
    return data;
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
    setProfile(null);
    setCoupleId(null);
  }

  // Refresh couple data (called after couple create/join)
  async function refreshCouple() {
    if (!user) return;
    const { data } = await supabase
      .from('couple_members')
      .select('couple_id')
      .eq('user_id', user.id)
      .single();
    setCoupleId(data?.couple_id || null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        coupleId,
        loading,
        signUp,
        signIn,
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
