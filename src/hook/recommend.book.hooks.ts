import { request } from '@/api/template';
import { queryClient } from '@/main';
import { ErrorResponse } from '@/types/common.type';
import { RecommendBook } from '@/types/item';
import { DOMAIN } from '@/utils/env';
import { skipToken, useMutation, useQuery } from '@tanstack/react-query';
import { useUserQuery } from './user.hook';

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
  const { user } = useUserQuery();

  const query = () => request.get<boolean>(DOMAIN + '/admin/book/is-recommended?isbn=' + isbn);

  const {
    data,
    isLoading: isRecommendedLoading,
    isError: isRecommendedError,
    refetch: refetchIsRecommended,
  } = useQuery({
    queryKey: [isBookRecommendedQueryKey, isbn],
    queryFn: user && !!isbn && user?.role === 'ROLE_ADMIN' ? query : skipToken,
    staleTime: Infinity,
  });

  const isRecommended = data ? data : false;

  return { isRecommended, isRecommendedLoading, isRecommendedError, refetchIsRecommended };
};

// 추천 책 리스트 쿼리
interface UseRecommendBookListQueryReturn {
  recommendBookList: RecommendBook[] | undefined;
  isRecommendBookListLoading: boolean;
  isRecommendBookListError: boolean;
  refetchRecommendBookList: () => void;
}

type UseRecommendBookListQuery = () => UseRecommendBookListQueryReturn;

export const recommendBookListQueryKey = 'recommendBookList';

export const useRecommendBookListQuery: UseRecommendBookListQuery = () => {
  const {
    data: recommendBookList,
    isError: isRecommendBookListError,
    isLoading: isRecommendBookListLoading,
    refetch: refetchRecommendBookList,
  } = useQuery({
    queryKey: [recommendBookListQueryKey],
    queryFn: () => {
      return request.get<RecommendBook[]>(DOMAIN + '/admin/books/recommend');
    },
    placeholderData: [],
    staleTime: 1000 * 60 * 60,
  });

  return { recommendBookList, isRecommendBookListError, isRecommendBookListLoading, refetchRecommendBookList };
};

//// 추천 책 mutation
type UseRecommendBookMutationParams = {
  onRecommendSuccess?: () => void;
  onRecommendError?: (err: ErrorResponse) => void;

  onUnrecommendSuccess?: () => void;
  onUnrecommendError?: (err: ErrorResponse) => void;
};

interface UseRecommendBookMutationReturn {
  recommend: (isbn: string) => void;
  isRecommendPending: boolean;

  unrecommend: (isbn: string) => void;
  isUnrecommendPending: boolean;

  invalidateRecommendBookList: () => void;
}

type UseRecommendBookMutation = (params?: UseRecommendBookMutationParams) => UseRecommendBookMutationReturn;

export const useRecommendBookMutation: UseRecommendBookMutation = (params?: UseRecommendBookMutationParams) => {
  // 책 추천하기
  const { mutate: recommend, isPending: isRecommendPending } = useMutation({
    mutationFn: (isbn: string) => {
      console.log('책 추천');
      return request.post(DOMAIN + '/admin/book/recommend?isbn=' + isbn, null);
    },
    onSuccess: params?.onRecommendSuccess,
    onError: params?.onRecommendError,
  });

  // 책 추천 취소하기
  const { mutate: unrecommend, isPending: isUnrecommendPending } = useMutation({
    mutationFn: (isbn: string) => {
      console.log('책 추천 취소');
      return request.delete(DOMAIN + '/admin/book/recommend?isbn=' + isbn);
    },
    onSuccess: params?.onUnrecommendSuccess,
    onError: params?.onUnrecommendError,
  });

  const invalidateRecommendBookList = () => {
    queryClient.invalidateQueries({
      queryKey: [recommendBookListQueryKey],
    });
  };

  return { recommend, isRecommendPending, unrecommend, isUnrecommendPending, invalidateRecommendBookList };
};
