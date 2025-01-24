import { useEffect, useState } from 'react';
import { Top10BookItem } from '../../../api/item.ts';
import BookPrev from '../../../components/BookPrev.tsx';
import { getTop10BookListRequest } from '../../../api';

const Top10 = () => {
  const [books, setBooks] = useState<Top10BookItem[] | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInside, setIsMouseInside] = useState(false);

  // 책 리스트 조회
  const getTop10BookList = () => {
    getTop10BookListRequest().then((res) => {
      setBooks(res);
    });
  };

  // 마우스 이벤트 핸들러
  const handleMouseMove = (e: React.MouseEvent) => {
    const element = e.currentTarget.getBoundingClientRect();
    const scrollLeft = e.currentTarget.scrollLeft;

    setMousePosition({
      x: e.clientX - element.left + scrollLeft,
      y: e.clientY - element.top,
    });
  };

  // 컴포넌트 마운트 시 책 리스트 조회
  useEffect(() => {
    getTop10BookList();
  }, []);

  return (
    // top10 섹션 컨테이너
    <section className={'flex flex-col gap-[50px] py-[40px] min-[800px]:items-center bg-white'}>
      {/* 타이틀 컨테이너 */}
      <div className={'flex flex-col items-center gap-[5px]'}>
        <h1 className="font-bold text-dark-black md:text-center text-[18px]">이런 책은 어떠세요?</h1>
        <p className={'text-black text-opacity-60'}>사람들의 좋아요가 많아요</p>
      </div>
      {/* 책 리스트 컨테이너 */}
      <div
        className="relative max-w-[800px] flex flex-shrink-0 whitespace-nowrap overflow-x-scroll scrollbar-hidden scroll-smooth"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsMouseInside(true)} // 마우스 포인터 표시
        onMouseLeave={() => setIsMouseInside(false)} // 마우스 포인터 숨기기
      >
        {/* 마우스 포인터 표시 */}
        {isMouseInside && (
          <div
            className="pointer-events-none absolute flex justify-center items-center w-[40px] h-[40px] bg-black rounded-full bg-opacity-40 transform -translate-x-1/2 -translate-y-1/2 text-white text-opacity-100"
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
              transition: 'all 0.5s ease-out',
            }}
          >
            scroll
          </div>
        )}
        {/* 책 리스트 */}
        {books
          ? books.map((book, index) => (
              <div key={book.isbn} className="max-w-[100px] flex-shrink-0 mx-[30px]">
                <BookPrev
                  key={index}
                  bookImg={book.bookImg}
                  author={book.author}
                  title={book.title}
                  isbn={book.isbn}
                  imgSize={150}
                />
              </div>
            ))
          : null}
      </div>
    </section>
  );
};

export default Top10;
