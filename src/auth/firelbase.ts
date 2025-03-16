import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAc5yOVMNHieaFTq8Z-knMsQ3VPrOULlpI',
  authDomain: 'bookafe-865f7.firebaseapp.com',
  projectId: 'bookafe-865f7',
  storageBucket: 'bookafe-865f7.firebasestorage.app',
  messagingSenderId: '318255229796',
  appId: '1:318255229796:web:cffb1b5e806eaf14dbe871',
};

initializeApp(firebaseConfig);

export const auth = getAuth();
export const provider = new GoogleAuthProvider();

export const signInGoogle = () => {
  return signInWithPopup(auth, provider);
};

export const signOutGoogle = () => {
  console.log('signOut');
  return signOut(auth);
};
