import BookPrev from '@/components/BookPrev';
import SearchBox from '@/components/SearchBox';
import { SearchBook, useSearchBookListQuery, UseSearchBookListQueryParams } from '@/hook/book.hooks';
import { useDebounce } from '@/hook/hooks';
import { useEffect, useState } from 'react';

interface Props {
  initSearchBookList: () => void;
}

const LandingSearchPart = ({ initSearchBookList }: Props) => {
  const [searchWord, setSearchWord] = useState<string>('');
  const debouncedSearchWord = useDebounce(searchWord, 500);

  const requestDto: UseSearchBookListQueryParams = {
    query: debouncedSearchWord,
    sort: 'accuracy',
    page: 1,
    size: 10,
    target: 'title',
  };

  // query: 검색 책 리스트
  const { searchBookListWithInfo, refetchSearchBookList } = useSearchBookListQuery(requestDto);

  const searchBookList = searchBookListWithInfo.bookList;

  // effect: 검색어 변경 시 책 검색
  useEffect(() => {
    if (debouncedSearchWord === '') {
      initSearchBookList();
      return;
    }
    refetchSearchBookList();
  }, [debouncedSearchWord]);

  return (
    <div className={'absolute flex flex-col w-full items-center top-[8rem] xl:top-[3rem] px-[5%]'}>
      <div className={'w-full max-w-[25rem]'}>
        <SearchBox searchWord={searchWord} setSearchWord={setSearchWord} />
        <SearchBookList searchBookList={searchBookList} />
      </div>
    </div>
  );
};

// 검색 결과 드롭다운
const SearchBookList = ({ searchBookList }: { searchBookList: SearchBook[] }) => {
  if (!searchBookList) {
    return null;
  }

  if (searchBookList.length === 0) {
    return null;
  }

  return (
    <div
      className={
        'mt-[1rem] z-50 w-full h-[400px] p-[5px] flex flex-col bg-white rounded-[10px] drop-shadow-md overflow-scroll scroll-smooth'
      }
    >
      {searchBookList.map((book) => (
        <div key={book.isbn} className={'rounded-[10px] p-[15px] hover:bg-black hover:bg-opacity-5 duration-200'}>
          <div className={'w-[100px]'}>
            <BookPrev bookImg={book.bookImg} author={book.author} title={book.title} isbn={book.isbn} imgSize={3} />
          </div>
        </div>
      ))}
      <button className={'font-semibold py-[10px] hover:bg-black hover:bg-opacity-5 rounded-[10px]'}>
        검색결과 더보기
      </button>
    </div>
  );
};

export default LandingSearchPart;
