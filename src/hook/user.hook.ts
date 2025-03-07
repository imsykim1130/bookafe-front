import { request } from '@/api/template';
import { DOMAIN } from '@/utils/env';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// user query
// types
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

// query
export const useUserQuery: UseUserQuery = () => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isError: isUserError,
    isLoading: isUserLoading,
    refetch: refetchUser,
  } = useQuery({
    queryKey: [userKey],
    queryFn: async () => {
      console.log('user fetching');
      return await request
        .get<UserResponse>(DOMAIN + '/user')
        .then((user) => user)
        .catch(() => null);
    },
    retry: 0,
    enabled: false,
    staleTime: Infinity,
    initialData: null,
    gcTime: 1000 * 60 * 60, // 1시간
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

// user mutation
// types
interface UseUserMutationReturn {
  changeProfileImage: (img: File) => void;
  isChangeProfileImagePending: boolean;
}

type UseUserMutation = () => UseUserMutationReturn;

// mutation
export const useUserMutation: UseUserMutation = () => {
  const { mutate: changeProfileImage, isPending: isChangeProfileImagePending } = useMutation({
    mutationFn: (img: File) => {
      // 파일은 Form 에 담아 전달 해야한다
      const formData = new FormData();
      formData.append('data', img);

      return request.postFormData(DOMAIN + '/user/profile-image', formData);
    },
  });

  return { changeProfileImage, isChangeProfileImagePending };
};
