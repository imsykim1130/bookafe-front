import { request } from '@/api/template';
import { ErrorResponse } from '@/types/common.type';
import { DOMAIN } from '@/utils/env';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

// top10 쿼리
type Top10Book = {
  isbn: string;
  bookImg: string;
  title: string;
  author: string;
  favoriteCount: number;
};

interface UseTop10QueryReturn {
  bookList: Top10Book[] | undefined;
  isTop10Loading: boolean;
  isTop10Error: boolean;
}

type UseTop10Query = () => UseTop10QueryReturn;

export const useTop10Query: UseTop10Query = () => {
  const query = () => request.get<Top10Book[]>(DOMAIN + '/books/top10');

  const {
    data: bookList,
    isError: isTop10Error,
    isLoading: isTop10Loading,
  } = useQuery({
    queryKey: [],
    queryFn: query,
  });

  return { bookList, isTop10Loading, isTop10Error };
};

// query
// 책의 좋아요 정보
export type BookFavoriteInfo = {
  isFavorite: boolean;
  favoriteCount: number;
};

type UseFavoriteBookInfoQueryParams = {
  isbn: string | undefined;
};

interface UseBookFavoriteInfoQueryReturn {
  isFavorite: boolean;
  favoriteCount: number;
  isBookFavoriteInfoLoading: boolean;
  isBookFavoriteInfoError: boolean;
  refetchBookFavoriteInfo: () => void;
}

type UseFavoriteBookInfoQuery = (params: UseFavoriteBookInfoQueryParams) => UseBookFavoriteInfoQueryReturn;

export const bookFavoriteInfoQueryKey = 'isFavoriteBook';

export const useBookFavoriteInfoQuery: UseFavoriteBookInfoQuery = (params: UseFavoriteBookInfoQueryParams) => {
  const { isbn } = params;

  const {
    data,
    isLoading: isBookFavoriteInfoLoading,
    isError: isBookFavoriteInfoError,
    refetch: refetchBookFavoriteInfo,
  } = useQuery({
    queryKey: [bookFavoriteInfoQueryKey, params.isbn],
    queryFn: () => {
      if (!isbn) return;
      return request.getWithParams<BookFavoriteInfo, { isbn: string }>(DOMAIN + '/book/like-info', { isbn });
    },
    enabled: isbn !== undefined,
  });

  const isFavorite = data ? data.isFavorite : false;
  const favoriteCount = data ? data.favoriteCount : 0;

  return { isFavorite, favoriteCount, isBookFavoriteInfoLoading, isBookFavoriteInfoError, refetchBookFavoriteInfo };
};

// 좋아요 책 리스트

export type FavoriteBook = {
  isbn: string;
  bookImg: string;
  title: string;
  author: string;
  price: number;
};
type FavoriteBookResponse = {
  favoriteBookList: FavoriteBook[];
  isEnd: boolean;
  totalPages: number;
};

type UseFavoriteBookListQueryParams = {
  size: number;
  page: number;
};
interface UseFavoriteBookListQueryReturn {
  favoriteBookList: FavoriteBook[];
  isEnd: boolean;
  totalPages: number;

  isFavoriteBookListLoading: boolean;
  isFavoriteBookListError: boolean;
  refetchFavoriteBookList: () => void;
}

type UseFavoriteBookListQuery = (params: UseFavoriteBookListQueryParams) => UseFavoriteBookListQueryReturn;

export const favoriteBookListQueryKey = 'favoriteBookList';

export const useFavoriteBookListQuery: UseFavoriteBookListQuery = (params: UseFavoriteBookListQueryParams) => {
  // 좋아요 책 리스트 가져오기
  const {
    data,
    isLoading: isFavoriteBookListLoading,
    isError: isFavoriteBookListError,
    refetch: refetchFavoriteBookList,
  } = useQuery({
    queryKey: [favoriteBookListQueryKey, params.page],
    queryFn: () => {
      return request.getWithParams<FavoriteBookResponse, UseFavoriteBookListQueryParams>(
        DOMAIN + '/books/like',
        params,
      );
    },
    initialData: {
      favoriteBookList: [],
      isEnd: false,
      totalPages: 0,
    },
    staleTime: 1000 * 60 * 60,
  });

  return { ...data, isFavoriteBookListError, isFavoriteBookListLoading, refetchFavoriteBookList };
};

