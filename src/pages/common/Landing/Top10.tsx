import { useEffect, useState } from 'react';
import { Top10BookItem } from '../../../api/item.ts';
import BookPrev from '../../../components/BookPrev.tsx';
import { getTop10BookListRequest } from '../../../api';

const Top10 = () => {
  const [books, setBooks] = useState<Top10BookItem[] | null>(null);

  const getTop10BookList = () => {
    getTop10BookListRequest().then((res) => {
      setBooks(res);
    });
  };

  useEffect(() => {
    getTop10BookList();
  }, []);

  return (
    <section className={'flex flex-col gap-[50px] py-[40px] min-[800px]:items-center'}>
      <div className={'flex flex-col items-center gap-[5px]'}>
        <h1 className="font-bold text-dark-black md:text-center text-[18px]">이런 책은 어떠세요?</h1>
        <p className={'text-black text-opacity-60'}>사람들의 좋아요가 많아요</p>
      </div>
      <div className="max-w-[800px] flex flex-shrink-0 whitespace-nowrap overflow-x-scroll scrollbar-hidden scroll-smooth">
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
