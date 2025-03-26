import { request } from '@/api/template';
import { queryClient } from '@/main';
import { ErrorResponse } from '@/types/common.type';
import { DOMAIN } from '@/utils/env';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';

// 유저 검색 쿼리
export type UserResponse = {
  id: number;
  email: string;
  nickname: string;
  profileImg: string;
  createDate: string;
  role: string;
};

interface UseUserQueryReturn {
  user: UserResponse | null;
  isUserLoading: boolean;
  isUserError: boolean;
  refetchUser: () => void;
  resetUser: () => void;
  setUser: (user: UserResponse) => void;
}

type UseUserQuery = () => UseUserQueryReturn;

export const userKey = 'user';

export const useUserQuery: UseUserQuery = () => {
  const {
    data: user,
    isError: isUserError,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: [userKey],
    queryFn: async () => {
      return await request
        .get<UserResponse>(DOMAIN + '/user')
        .then((user) => user)
        .catch(() => null);
    },
    staleTime: Infinity,
    gcTime: Infinity,
    retry: false,
    initialData: null,
  });

  // 캐시 초기화
  const resetUser = useCallback(() => {
    queryClient.resetQueries({
      queryKey: [userKey],
    });
  }, []);

  // 캐시에 수동으로 값 넣기
  const setUser = useCallback((user: UserResponse) => {
    queryClient.setQueryData([userKey], user);
  }, []);

  // 새로고침 시 localStorage에서 유저 정보 복구
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      queryClient.setQueryData(['user'], JSON.parse(storedUser));
    }
  }, [resetUser, setUser, refetchUser]);

  return { user, isUserError, isUserLoading, refetchUser, resetUser, setUser };
};

// 유저 검색 리스트 쿼리
export const searchUserListQueryKey = 'searchUserList';

export type SearchUser = {
  id: number;
  email: string;
  datetime: string;
  point: number;
  commentCount: number;
};

type UseSearchUserListQueryParams = {
  searchWord: string;
  filter?: 'nickname' | 'email';
};

interface UseSearchUserListQueryReturn {
  searchUserList: SearchUser[];
  isSearchUserListLoading: boolean;
  isSearchUserListError: boolean;
  refetchSearchUserList: () => void;
}

type UseSearchUserListQuery = (params: UseSearchUserListQueryParams) => UseSearchUserListQueryReturn;

export const useSearchUserListQuery: UseSearchUserListQuery = (params: UseSearchUserListQueryParams) => {
  const {
    data: searchUserList,
    isError: isSearchUserListError,
    isLoading: isSearchUserListLoading,
    refetch: refetchSearchUserList,
  } = useQuery({
    queryKey: [searchUserListQueryKey],
    queryFn: () =>
      request.getWithParams<SearchUser[], UseSearchUserListQueryParams>(DOMAIN + '/admin/user/search', params),
    initialData: [],
    enabled: false,
  });

  return { searchUserList, isSearchUserListLoading, isSearchUserListError, refetchSearchUserList };
};

// user mutation
// types
interface UseUserMutationReturn {
  changeProfileImage: (img: File) => void;
  isChangeProfileImagePending: boolean;
  isChangeProfileImageSuccess: boolean;
  isChangeProfileImageError: boolean;

  cancelUser: () => void;
  isCancelUserPending: boolean;

  initProfileImg: () => void;
  isInitProfileImgPending: boolean;

  changeNickname: (nickname: string) => void;
  isChangeNicknamePending: boolean;
}

type UseUserMutation = () => UseUserMutationReturn;

// mutation
export const useUserMutation: UseUserMutation = () => {
  // 프로필 이미지 변경
  const {
    mutate: changeProfileImage,
    isPending: isChangeProfileImagePending,
    isSuccess: isChangeProfileImageSuccess,
    isError: isChangeProfileImageError,
  } = useMutation({
    mutationFn: (img: File) => {
      // 파일은 Form 에 담아 전달 해야한다
      const formData = new FormData();
      formData.append('file', img);

      return request.postFormData<string>(DOMAIN + '/user/profile-image', formData);
    },
    onSuccess: (url: string) => {
      window.alert('프로필 이미지 변경 성공! 이미지 변경은 잠시 후 적용됩니다.');

      const oldUser = JSON.parse(localStorage.getItem('user') as string) as UserResponse;
      const newUser = JSON.stringify({ ...oldUser, profileImg: url });
      localStorage.setItem('user', newUser);
      queryClient.setQueryData([userKey], newUser);
    },
    onError: (err: ErrorResponse) => {
      window.alert(err.message);
    },
  });

  // 프로필 이미지 초기화
  const { mutate: initProfileImg, isPending: isInitProfileImgPending } = useMutation({
    mutationFn: () => {
      return request.delete(DOMAIN + '/user/profile-image');
    },
    onSuccess: () => {
      window.alert('프로필 이미지 초기화 완료! 잠시 후 적용됩니다');

      const oldUser = JSON.parse(localStorage.getItem('user') as string) as UserResponse;
      const newUser = JSON.stringify({ ...oldUser, profileImg: null });
      localStorage.setItem('user', newUser);
      queryClient.setQueryData([userKey], newUser);
    },
    onError: (err: ErrorResponse) => {
      console.log(err.message);
      window.alert('다시 시도해주세요');
    },
  });

  // 탈퇴하다
  const { mutate: cancelUser, isPending: isCancelUserPending } = useMutation({
    mutationFn: () => {
      return request.delete(DOMAIN + '/user');
    },
    onSuccess: () => {
      // 탈퇴 성공 시 로그아웃을 위한 url 로 이동
      window.location.href = '/auth/sign-in?logout=true';
    },
    onError: (err: ErrorResponse) => {
      console.log(err.message);
      window.alert('다시 시도해주세요');
    },
  });

  // 닉네임 변경하기
  const { mutate: changeNickname, isPending: isChangeNicknamePending } = useMutation({
    mutationFn: (nickname: string) => {
      return request.patch<{ nickname: string }, string>(DOMAIN + '/user/nickname', { nickname });
    },
    onSuccess: (newNickname: string) => {
      // 성공 메세지
      window.alert('닉네임 변경 성공!');
      // 로컬 스토리지와 캐시값의 nickname 변경
      const oldUser = JSON.parse(localStorage.getItem('user') as string) as UserResponse;
      const newUser = JSON.stringify({ ...oldUser, nickname: newNickname });
      localStorage.setItem('user', newUser);
      queryClient.setQueryData([userKey], newUser);
      // 새로고침하여 유저 페이지에 보이는 유저 정보 다시 가져오기
      // 유저 페이지의 유저 정보는 유저 id 에 따라 변경되기 때문에 내 페이지라고 해도 전역으로 사용하는 유저 정보와 따로 다시 유저 정보를 요청해서 가져온다
      window.location.reload();
    },
    onError: (err: ErrorResponse) => {
      console.log(err.message);
      window.alert('다시 시도해주세요');
    },
  });

  return {
    changeProfileImage,
    isChangeProfileImagePending,
    isChangeProfileImageSuccess,
    isChangeProfileImageError,
    cancelUser,
    isCancelUserPending,
    initProfileImg,
    isInitProfileImgPending,
    changeNickname,
    isChangeNicknamePending,
  };
};
