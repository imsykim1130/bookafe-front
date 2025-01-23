import PageTitle from '../components/PageTitle.tsx';
import { useEffect, useState } from 'react';
import { FavoriteBookItem } from '../api/item.ts';
import { useCookies } from 'react-cookie';
import { cancelFavoriteRequest, getFavoriteBookListRequest, moveFavoriteBookToCartRequest } from '../api';
import { useNavigate } from 'react-router-dom';

const Favorite = () => {
  const [cookies, _] = useCookies();
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

  // 장바구니 담기 요청
  const moveFavoriteBookToCart = (isbn: string) => {
    moveFavoriteBookToCartRequest(cookies.jwt, isbn).then((result) => {
      if (!result) {
        return;
      }
      getFavoriteBookList();
    });
  };

  return (
    <div>
      {/* 페이지 타이틀 */}
      <PageTitle title={'좋아요'} />
      {/* 페이지 컨텐츠 */}
      <main className={'text-[14px] mx-[5%] md:mx-[10%] lg:mx-[15%] flex flex-col items-center'}>
        <div className={'w-full md:max-w-[650px]'}>
          {favoriteBookList
            ? favoriteBookList.map((book) => (
                <FavoriteBookItemComp
                  key={book.isbn}
                  book={book}
                  deleteFavoriteBook={deleteFavoriteBook}
                  moveFavoriteBookToCart={moveFavoriteBookToCart}
                />
              ))
            : null}
        </div>
      </main>
    </div>
  );
};

const FavoriteBookItemComp = ({
  book,
  deleteFavoriteBook,
  moveFavoriteBookToCart,
}: {
  book: FavoriteBookItem;
  deleteFavoriteBook: (isbn: string) => void;
  moveFavoriteBookToCart: (isbn: string) => void;
}) => {
  const { bookImg, title, author, price, discountPercent, isbn, isCart } = book;
  const navigate = useNavigate();

  const imageClickHandler = () => {
    navigate('/book/detail/' + isbn);
  };

  return (
    <article className={'flex gap-[15px] py-[30px] border-b-[1px] border-black border-opacity-10'}>
      {/* book image */}
      <div className={'w-[120px] rounded-[5px] overflow-hidden cursor-pointer'} onClick={imageClickHandler}>
        <img src={bookImg} alt="book cover image" />
      </div>
      {/* content */}
      <div className={'flex flex-col justify-between flex-1'}>
        <div className={'flex flex-col gap-[10px]'}>
          <div>
            <p className={'font-semibold'}>{title}</p>
            <p className={'text-black text-opacity-40'}>{author}</p>
          </div>
          <p>{(price * (100 - discountPercent)) / 100} 원</p>
        </div>
        <div className={'flex gap-[20px] justify-end'}>
          {isCart ? (
            <i className="fi fi-sr-shopping-cart"></i>
          ) : (
            <i className="fi fi-rr-shopping-cart cursor-pointer" onClick={() => moveFavoriteBookToCart(isbn)}></i>
          )}
          <i className="fi fi-rr-trash cursor-pointer" onClick={() => deleteFavoriteBook(isbn)}></i>
        </div>
      </div>
    </article>
  );
};

export default Favorite;
