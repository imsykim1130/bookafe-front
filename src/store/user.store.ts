import { UserResponse } from '@/hook/user.hook';
import { create } from 'zustand';

interface UserType {
  user: UserResponse | null;
  setUser: (user: UserResponse) => void;
  resetUser: () => void;
}

export const userStore = create<UserType>((set) => ({
  user: null, // 초기 상태
  setUser: (newUser: UserResponse) => set({ user: newUser }),
  resetUser: () => set({user: null}),
}));

export const useUser = () => userStore((state) => state.user);
export const useSetUser = () => userStore((state) => state.setUser);
export const useResetUser = () => userStore((state) => state.resetUser);
