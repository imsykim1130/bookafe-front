import { moveFavoriteBookToCartRequest } from '@/api/api';
import { FavoriteBookItem } from '@/api/item';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

interface Props {
  book: FavoriteBookItem;
  deleteFavoriteBook: (isbn: string) => void;
}

function FavoriteBook(props: Props) {
  const { book, deleteFavoriteBook } = props;
  const discounted = book.price - (book.price * book.discountPercent) / 100;
  const [isCart, setIsCart] = useState<boolean>(book.isCart);

  const [cookies] = useCookies(['jwt']);

  // 장바구니 담기 요청
  const moveFavoriteBookToCart = (isbn: string) => {
    moveFavoriteBookToCartRequest(cookies.jwt, isbn).then((result) => {
      if (!result) {
        return;
      }
      setIsCart(true);
    });
  };

  useEffect(() => {
    setIsCart(book.isCart);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <article key={book.id} className={'flex gap-[20px] py-[30px] border-b-[1px] border-black border-opacity-10'}>
      {/* 왼쪽 */}
      <div
        className={
          'w-[120px] drop-shadow-[2px_2px_5px_rgba(0,0,0,0.4)] transition-all duration-300 ease hover:drop-shadow-[2px_2px_5px_rgba(0,0,0,0.8)] cursor-pointer'
        }
      >
        <img src={book.bookImg} alt="book cover image" className={'rounded-[5px]'} />
      </div>

      {/* 오른쪽 */}
      <div className={'flex-1 text-[14px] flex flex-col gap-[20px]'}>
        {/* 위 */}
        <div className={'w-full flex flex-col gap-[20px]'}>
          {/* 왼쪽 */}
          <div>
            <p className={'font-semibold'}>{book.title}</p>
            <p className={'text-black text-opacity-60'}>{book.author}</p>
          </div>
          {/* 오른쪽 */}
          <div className={'flex flex-col font-semibold'}>
            <p className={'line-through text-black text-opacity-40'}>{book.price} 원</p>
            <div className={'flex items-center gap-[10px]'}>
              <p>{discounted} 원</p>
              <p className={'text-red-600 text-[12px]'}>{book.discountPercent} %</p>
            </div>
          </div>
        </div>
        {/* 아래 */}
        <div className={'flex gap-[30px] items-center'}>
          {/* 장바구니 */}
          {isCart ? (
            <i className="fi fi-sr-shopping-cart flex justify-center items-center text-[16px]"></i>
          ) : (
            <i
              className="fi fi-rr-shopping-cart cursor-pointer flex justify-center items-center text-[16px]"
              onClick={() => moveFavoriteBookToCart(book.isbn)}
            ></i>
          )}
          {/* 휴지통 */}
          <i
            className="fi fi-rr-trash text-[16px] cursor-pointer flex justify-center items-center"
            onClick={() => {
              deleteFavoriteBook(book.isbn);
            }}
          ></i>
        </div>
      </div>
    </article>
  );
}

export default FavoriteBook;
