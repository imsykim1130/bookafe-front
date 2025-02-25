import { cancelFavoriteRequest, deleteFavoriteBookListRequest } from '@/api/api';
import { allFavoriteBookkey, useAllFavoriteBookQuery } from '@/api/query';
import PaginationComp from '@/components/PaginationComp';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import FavoriteBook from './component/FavoriteBook';

const Favorite = () => {
  const navigate = useNavigate();
  const [cookie] = useCookies(['jwt']);
  const queryClient = useQueryClient();
  const [checkedBookIsbnList, setCheckedBookIsbnList] = useState<string[]>([]);
  const [page, setPage] = useState<number>(0);
  const { data: favoriteBookResonse, isLoading: isFavoriteBookLoading } = useAllFavoriteBookQuery(cookie.jwt, page);

  // effect: 로그인 여부 확인
  useEffect(() => {
    if (!cookie.jwt) {
      window.alert('로그인이 필요합니다');
      navigate('/auth/sign-in', {
        state: { pathname: '/favorite' },
      });
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // effect
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  // function: 좋아요 책 삭제 버튼 클릭 핸들러
  const deleteFavoriteBook = (isbn: string) => {
    cancelFavoriteRequest(cookie.jwt, isbn).then((result) => {
      if (!result) {
        window.alert("좋아요 취소 실패. 잠시후 다시 시도해주세요")
        return
      }
      // 삭제 성공 시 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [allFavoriteBookkey],
      });
    });
  };

  // function: 책 체크버튼 누르기 핸들러
  function checkBook(isbn: string): void {
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

  // function: 전체선택 체크박스 클릭
  const checkAll = () => {
    if (!favoriteBookResonse) return;
    const allFavoriteBookIsbn = favoriteBookResonse.favoriteBookList.map((favoriteBook) => {
      return favoriteBook.isbn;
    });
    // 전체선택 취소
    if (allFavoriteBookIsbn.length === checkedBookIsbnList.length) {
      setCheckedBookIsbnList([]);
      return;
    }
    // 전체선택 누름
    setCheckedBookIsbnList(allFavoriteBookIsbn);
  };

  // function: 좋아요 책 일괄 취소
  const deleteFavoriteBookList = async () => {
    if (checkedBookIsbnList.length === 0) return;
    deleteFavoriteBookListRequest(cookie.jwt, checkedBookIsbnList).then((result) => {
      // 실패
      if (!result) {
        window.alert('좋아요 취소 실패. 잠시후 다시 시도해주세요');
        return;
      }
      // 성공
      // 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [allFavoriteBookkey],
      });
      // 선택 isbn 리스트 초기화
      setCheckedBookIsbnList([]);
    });
  };

  return (
    <main className={'flex flex-col mt-[40px]'}>
      <div className={'w-full max-w-[600px] px-[1rem] mx-auto '}>
        {/* 페이지 이름 */}
        <div className="flex items-center justify-between pr-[1.5rem]">
          <p className="text-lg font-semibold">좋아요</p>
          {/* 전체선택 체크박스 */}
          <div className="flex items-center gap-4">
            <p className="text-sm">전체선택</p>
            <Checkbox onClick={checkAll}></Checkbox>
          </div>
        </div>
        <div>
          {/* 로딩중 */}
          {isFavoriteBookLoading ? (
            <p>로딩중</p>
          ) : (
            <>
              {/* 좋아요 책 없을 때 */}
              {favoriteBookResonse && favoriteBookResonse.favoriteBookList.length === 0 && (
                <h1 className={'opacity-60'}>결과가 없습니다.</h1>
              )}

              {/* 좋아요 책 있을 때 */}
              {favoriteBookResonse &&
                favoriteBookResonse.favoriteBookList.length > 0 &&
                favoriteBookResonse.favoriteBookList.map((book) => (
                  <FavoriteBook
                    key={book.isbn}
                    book={book}
                    deleteFavoriteBook={deleteFavoriteBook}
                    checkedBookIsbnList={checkedBookIsbnList}
                    checkBook={checkBook}
                  />
                ))}
              {/* 페이지네이션 */}
              <PaginationComp
                currentPage={page}
                totalPages={favoriteBookResonse?.totalPages}
                setCurrentPage={setPage}
              />
              {/* 일괄 삭제 버튼 */}
              {checkedBookIsbnList.length > 0 && (
                <Button className="sticky bottom-[2rem] w-full my-[1rem]" onClick={deleteFavoriteBookList}>
                  삭제
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Favorite;
