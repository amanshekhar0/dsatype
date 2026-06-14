import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

export interface GoogleProfile {
  email: string;
  name: string;
  picture?: string;
  sub: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  googleLogin: (profile: GoogleProfile) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'codetype_users';
const SESSION_KEY = 'codetype_session';

function hashPassword(password: string): string {
  let hash = 0;
  const str = password + '_codetype_2024';
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}

function getUsers(): User[] {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (sessionId) {
      const found = getUsers().find(u => u.id === sessionId);
      if (found) setUser(found);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const users = getUsers();
    const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!found) return { success: false, error: 'No account found with this email.' };
    if (found.passwordHash !== hashPassword(password))
      return { success: false, error: 'Incorrect password.' };
    setUser(found);
    localStorage.setItem(SESSION_KEY, found.id);
    return { success: true };
  };

  const signup = async (username: string, email: string, password: string) => {
    if (username.length < 3) return { success: false, error: 'Username must be at least 3 characters.' };
    if (password.length < 6) return { success: false, error: 'Password must be at least 6 characters.' };
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
      return { success: false, error: 'An account with this email already exists.' };
    if (users.find(u => u.username.toLowerCase() === username.toLowerCase()))
      return { success: false, error: 'Username is already taken.' };

    const newUser: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      username,
      email,
      passwordHash: hashPassword(password),
      createdAt: Date.now(),
    };
    saveUsers([...users, newUser]);
    setUser(newUser);
    localStorage.setItem(SESSION_KEY, newUser.id);
    return { success: true };
  };

  const googleLogin = async (profile: GoogleProfile) => {
    const users = getUsers();
    let found = users.find(u => u.email.toLowerCase() === profile.email.toLowerCase());

    if (!found) {
      // Create user if they don't exist
      let baseUsername = profile.name ? profile.name.toLowerCase().replace(/\s+/g, '') : profile.email.split('@')[0];
      let username = baseUsername;
      let counter = 1;
      while (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      found = {
        id: `user_google_${profile.sub}`,
        username,
        email: profile.email,
        passwordHash: 'google_oauth_provider', // dummy hash to satisfy typescript
        createdAt: Date.now(),
        picture: profile.picture,
      };
      saveUsers([...users, found]);
    } else if (profile.picture && found.picture !== profile.picture) {
      found.picture = profile.picture;
      saveUsers(users.map(u => u.id === found!.id ? found! : u));
    }

    setUser(found);
    localStorage.setItem(SESSION_KEY, found.id);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
