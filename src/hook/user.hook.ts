import { request } from '@/api/template';
import { queryClient } from '@/main';
import { ErrorResponse } from '@/types/common.type';
import { DOMAIN } from '@/utils/env';
import { useMutation, useQuery } from '@tanstack/react-query';

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
    enabled: false,
    retry: 0,
    initialData: null,
  });

  const resetUser = () => {
    // 캐시 초기화
    queryClient.resetQueries({
      queryKey: [userKey],
    });
  };

  const setUser = (user: UserResponse) => {
    // 캐시에 수동으로 값 넣기
    queryClient.setQueryData([userKey], user);
  };

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
    queryFn: () => request.getWithParams<SearchUser[], UseSearchUserListQueryParams>(DOMAIN + '/user/search', params),
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

  cancelUser: () => void;
  isCancelUserPending: boolean;
}

type UseUserMutation = () => UseUserMutationReturn;

// mutation
export const useUserMutation: UseUserMutation = () => {
  // 프로필 이미지 변경
  const { mutate: changeProfileImage, isPending: isChangeProfileImagePending } = useMutation({
    mutationFn: (img: File) => {
      // 파일은 Form 에 담아 전달 해야한다
      const formData = new FormData();
      formData.append('data', img);

      return request.postFormData(DOMAIN + '/user/profile-image', formData);
    },
  });

  // 탈퇴하기
  const { mutate: cancelUser, isPending: isCancelUserPending } = useMutation({
    mutationFn: () => {
      return request.delete(DOMAIN + '/user');
    },
    onSuccess: () => {
      // 탈퇴 성공 시 로그아웃을 위한 url 로 이동
      window.location.href = "/auth/sign-in?logout=true";
    },
    onError: (err: ErrorResponse) => {
      console.log(err.message);
      window.alert("다시 시도해주세요");
    }
  });

  return { changeProfileImage, isChangeProfileImagePending, cancelUser, isCancelUserPending };
};
