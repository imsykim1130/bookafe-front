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

      return request.postFormData(DOMAIN + '/user/profile-image', formData);
    },
    onSuccess: () => {
      window.alert('프로필 이미지 변경 성공! 이미지 변경은 잠시 후 적용됩니다.');
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

  return {
    changeProfileImage,
    isChangeProfileImagePending,
    isChangeProfileImageSuccess,
    isChangeProfileImageError,
    cancelUser,
    isCancelUserPending,
    initProfileImg,
    isInitProfileImgPending,
  };
};