// 좋아요 책 mutation
type UseFavoriteBookMutationParams = {
  onLikeBookError?: (error: ErrorResponse) => void;
  onLikeBookSuccess?: () => void;

  onUnlikeBookError?: (error: ErrorResponse) => void;
  onUnlikeBookSuccess?: () => void;

  onUnlikeBookListSuccess?: () => void;
  onUnlikeBookListError?: (error: ErrorResponse) => void;
};

interface UseFavoriteBookMutationReturn {
  likeBook: (isbn: string) => void;
  isLikeBookPending: boolean;

  unlikeBook: (isbn: string) => void;
  isUnlikeBookPending: boolean;

  unlikeBookList: (isbnList: string[]) => void;
  isUnlikeBookListPending: boolean;
}

type UseFavoriteBookMutation = (params: UseFavoriteBookMutationParams) => UseFavoriteBookMutationReturn;

export const useFavoriteBookMutation: UseFavoriteBookMutation = (params) => {
  const {
    onLikeBookError,
    onLikeBookSuccess,
    onUnlikeBookError,
    onUnlikeBookSuccess,
    onUnlikeBookListSuccess,
    onUnlikeBookListError,
  } = params;

  // 책 좋아요
  const { mutate: likeBook, isPending: isLikeBookPending } = useMutation({
    mutationFn: (isbn: string) => {
      return request.post<null, void>(DOMAIN + '/book/like?isbn=' + isbn, null);
    },
    onError: onLikeBookError,
    onSuccess: onLikeBookSuccess,
  });

  // 책 좋아요 취소
  const { mutate: unlikeBook, isPending: isUnlikeBookPending } = useMutation({
    mutationFn: (isbn: string) => {
      return request.delete<void>(DOMAIN + '/book/like?isbn=' + isbn);
    },
    onError: onUnlikeBookError,
    onSuccess: onUnlikeBookSuccess,
  });

  // 좋아요 일괄 취소
  const { mutate: unlikeBookList, isPending: isUnlikeBookListPending } = useMutation({
    mutationFn: (isbnList: string[]) => {
      return request.deleteWithBody<{ isbnList: string[] }>(DOMAIN + '/books/like', { isbnList });
    },
    onError: onUnlikeBookListError,
    onSuccess: onUnlikeBookListSuccess,
  });

  return { likeBook, isLikeBookPending, unlikeBook, isUnlikeBookPending, unlikeBookList, isUnlikeBookListPending };
};

// handler
interface UseFavoriteBookHandlerReturn {
  page: number;
  setPage: (page: number) => void;
  size: number;
  setSize: (size: number) => void;
  checkedBookIsbnList: string[];
  setCheckedBookIsbnList: (isbnList: string[]) => void;
  bookCheckHandler: (isbn: string) => void;
  checkAllClickHandler: (allFavoriteBookIsbn: string[]) => void;
}

type UseFavoriteBookHandler = () => UseFavoriteBookHandlerReturn;

export const useFavoriteBookHandler: UseFavoriteBookHandler = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const [checkedBookIsbnList, setCheckedBookIsbnList] = useState<string[]>([]);

  // 책 체크버튼 누르기 핸들러
  const bookCheckHandler = (isbn: string) => {
    const index = checkedBookIsbnList.indexOf(isbn);

    // 체크 해제
    if (index >= 0) {
      const fixed = [...checkedBookIsbnList];
      fixed.splice(index, 1);
      setCheckedBookIsbnList(fixed);
      return;
    }
    // 체크
    setCheckedBookIsbnList([...checkedBookIsbnList, isbn]);
  };

  /**
   *  @description 전체선택 버튼 누르기 핸들러.
   *  눌러져 있는 상태에서 누르면 전체 선택 취소.
   *  눌러져 있지 않은 상태에서 누르면 전체 선택.
   */
  const checkAllClickHandler = (allFavoriteBookIsbn: string[]) => {
    // 전체선택 취소
    if (allFavoriteBookIsbn.length === checkedBookIsbnList.length) {
      setCheckedBookIsbnList([]);
      return;
    }
    // 전체선택 누름
    setCheckedBookIsbnList(allFavoriteBookIsbn);
  };

  return {
    size,
    setSize,
    page,
    setPage,
    checkedBookIsbnList,
    setCheckedBookIsbnList,
    bookCheckHandler,
    checkAllClickHandler,
  };
};
