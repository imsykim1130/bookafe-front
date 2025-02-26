import { getBookDetailRequest } from '@/api/api.ts';
import { BookDetailData } from '@/api/item.ts';
import { Button } from '@/components/ui/button.tsx';
import { useEffect, useState } from 'react';
import Favorite from './Favorite.tsx';
import Recommend from './Recommend.tsx';

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

  const kyobo = `https://search.kyobobook.co.kr/search?keyword=${book?.title}`;
  const yes24 = `https://www.yes24.com/Product/Search?query=${book?.title}`;
  const aladin = `https://www.aladin.co.kr/search/wsearchresult.aspx?SearchTarget=All&KeyWord=${book?.title}`;

  const getBookDetail = () => {
    if (!isbn) return;
    getBookDetailRequest(isbn).then((res) => {
      setBook(res);
      bookLoadingComplete();
    });
  };

  // function: 구매 사이트로 이동
  const toBookSite = (url: string) => {
    window.open(url, '_blank');
  };

  // effect: 초기 렌더링 시 책 정보 가져오기
  useEffect(() => {
    getBookDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!book) return null;

  return (
    <div className={'relative overflow-hidden pt-[100px] pb-[60px] flex flex-col items-center'}>
      {/* 책 배경 */}
      <img src={book.bookImg} className={'w-[100vw] absolute -z-10 bottom-[8rem] blur-3xl opacity-40'}></img>
      {/* 책 표지*/}
      <div className={'w-[150px]'}>
        <img
          src={book.bookImg}
          alt="book cover image"
          className={'w-full rounded-[10px] shadow-[0_0_40px_rgba(0,0,0,0.4)]'}
        />
      </div>
      {/* 상세설명 */}
      <div
        className={
          'max-w-[900px] mx-[5%] shadow-[0_0_30px_rgba(0,0,0,0.1)] flex flex-col gap-[30px] p-[30px] mt-[60px] rounded-[20px] bg-white bg-opacity-70'
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
          <div className={'flex gap-[25px]'}>
            {/* 추천*/}
            {role === 'ROLE_ADMIN' && <Recommend isbn={isbn} />}
            {/* 좋아요 */}
            <Favorite isbn={isbn} />
          </div>
        </div>
        {/* 책 설명 */}
        <div>
          <p className="leading-[1.8]">{book.description}</p>
        </div>
        <div className="flex flex-col gap-[0.9rem]">
          <p className="font-semibold">구매하기</p>
          <div className="flex gap-[0.9rem]">
            <Button
              variant={'outline'}
              className="border-black/50"
              onClick={() => {
                toBookSite(aladin);
              }}
            >
              알라딘
            </Button>
            <Button
              onClick={() => {
                toBookSite(yes24);
              }}
              variant={'outline'}
              className="border-black/50"
            >
              Yes24
            </Button>
            <Button
              variant={'outline'}
              className="border-black/50"
              onClick={() => {
                toBookSite(kyobo);
              }}
            >
              교보문고
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSection;
