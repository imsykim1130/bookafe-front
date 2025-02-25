import { cancelFavoriteRequest } from '@/api/api';
import { allFavoriteBookkey, useAllFavoriteBookQuery } from '@/api/query';
import PaginationComp from '@/components/PaginationComp';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import FavoriteBook from './component/FavoriteBook';

const Favorite = () => {
  const navigate = useNavigate();
  const [cookie] = useCookies(['jwt']);
  const queryClient = useQueryClient();
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

  useEffect(()=>{
    window.scrollTo(0, 0);
  }, [page])

  // 좋아요 책 삭제 버튼 클릭 핸들러
  const deleteFavoriteBook = (isbn: string) => {
    cancelFavoriteRequest(cookie.jwt, isbn).then((result) => {
      // 삭제 성공 시 쿼리 무효화
      if (result) {
        queryClient.invalidateQueries({
          queryKey: [allFavoriteBookkey],
        });
      }
    });
  };

  return (
    <main className={'flex flex-col mt-[40px]'}>
      <div className={'w-full max-w-[600px] px-[1rem] mx-auto '}>
        {/* 페이지 이름 */}
        <div>
          <p className="text-lg font-semibold">좋아요</p>
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
                  <FavoriteBook key={book.isbn} book={book} deleteFavoriteBook={deleteFavoriteBook} />
                ))}
              {/* 페이지네이션 */}
              <PaginationComp currentPage={page} totalPages={favoriteBookResonse?.totalPages} setCurrentPage={setPage}/>
            </>
          )}
        </div>
      </div>
    </main>
  );
};

export default Favorite;
