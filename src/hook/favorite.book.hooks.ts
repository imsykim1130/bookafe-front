// 책의 좋아요 정보

import { request } from '@/api/template';
import { DOMAIN } from '@/utils/env';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ErrorResponse } from '@/types/common.type';

// query
// 책 좋아요 여부
type UseIsFavoriteBookQueryParams = {
  isbn: string;
};

interface UseIsFavoriteBookQueryReturn {
  isFavoriteBook: boolean;
  isFavoriteBookLoading: boolean;
  isFavoriteBookError: boolean;
  refetchIsFavoriteBook: () => void;
}

type UseIsFavoriteBookQuery = (params: UseIsFavoriteBookQueryParams) => UseIsFavoriteBookQueryReturn;

export const isFavoriteBookQueryKey = 'isFavoriteBook';

export const UseIsFavoriteBookQuery: UseIsFavoriteBookQuery = (params: UseIsFavoriteBookQueryParams) => {
  const {
    data: isFavoriteBook,
    isLoading: isFavoriteBookLoading,
    isError: isFavoriteBookError,
    refetch: refetchIsFavoriteBook,
  } = useQuery({
    queryKey: [isFavoriteBookQueryKey, params.isbn],
    queryFn: () => {
        return request.get<boolean>(DOMAIN + "/favorite/" + params.isbn);
    },
    initialData: false,
    staleTime: Infinity,
  });

  return { isFavoriteBook, isFavoriteBookLoading, isFavoriteBookError, refetchIsFavoriteBook };
};




// mutation
type UseFavoriteBookMutationParams = {
  isbn: string;

  onBeforeLikeBook?: () => void;
  onLikeBookError?: (error: ErrorResponse) => void;
  onLikeBookSuccess?: () => void;

  onBeforeUnlikeBook? : () => void;
  onUnlikeBookError?: (error: ErrorResponse) => void;
  onUnlikeBookSuccess?: () => void;
}

interface UseFavoriteBookMutationReturn {
  likeBook: () => void;
  isLikeBookPending: boolean;

  unlikeBook: () => void;
  isUnlikeBookPending: boolean;
}

type UseFavoriteBookMutation = (params: UseFavoriteBookMutationParams) => UseFavoriteBookMutationReturn;

export const useFavoriteBookMutation: UseFavoriteBookMutation = (params) => {

  const {onBeforeLikeBook,onLikeBookError, onLikeBookSuccess, onBeforeUnlikeBook, onUnlikeBookError, onUnlikeBookSuccess} = params;

  // 책 좋아요
  const {mutate: likeBook, isPending: isLikeBookPending} = useMutation({
    onMutate: onBeforeLikeBook, // 좋아요 응답을 받기 전 사용자에게 바로 변경 사항을 보여주기 위해 사용
    mutationFn: () => {
      return request.put(DOMAIN + "/favorite/" + params.isbn, null);
    },
    onError: onLikeBookError,
    onSuccess: onLikeBookSuccess,
  })

  const {mutate: unlikeBook, isPending: isUnlikeBookPending} = useMutation({
    onMutate: onBeforeUnlikeBook,
    mutationFn: () => {
      return request.delete(DOMAIN + "/favorite/" + params.isbn);
    },
    onError: onUnlikeBookError,
    onSuccess: onUnlikeBookSuccess,
  })

  return {likeBook, isLikeBookPending, unlikeBook, isUnlikeBookPending};
}


