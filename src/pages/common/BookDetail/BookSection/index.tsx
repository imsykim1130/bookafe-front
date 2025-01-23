import { useEffect, useState } from 'react';
import Recommend from './Recommend.tsx';
import Favorite from './Favorite.tsx';
import Cart from './Cart.tsx';
import { BookDetailData } from '../../../../api/item.ts';
import { getBookDetailRequest } from '../../../../api';

const BookSection = ({
  isbn,
  role,
  bookLoadingComplete,
}: {
  isbn: string | undefined;
  role: string;
  bookLoadingComplete: () => void;
}) => {
  const [book, setBook] = useState<BookDetailData | null>(null);

  const getBookDetail = () => {
    if (!isbn) return;
    getBookDetailRequest(isbn).then((res) => {
      setBook(res);
      bookLoadingComplete();
    });
  };

  useEffect(() => {
    getBookDetail();
  }, []);

  if (!book) return null;

  return (
    <div className={'relative overflow-hidden pt-[100px] pb-[60px] flex flex-col items-center text-[15px]'}>
      {/* 책 표지*/}
      <img src={book.bookImg} className={'w-full absolute -z-10 top-0 blur-2xl'}></img>
      <div className={'w-[150px]'}>
        <img src={book.bookImg} alt="book cover image" className={'w-full rounded-[5px] shadow-2xl'} />
      </div>
      {/* 상세설명 */}
      <div
        className={
          'bg-white p-[30px] mt-[60px] mx-[5%] md:mx-[15%] lg:mx-[20%] rounded-[20px] shadow-2xl flex flex-col gap-[30px]'
        }
      >
        {/* 위 */}
        <div className={'flex justify-between'}>
          {/* 왼쪽 */}
          <div className={'flex flex-col gap-[10px]'}>
            <p className={'font-bold'}>{book.title}</p>
            <div className={'text-black text-opacity-60 flex gap-[15px]'}>
              <p>{book.publisher}</p>
              <div className={'border-r-[1px] border-black border-opacity-40'}></div>
              <p>{book.pubDate}</p>
            </div>
            <p>{book.author} 저자</p>
          </div>
          {/* 오른쪽 */}
          <div className={'flex gap-[20px]'}>
            {/* 추천*/}
            {role === 'ROLE_ADMIN' && <Recommend isbn={isbn} />}
            {/* 좋아요 */}
            <Favorite isbn={isbn} />
            {/* 장바구니*/}
            <Cart isbn={isbn} />
          </div>
        </div>
        {/* 아래 */}
        <div>
          <p>{book.description}</p>
        </div>
      </div>
    </div>
  );
};

export default BookSection;
