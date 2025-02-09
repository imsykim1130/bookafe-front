import { UserItem } from '@/api/item';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type UserState = {
  user: UserItem | null;
  totalPoint: number;
  loading: boolean;
  error: boolean;
};

type UserAction = {
  updateUser: (user: UserItem, totalPoint: number) => void;
  resetUser: () => void;
  loadingUser: () => void;
  errorUser: () => void;
  updateProfileImg: (profileImg: string) => void;
};


// immer 를 사용하면 draft(proxy) 의 변경을 반영하여 다음 state 로 넘겨준다. 변경점이 없는 데이터는 그대로 사용한다.
export const useUserStore = create<UserState & UserAction>()(
  immer((set) => ({
    user: null,
    totalPoint: 0,
    loading: false,
    error: false,

    updateUser: (user: UserItem, totalPoint: number) => {
      set(draft => {
        draft.user = user;
        draft.totalPoint = totalPoint;
      })
    },
    resetUser: () => {
      set(draft => {
        draft.user = null;
        draft.loading = false;
        draft.error = false;
      })
    },
    loadingUser: () => {
      set(draft => {
        draft.loading = true;
        draft.error = false;
      });
    },
    errorUser: () => {
      set(draft => {
        draft.loading = false;
        draft.error = true;
      });
    },
    updateProfileImg: (profileImg: string) => {
      set((draft) => {
        if(!draft.user) return;
        draft.user.profileImg = profileImg;
      })
    },
  })),
);
