"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyATKZqa6UQdHZxEAmBVNWQMSCYrSuECSPM",
  authDomain: "noteapp-dfe32.firebaseapp.com",
  projectId: "noteapp-dfe32",
  storageBucket: "noteapp-dfe32.firebasestorage.app",
  messagingSenderId: "448588507094",
  appId: "1:448588507094:web:22db64a7e361bad5a9e677",
  measurementId: "G-MZFFT0LYVJ"
};

interface FirebaseContextType {
  app: any;
  auth: any;
  provider: GoogleAuthProvider;
}

const FirebaseContext = createContext<FirebaseContextType | null>(null);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [firebase, setFirebase] = useState<FirebaseContextType | null>(null);

  useEffect(() => {
    try {
      const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      
      setFirebase({ app, auth, provider });
    } catch (error) {
      console.error("Firebase initialization error:", error);
    }
  }, []);

  if (!firebase) {
    return null; // or loading spinner
  }

  return (
    <FirebaseContext.Provider value={firebase}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be used within a FirebaseProvider");
  }
  return context;
};