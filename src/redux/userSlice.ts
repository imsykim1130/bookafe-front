import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserItem } from '../api/item.ts';

export interface userState {
  id: number | null;
  email: string;
  nickname: string;
  profileImg: string;
  createDate: string;
  role: string;
  loading: boolean;
  error: boolean;
}

// slice 는 작은 store 이다.
export const userSlice = createSlice({
  name: 'user', // slice 이름
  // 초기 상태
  initialState: {
    id: 0,
    email: '',
    nickname: '',
    profileImg: '',
    createDate: '',
    role: '',
    loading: false,
    error: false,
  },
  // reducer
  reducers: {
    update: (state, action: PayloadAction<UserItem>) => {
      return {
        ...state,
        id: action.payload.id,
        email: action.payload.email,
        nickname: action.payload.nickname,
        profileImg: action.payload.profileImg,
        createDate: action.payload.createDate,
        role: action.payload.role,
        loading: false,
        error: false,
      };
    },
    reset: (state) => {
      return {
        ...state,
        id: 0,
        email: '',
        nickname: '',
        profileImg: '',
        createDate: '',
        role: '',
        loading: false,
        error: false,
      };
    },
    loading: (state) => {
      return { ...state, loading: true, error: false };
    },
    error: (state) => {
      return { ...state, error: true };
    },
    updateProfileImage: (state, action: PayloadAction<string>) => {
      return { ...state, profileImg: action.payload };
    },
  },
});

// slice 에서 추출하여 action 을 자동으로 만들어서 추출할 수 있다.
// 액션 함수를 따로 만들지 않고 해당 액션을 dispatch 함수에 넣어주면 된다.
export const { update, reset, loading, error, updateProfileImage } = userSlice.actions;
