// Book 페이지 컴포넌트 관련 상태, 메서드
import { getBookFavoriteInfoRequest, putBookToFavoriteRequest } from '@/api/book.api';
import {
  deleteCommentRequest,
  getCommentFavoriteRequest,
  getCommentListRequest,
  getReplyListRequest,
  modifyCommentRequest,
} from '@/api/common.api';
import { CommentItem } from '@/api/item';
import { request } from '@/api/template';
import { useJwt } from '@/hook/hooks';
import { usePage } from '@/store/page.store';
import { DOMAIN } from '@/utils/env';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { favoriteBookListkey } from './favoriteHooks';

//// 책 상세 정보
type BookResponse = {
  isbn: string;
  bookImg: string;
  title: string;
  price: number;
  publisher: string;
  author: string;
  pubDate: string;
  description: string;
};

type UseBookQueryParams = {
  isbn: string | undefined;
};

interface UseBookQueryReturn {
  book: BookResponse | null;
  isBookLoading: boolean;
  isBookError: boolean;
  refetchBook: () => void;
}

type UseBookQuery = (params: UseBookQueryParams) => UseBookQueryReturn;

export const bookKey = 'book';

export const useBookQuery: UseBookQuery = (params: UseBookQueryParams) => {
  const { isbn } = params;

  const {
    data: book,
    isLoading: isBookLoading,
    isError: isBookError,
    refetch: refetchBook,
  } = useQuery({
    queryKey: [bookKey, isbn],
    queryFn: () => {
      return request.get<BookResponse>(DOMAIN + '/book', false);
    },
    staleTime: Infinity,
    enabled: !!isbn,
    initialData: null,
  });

  return { book, isBookLoading, isBookError, refetchBook };
};

// 오늘의 추천책
// 관리자가 설정한 추천 책 중에서 랜덤한 책 1권

export type RecommendBookResponse = {
  id: number;
  title: string;
  publisher: string;
  author: string;
  bookImg: string;
  isbn: string;
};

interface UseRecommendBookQueryReturn {
  recommendBook: RecommendBookResponse | null;
  isRecommendBookLoading: boolean;
  isRecommendBookError: boolean;
}

type UseRecommendBookQuery = () => UseRecommendBookQueryReturn;

export const recommendBookQueryKey = 'recommendBook';

export const useRecommendBookQuery: UseRecommendBookQuery = () => {
  const {
    data: recommendBook,
    isLoading: isRecommendBookLoading,
    isError: isRecommendBookError,
  } = useQuery({
    queryKey: [recommendBookQueryKey],

    queryFn: () => {
      return request.get<RecommendBookResponse>(DOMAIN + '/book/today');
    },
    initialData: null,
    // refetchInterval: 1000 * 60 * 30, // 30분마다 한 번 씩 실행
  });

  return { recommendBook, isRecommendBookLoading, isRecommendBookError };
};

//// 좋아요 버튼 컴포넌트 관련 상태 & 핸들러
// 책의 좋아요 정보
export const bookFavoriteInfoKey = 'bookFavoriteInfo';

export const useBookFavoriteInfoQuery = (isbn: string | undefined) => {
  const { jwt } = useJwt();
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null);
  const [favoriteCount, setFavoriteCount] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const {
    data: bookFavoriteInfo,
    isLoading: bookFavoriteInfoIsLoading,
    error: bookFavoriteInfoError,
  } = useQuery({
    queryKey: [bookFavoriteInfoKey],
    queryFn: () => {
      if (!isbn || !jwt) return;
      return getBookFavoriteInfoRequest(jwt, isbn);
    },
    enabled: jwt !== undefined && !!isbn,
  });

  // 책에 좋아요 누르기
  const putFavorite = () => {
    if (!isbn) return;

    if (!jwt) {
      window.alert('로그인이 필요합니다');
      return;
    }
    const currentFavoriteCount = favoriteCount as number;
    // 사용자 경험 개선을 위해 요청 성공 전 변경사항 화면에 바로 적용
    setIsFavorite(true);
    setFavoriteCount(currentFavoriteCount + 1);

    putBookToFavoriteRequest(jwt, isbn).then((isSuccess) => {
      // 실패
      if (!isSuccess) {
        window.alert('잠시후 다시 시도해주세요');
        // 요청 실패 시 변경사항 원복
        setIsFavorite(false);
        setFavoriteCount(currentFavoriteCount);
        return;
      }
      // 성공
      // 성공 시 책의 좋아요 정보와 좋아요 책 리스트 모두 캐시 무효화하여 다시 가져오기
      queryClient.invalidateQueries({
        queryKey: [bookFavoriteInfoKey, favoriteBookListkey],
      });
    });
  };

  // 책의 좋아요 취소
  const cancelFavorite = () => {};

  useEffect(() => {
    if (bookFavoriteInfo) {
      setIsFavorite(bookFavoriteInfo.isFavorite);
      setFavoriteCount(bookFavoriteInfo.favoriteCount);
    }
  }, [bookFavoriteInfo]);

  return { isFavorite, favoriteCount, bookFavoriteInfoIsLoading, bookFavoriteInfoError, putFavorite, cancelFavorite };
};

//// 리뷰 리스트
export const reviewListKey = 'reviewList';

