import { cancelFavoriteRequest, getFavoriteBookListRequest } from '@/api';
import { FavoriteBookItem } from '@/api/item';
import PageTitle from '@/components/PageTitle';
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
    <main>
      {/* 페이지 타이틀 */}
      <PageTitle title={'좋아요'} />
      {/* 페이지 컨텐츠 */}
      <div className={'text-[14px] mx-[5%] md:mx-[10%] lg:mx-[15%] flex flex-col items-center'}>
        <div className={'w-full md:max-w-[650px]'}>
          {favoriteBookList
            ? favoriteBookList.map((book) => (
                <FavoriteBook key={book.isbn} book={book} deleteFavoriteBook={deleteFavoriteBook} />
              ))
            : null}
        </div>
      </div>
    </main>
  );
};

export default Favorite;
