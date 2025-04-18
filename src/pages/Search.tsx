/* eslint-disable react-hooks/exhaustive-deps */
import SearchBox from '@/components/SearchBox.tsx';
import { useSearchBookListQuery } from '@/hook/book.hooks.ts';
import { SearchBook } from '@/types/item.ts';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import BookPrev from '../components/BookPrev.tsx';

// index: search component
const Search = () => {
  const { searchWord } = useParams();
  const navigate = useNavigate();
  const observeRef = useRef(null);
  const [newSearchWord, setNewSearchWord] = useState<string>('');

  const [books, setBooks] = useState<SearchBook[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const size = 50;

  // query
  const { searchBookList, isSearchBookListLoading, isSearchBookListError, isEnd, totalCount, refetchSearchBookList } =
    useSearchBookListQuery({
      query: searchWord ? searchWord : '',
      sort: 'accuracy',
      page: currentPage + 1,
      size,
      target: 'title',
    });

  // effect
  // 책 데이터가 변경되면(데이터를 가져오면) 변경된 데이터를 기존 데이터에 추가
  useEffect(() => {
    if (isSearchBookListError || searchBookList.length === 0) return;
    setBooks([...books, ...searchBookList]);
    setCurrentPage(currentPage + 1);
  }, [searchBookList]);

  // effect
  useEffect(() => {
    if (!searchWord || searchWord?.length === 0) return;

    refetchSearchBookList();

    // 옵저버
    const observer = new IntersectionObserver(
      (entries) => {
        // 옵저버의 관찰 대상이 하나이기 때문에 첫번째 엔트리만 확인하면 된다.
        if (entries[0].isIntersecting) {
          // 데이터를 가져오는 중이거나 더이상 가져올 데이터가 없을 때 옵저버 무시
          if (isSearchBookListLoading || isEnd) return;
          console.log('hi');
          console.log(currentPage);
          refetchSearchBookList();
        }
      },
      {
        threshold: 1, // 요소가 다 보이면 콜백 함수 호출. [0.2, 0.5] 이런 식으로 가시성 여러개 설정 가능
      },
    );

    // 옵저버 설정
    if (observeRef.current) {
      observer.observe(observeRef.current);
    }
    // 검색어
    setNewSearchWord(searchWord);

    // 옵저버 해제
    return () => {
      if (observeRef.current) {
        observer.unobserve(observeRef.current);
      }
    };
  }, [searchWord]);

  return (
    <section className="margin-sm md:margin-md mt-[3rem] flex flex-col items-center">
      <div className="max-w-[850px] flex flex-col gap-[1.2rem]">
        <SearchBox
          searchWord={newSearchWord}
          setSearchWord={setNewSearchWord}
          onEnter={() => {
            setBooks([]);
            navigate('/search/' + newSearchWord);
          }}
        />
        {/* 총 검색결과 개수*/}
        <div className="w-full">
          <p className="text-base font-semibold">
            검색결과 총 <span>{totalCount}</span>개
          </p>
        </div>
        {/* 검색 결과 리스트 */}
        {/* 최소 높이를 스크린 높이로 하여 데이터가 없을 때 옵저버 인식 요소가 인식되지 않게 하여 추가 데이터 요청이 들어오지 않도록 함 */}
        <div className="grid grid-cols-3 min-[800px]:grid-cols-4 min-[1100px]:grid-cols-5 gap-[30px] mb-[100px] text-md min-h-screen">
          <BookList bookList={books} isLoading={isSearchBookListLoading} isError={isSearchBookListError} />
        </div>
        {/* 옵저버 인식을 위한 요소 */}
        <div ref={observeRef}></div>
      </div>
    </section>
  );
};

const BookList = ({
  bookList,
  isError,
  isLoading,
}: {
  bookList: SearchBook[];
  isLoading: boolean;
  isError: boolean;
}) => {
  if (isLoading) {
    return <p>로딩중</p>;
  }

  if (isError) {
    return <p>다시 시도해주세요</p>;
  }

  if (bookList.length === 0) {
    return <p>검색 결과가 없습니다</p>;
  }

  return bookList.map((item) => (
    <BookPrev
      key={item.isbn}
      bookImg={item.bookImg}
      author={item.author}
      title={item.title}
      isbn={item.isbn}
      imgSize={140}
    />
  ));
};

export default Search;