export const useReviewListQuery = (isbn: string | undefined, isBookLoading: boolean) => {
  const page = usePage();
  // 리뷰 리스트
  const {
    data: reviewList,
    isLoading: isReviewListLoading,
    error: reviewListError,
  } = useQuery({
    queryKey: [reviewListKey, isbn, page],
    queryFn: async () => {
      if (!isbn) return;
      const result = await getCommentListRequest(isbn);
      return result;
    },
    enabled: !!isbn && !isBookLoading,
    staleTime: 1000 * 60 * 30, // 30분
  });

  return { reviewList, isReviewListLoading, reviewListError };
};

////
export const useReviewHandler = () => {
  const { isbn } = useParams();
  const { jwt } = useJwt();
  const queryClient = useQueryClient();

  const [content, setContent] = useState<string>('');

  // 리뷰 수정
  const updateReview = (reviewId: number, page: number) => {
    modifyCommentRequest(jwt, reviewId, content).then((res) => {
      if (!res) {
        window.alert('리뷰 수정 실패. 다시 시도해주세요');
        return;
      }
      // 리뷰 수정 성공 시 리뷰 리스트 캐시 수정
      queryClient.setQueryData([reviewListKey, page, reviewId], (oldReviews: CommentItem[]) =>
        oldReviews.map((review) => {
          return review.id === reviewId ? { ...review, content: content } : review;
        }),
      );
    });
  };

  // 리뷰 수정 취소
  const cancelUpdateReview = (page: number, reviewId: number) => {
    // 쿼리에서 수정하기 전 리뷰 내용을 캐시에서 가져와서 현재 리뷰 내용에 덮어쓰기
    const replyList = queryClient.getQueryData([reviewListKey, isbn, page]) as CommentItem[];
    console.log(replyList);
    const oldReply = replyList.filter((reply: CommentItem) => reply.id === reviewId)[0] as CommentItem;
    setContent(oldReply.content);
  };

  // 리뷰 삭제
  const deleteReview = (reviewId: number, changePage: (page: number) => void) => {
    deleteCommentRequest(jwt, reviewId).then((res) => {
      if (!res) {
        window.alert('리뷰 삭제 실패. 다시 시도해주세요');
        return;
      }
      // 리뷰 삭제 성공 시 리뷰 리스트 캐시 삭제 후 첫 페이지로 이동
      queryClient.invalidateQueries({
        queryKey: [reviewListKey, isbn],
      });
      changePage(0);
    });
  };

  return { isbn, content, setContent, updateReview, cancelUpdateReview, deleteReview };
};

//// 리플 리스트 쿼리
export const replyListKey = 'replyList';
export const useReplyList = (reviewId: number, replyOpen: boolean) => {
  const {
    data: replyList,
    isLoading: isReplyListLoading,
    error: replyListError,
  } = useQuery({
    queryKey: [replyListKey, reviewId],
    queryFn: () => {
      return getReplyListRequest(reviewId).then((res) => {
        if (!res) {
          throw new Error('리플 가져오기 실패. 잠시후 다시 시도해주세요');
        }
        return res;
      });
    },
    enabled: !!reviewId && replyOpen,
    staleTime: 1000 * 60 * 30, // 30분,
    gcTime: 0,
  });

  return { replyList, isReplyListLoading, replyListError };
};

////
export const reviewFavoriteKey = 'reviewFavorite';

export const useReviewFavorite = (reviewId: number) => {
  const {
    data: isFavorite,
    isLoading: isFavoriteLoading,
    error: isFavoriteError,
  } = useQuery({
    queryKey: [reviewFavoriteKey, reviewId],
    queryFn: () => {
      return getCommentFavoriteRequest(reviewId).then((res) => {
        if (!res) {
          throw Error('라뷰 좋아요 개수 가져오기 실패');
        }
        return res;
      });
    },
    staleTime: Infinity,
  });

  return { isFavorite, isFavoriteLoading, isFavoriteError };
};

//// 책 검색 리스트 쿼리
export type SearchBook = {
  isbn: string;
  bookImg: string;
  title: string;
  author: string;
  price: string;
};

export type SearchBookListResponse = {
  isEnd: boolean;
  pageableCount: number;
  totalCount: number;
  bookList: SearchBook[];
};

export type UseSearchBookListQueryParams = {
  query: string;
  sort?: 'accuracy' | 'latest'; // 기본 accuracy
  page?: number; // 기본 0
  size?: number; // 기본 10
  target?: 'title' | 'isbn' | 'publisher' | 'person'; // 기본 title
};

interface UseSearchBookListQueryReturn {
  searchBookListWithInfo: SearchBookListResponse;
  isSearchBookListLoading: boolean;
  isSearchBookListError: boolean;
  refetchSearchBookList: () => void;
}

export const searchBookListQueryKey = 'searchBookList';

type UseSearchBookListQuery = (params: UseSearchBookListQueryParams) => UseSearchBookListQueryReturn;

export const useSearchBookListQuery: UseSearchBookListQuery = (params) => {
  const {
    data: searchBookListWithInfo,
    isLoading: isSearchBookListLoading,
    isError: isSearchBookListError,
    refetch: refetchSearchBookList,
  } = useQuery({
    queryKey: [searchBookListQueryKey],
    queryFn: () => {
      return request.getWithParams<SearchBookListResponse, UseSearchBookListQueryParams>(
        DOMAIN + '/books/search',
        params,
        false,
      );
    },
    initialData: {
      isEnd: false,
      pageableCount: 0,
      totalCount: 0,
      bookList: [],
    },
    enabled: false,
    gcTime: 0,
  });

  return { searchBookListWithInfo, isSearchBookListLoading, isSearchBookListError, refetchSearchBookList };
};
