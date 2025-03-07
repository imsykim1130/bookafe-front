import { create } from 'zustand';

interface AuthType {
  auth: boolean;
  changeAuth: (isAuth: boolean) => void;
}

export const pageStore = create<AuthType>((set) => ({
  auth: false,
  changeAuth: (isAuth) => set({ auth: isAuth }),
}));

export const useAuth = () => pageStore((state) => state.auth);
export const useChangeAuth = () => pageStore((state) => state.changeAuth);
