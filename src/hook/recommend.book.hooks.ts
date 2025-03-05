import { request } from '@/api/template';
import { useUser } from '@/store/user.store';
import { DOMAIN } from '@/utils/env';
import { useMutation, useQuery } from '@tanstack/react-query';


//// 관리자의 책 추천 여부
type UseIsBookRecommendedQueryParams = {
  isbn: string | undefined;
};

interface UseIsBookRecommendedQueryReturn {
  isRecommended: boolean;
  isRecommendedLoading: boolean;
  isRecommendedError: boolean;
  refetchIsRecommended: () => void;
}

type UseIsBookRecommendedQuery = (params: UseIsBookRecommendedQueryParams) => UseIsBookRecommendedQueryReturn;

export const isBookRecommendedQueryKey = 'recommendedByAdmin';

export const useRecommendQuery: UseIsBookRecommendedQuery = (params: UseIsBookRecommendedQueryParams) => {
  const { isbn } = params;
  const user = useUser();

  const {
    data: isRecommended,
    isLoading: isRecommendedLoading,
    isError: isRecommendedError,
    refetch: refetchIsRecommended,
  } = useQuery({
    queryKey: [isBookRecommendedQueryKey, isbn],
    queryFn: () => {
      return request.getWithParams<boolean, UseIsBookRecommendedQueryParams>(
        DOMAIN + '/recommend-book/is-recommended/' + isbn,
        params,
      );
    },
    staleTime: Infinity,
    enabled: !!isbn && user?.role === 'ROLE_ADMIN',
    initialData: false,
  });

  return { isRecommended, isRecommendedLoading, isRecommendedError, refetchIsRecommended };
};


//// 추천 책 mutation
type UseRecommendBookMutationParams = {
  isbn: string | undefined;

  onRecommendSuccess?: () => void;
  onRecommendError?: () => void;

  onUnrecommendSuccess?: () => void;
  onUnrecommendError?: () => void;
};

interface UseRecommendBookMutationReturn {
  recommend: () => void;
  isRecommendPending: boolean;

  unrecommend: () => void;
  isUnrecommendPending: boolean;
}

type UseRecommendBookMutation = (params: UseRecommendBookMutationParams) => UseRecommendBookMutationReturn;

export const useRecommendBookMutation: UseRecommendBookMutation = (params: UseRecommendBookMutationParams) => {
  // 책 추천하기
  const { mutate: recommend, isPending: isRecommendPending } = useMutation({
    mutationFn: () => {
      return request.post(DOMAIN + '/recommend-book/' + params.isbn, null);
    },
    onSuccess: params.onRecommendSuccess,
    onError: params.onRecommendError,
  });

  // 책 추천 취소하기
  const { mutate: unrecommend, isPending: isUnrecommendPending } = useMutation({
    mutationFn: () => {
      return request.delete(DOMAIN + '/recommend-book/' + params.isbn);
    },
    onSuccess: params.onUnrecommendSuccess,
    onError: params.onUnrecommendError,
  });

  return { recommend, isRecommendPending, unrecommend, isUnrecommendPending };
};
