import { FavoriteBookItem } from '@/api/item';
import { cancelFavoriteRequest, getFavoriteBookListRequest } from '@/api/request';
import { useEffect, useState } from 'react';

import { useCookies } from 'react-cookie';

import { useNavigate } from 'react-router-dom';
import FavoriteBook from './component/FavoriteBook';

const Favorite = () => {
  const [cookies] = useCookies(['jwt']);
  const navigate = useNavigate();
  const [favoriteBookList, setFavoriteBookList] = useState<FavoriteBookItem[] | null>(null);

  // 초기 렌더링에 필요한 데이터 가져오기
  useEffect(() => {
    if (!cookies.jwt) {
      window.alert('로그인이 필요합니다');
      navigate('/auth/sign-in', {
        state: { pathname: '/favorite' },
      });
      return;
    }
    getFavoriteBookList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 좋아요 책 정보 가져오기
  const getFavoriteBookList = () => {
    getFavoriteBookListRequest(cookies.jwt).then((result) => {
      if (result) {
        setFavoriteBookList(result);
        return;
      }
    });
  };

  // 좋아요 책 삭제 버튼 클릭 핸들러
  const deleteFavoriteBook = (isbn: string) => {
    cancelFavoriteRequest(cookies.jwt, isbn).then((result) => {
      if (result) {
        getFavoriteBookList();
      }
    });
  };

  return (
    <main className={'flex flex-col items-center mt-[40px] px-[5%]'}>
      <div className={'w-full max-w-[600px]'}>
        {/* 좋아요 책 있을 때 */}
        <section>
          {favoriteBookList
            ? favoriteBookList.map((book) => (
                <FavoriteBook key={book.isbn} book={book} deleteFavoriteBook={deleteFavoriteBook} />
              ))
            : null}
        </section>
        {/* 좋아요 책 없을 때 */}
        <section>
          {!favoriteBookList || favoriteBookList.length === 0 ? (
            <>
              <h1 className={'text-[1.8rem] font-semibold'}>결과가 없습니다.</h1>
              <p className="py-3 text-[1rem]">문제가 있는 경우 관리자에게 문의해주세요.</p>
            </>
          ) : null}
        </section>
      </div>
    </main>
  );
};

export default Favorite;
