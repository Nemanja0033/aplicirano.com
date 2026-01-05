'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';

const AuthContext = createContext<{ user: any; token: string | null }>({ user: null, token: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // hydrate iz localStorage da token ne bude null na kratko
    const cached = localStorage.getItem('authToken');
    if (cached) setToken(cached);

    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const t = await u.getIdToken();
        setToken(t);
        localStorage.setItem('authToken', t);
      } else {
        setToken(null);
        localStorage.removeItem('authToken');
      }
    });
    return () => unsub();
  }, []);

  return <AuthContext.Provider value={{ user, token }}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
