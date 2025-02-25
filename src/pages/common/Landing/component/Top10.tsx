import { getTop10BookListRequest } from '@/api/api';
import { Top10BookItem } from '@/api/item';
import BookPrev from '@/components/BookPrev';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const Top10 = () => {
  const [books, setBooks] = useState<Top10BookItem[] | null>(null);
  const [isMouseInside, setIsMouseInside] = useState<boolean>(false);

  // 책 리스트 컨테이너 첫 번째 요소 참조
  const [firstRef, firstInView] = useInView({ threshold: 1 });
  // 책 리스트 컨테이너 마지막 요소 참조
  const [lastRef, lastInView] = useInView({ threshold: 1 });

  // 책 리스트 컨테이너 스크롤 조작을 위한 참조
  const bookListRef = useRef<HTMLDivElement>(null);

  // 책 리스트 조회
  const getTop10BookList = () => {
    getTop10BookListRequest().then((res) => {
      setBooks(res);
    });
  };

  // 컴포넌트 마운트 시 책 리스트 조회
  useEffect(() => {
    getTop10BookList();
  }, []);

  if (books === null || books.length === 0) {
    return null;
  }

  return (
    // top10 섹션 컨테이너
    <section
      className={'relative flex flex-col items-center  justify-center gap-[30px]  xl:items-start xl:w-[80%] mx-auto'}
    >
      {/* 타이틀 컨테이너 */}
      <div className={'flex flex-col items-center gap-[5px] xl:items-start'}>
        <h1 className="font-bold text-dark-black md:text-center text-[1.5em]">Top 10</h1>
        <p className={'text-black text-opacity-60'}>사람들의 좋아요가 많아요</p>
      </div>
      <div
        onMouseEnter={() => {
          setIsMouseInside(true);
        }}
        onMouseLeave={() => {
          setIsMouseInside(false);
        }}
      >
        {/* 좌측 화살표 */}
        <span
          className={`cursor-pointer absolute flex items-center justify-center left-0 z-30 w-10 h-10 bg-black rounded-full bg-opacity-30 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${!firstInView && isMouseInside ? 'opacity-1' : 'opacity-0'}`}
          onClick={() => {
            if (!bookListRef.current) return;
            bookListRef.current.scrollLeft -= 120;
          }}
        >
          <i className="fi fi-rr-angle-small-left text-white text-[1.5em] flex items-center justify-center"></i>
        </span>
        {/* 우측 화살표 */}
        <span
          className={`cursor-pointer flex items-center justify-center absolute right-0 z-30 w-10 h-10 bg-black rounded-full bg-opacity-30 top-1/2 -translate-y-1/2 transition-opacity duration-300 ${!lastInView && isMouseInside ? 'opacity-1' : 'opacity-0'}`}
          onClick={() => {
            if (!bookListRef.current) return;
            bookListRef.current.scrollLeft += 120;
          }}
        >
          <i className="fi fi-rr-angle-small-right text-white text-[1.5em] flex items-center justify-center"></i>
        </span>
        {/* 책 리스트 컨테이너 */}
        <div
          ref={bookListRef}
          className="flex w-[90%] xl:w-full gap-4 mx-auto overflow-x-scroll scrollbar-hidden"
        >
          {/* 책 리스트 */}
          <span ref={firstRef}></span>
          {books
            ? books.map((book, index) => {
                return (
                  <div key={book.isbn} className="max-w-[120px] flex-shrink-0">
                    <BookPrev
                      key={index}
                      bookImg={book.bookImg}
                      author={book.author}
                      title={book.title}
                      isbn={book.isbn}
                    />
                  </div>
                );
              })
            : null}
          <span ref={lastRef}></span>
        </div>
      </div>
    </section>
  );
};

export default Top10;
