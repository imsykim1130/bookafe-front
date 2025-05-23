// Book 페이지 컴포넌트 관련 상태, 메서드
import { BookResponse, RecommendBookResponse, SearchBookListResponse } from '@/api/response.dto';
import { request } from '@/api/template';
import { SearchBook } from '@/types/item';
import { DOMAIN } from '@/utils/env';
import { useQuery } from '@tanstack/react-query';

//// 책 상세 정보
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
      return request.get<BookResponse>(DOMAIN + '/book?isbn=' + isbn, false);
    },
    enabled: !!isbn,
    initialData: null,
  });

  return { book, isBookLoading, isBookError, refetchBook };
};

// 오늘의 추천책
// 관리자가 설정한 추천 책 중에서 랜덤한 책 1권
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

//// 책 검색 리스트 쿼리
export type UseSearchBookListQueryParams = {
  query: string;
  sort?: 'accuracy' | 'latest'; // 기본 accuracy
  page?: number; // 기본 0
  size?: number; // 기본 10
  target?: 'title' | 'isbn' | 'publisher' | 'person'; // 기본 title
};

interface UseSearchBookListQueryReturn {
  searchBookListWithInfo: SearchBookListResponse;
  searchBookList: SearchBook[];
  isEnd: boolean;
  totalCount: number;
  pageableCount: number;
  isSearchBookListLoading: boolean;
  isSearchBookListError: boolean;
  refetchSearchBookList: () => void;
}

export const searchBookListQueryKey = 'searchBookList';

type UseSearchBookListQuery = (params: UseSearchBookListQueryParams) => UseSearchBookListQueryReturn;

export const useSearchBookListQuery: UseSearchBookListQuery = (params: UseSearchBookListQueryParams) => {
  const {
    data: searchBookListWithInfo,
    isLoading: isSearchBookListLoading,
    isError: isSearchBookListError,
    refetch: refetchSearchBookList,
  } = useQuery({
    queryKey: [searchBookListQueryKey],
    queryFn: () => {
      return request.getWithParams<SearchBookListResponse, UseSearchBookListQueryParams>(
        DOMAIN + '/books',
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
  });

  const searchBookList = searchBookListWithInfo.bookList;
  const isEnd = searchBookListWithInfo.isEnd;
  const totalCount = searchBookListWithInfo.totalCount;
  const pageableCount = searchBookListWithInfo.pageableCount;

  return {
    searchBookListWithInfo,
    searchBookList,
    isEnd,
    totalCount,
    pageableCount,
    isSearchBookListLoading,
    isSearchBookListError,
    refetchSearchBookList,
  };
};
