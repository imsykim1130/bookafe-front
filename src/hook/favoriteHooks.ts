import { cancelFavoriteBookBatchRequest, cancelFavoriteBookRequest, getFavoriteBookListRequest } from '@/api/book.api';
import { useJwt } from '@/hook/hooks';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

// Favorite 컴포넌트 데이터, 핸들러 모음
export const useFavorite = () => {
  const [checkedBookIsbnList, setCheckedBookIsbnList] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { jwt } = useJwt();

  // 책 체크버튼 누르기 핸들러
  function checkBookClickHandler(isbn: string): void {
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
  }

  // 전체선택 버튼 누르기 핸들러
  // 눌러져 있는 상태에서 누르면 전체 선택 취소
  // 눌러져 있지 않은 상태에서 누르면 전체 선택
  function checkAllBtnClickHandler(allFavoriteBookIsbn: string[]) {
    // 전체선택 취소
    if (allFavoriteBookIsbn.length === checkedBookIsbnList.length) {
      setCheckedBookIsbnList([]);
      return;
    }
    // 전체선택 누름
    setCheckedBookIsbnList(allFavoriteBookIsbn);
  }

  // 좋아요 삭제 버튼 누르기 핸들러
  function favoriteCancelBtnClickHandler() {
    if (!checkedBookIsbnList || checkedBookIsbnList.length === 0) return;
    cancelFavoriteBookBatchRequest(jwt, checkedBookIsbnList).then((result) => {
      // 실패
      if (!result) {
        window.alert('좋아요 취소 실패. 잠시후 다시 시도해주세요');
        return;
      }
      // 성공
      // 좋아요 책 리스트 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [favoriteBookListkey],
      });
      // 선택 isbn 리스트 초기화
      setCheckedBookIsbnList([]);
    });
  }

  function favoriteDeleteIconBtnClickHandler(isbn: string) {
    cancelFavoriteBookRequest(jwt, isbn).then((result) => {
      // 실패
      if (!result) {
        window.alert('좋아요 취소 실패. 잠시후 다시 시도해주세요');
        return;
      }
      // 성공
      // 좋아요 책 리스트 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [favoriteBookListkey],
      });
      // 선택 isbn 리스트 초기화
      setCheckedBookIsbnList([]);
    });
  }

  return {
    checkedBookIsbnList,
    checkBookClickHandler,
    checkAllBtnClickHandler,
    favoriteCancelBtnClickHandler,
    favoriteDeleteIconBtnClickHandler,
  };
};

// 좋아요 책 리스트
export const favoriteBookListkey = 'allFavoriteBook';

export const useFavoriteBookList = () => {
  const [page, setPage] = useState<number>(0);
  const {jwt} = useJwt();

  const {
    data,
    isLoading: isFavoriteBookListLoading,
    error: favoriteBookListError,
  } = useQuery({
    queryKey: [favoriteBookListkey, page],
    queryFn: () => {
      if (!jwt) return;
      return getFavoriteBookListRequest(jwt, page);
    },
    staleTime: Infinity
  });

  const favoriteBookList = data ? data.favoriteBookList : null;
  const isEnd = data ? data.isEnd : false;
  const totalPages = data ? data.totalPages : 0;

  return {
    page,
    setPage,
    favoriteBookList,
    isEnd,
    totalPages,
    isFavoriteBookListLoading,
    favoriteBookListError,
  };
};