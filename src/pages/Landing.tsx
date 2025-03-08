/* eslint-disable react-hooks/exhaustive-deps */
import BookPrev from '@/components/BookPrev.tsx';
import SearchBox from '@/components/SearchBox.tsx';
import {
  SearchBook,
  searchBookListQueryKey,
  useRecommendBookQuery,
  useSearchBookListQuery,
  UseSearchBookListQueryParams,
} from '@/hook/book.hooks.ts';
import { useTop10Query } from '@/hook/favorite.book.hooks';
import { useDebounce } from '@/hook/hooks.ts';
import { useUserQuery } from '@/hook/user.hook';
import { queryClient } from '@/main';
import { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Link, useNavigate } from 'react-router-dom';

const Landing = () => {
  const { user } = useUserQuery();
  const role = user?.role ?? '';

  // 검색 결과 캐시 초기화
  function initSearchBookList() {
    queryClient.resetQueries({
      queryKey: [searchBookListQueryKey],
    });
  }

  // render: 관리자 페이지
  if (role === 'ROLE_ADMIN') {
    return (
      <main className="flex flex-col items-center mt-[2rem] px-[5%]">
        <div className="w-full max-w-[600px]">
          {/* 메뉴 목록 */}
          <div className="flex flex-col">
            <h1 className="font-semibold text-[1.5rem] py-[1rem]">관리 메뉴</h1>
            <Link
              to="/admin/user-management"
              className="py-6 px-2 border-b-[1px] border-black border-opacity-20 transition-colors duration-300 hover:bg-gray-100"
            >
              유저 관리
            </Link>
            <Link
              to="/admin/recommend-book"
              className="py-6 px-2 border-b-[1px] border-black border-opacity-20 transiton-colors hover:bg-gray-100 duration-300"
            >
              추천 도서 관리
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // render: 일반 랜딩 페이지
  return (
    <main className="landing-container-layout" onClick={initSearchBookList}>
      {/* 추천 책 */}
      <RecommendBook />
      {/* 구분 */}
      <span className="w-full bg-black bg-opacity-[2%]"></span>
      <div className="flex flex-col justify-center xl:relative">
        {/* top 10 */}
        <Top10 />
        {/* 검색 */}
        <LandingSearchPart initSearchBookList={initSearchBookList} />
      </div>
    </main>
  );
};

const RecommendBook = () => {
  const { user } = useUserQuery();
  const { recommendBook } = useRecommendBookQuery();
  const navigate = useNavigate();

  // function: 책 상세 페이지 이동
  const bookClickHandler = () => {
    navigate('/book/detail/' + recommendBook?.isbn);
  };

  return (
    <section className="relative flex flex-col gap-[60px] justify-center items-center">
      {recommendBook === null ? null : (
        <div className={'flex flex-col gap-[3.125rem]'}>
          {/* 환영문구 */}
          <div className="text-3xl text-center leading-[150%]">
            {user ? (
              // 로그인이 되어있으면 환영인사
              <p>
                환영합니다
                <br />
                <span className="font-bold">{user.nickname}</span> 님!
              </p>
            ) : (
              // 로그인이 되어있지 않으면 책 추천 문구
              <p>
                이런 책은
                <br />
                어떠세요?
              </p>
            )}
          </div>
          {/* 구분선 */}
          <span className="w-full border-b-[0.01rem] border-black/20"></span>
          {/* 오늘의 책 */}
          <div className="flex flex-col items-center gap-[1.25rem]">
            <p className="text-xl font-semibold">오늘의 책</p>
            <div className="flex flex-col items-center gap-[0.9375rem]">
              {/* 책 이미지 */}
              <div className={'w-[120px] cursor-pointer'} onClick={bookClickHandler}>
                <img
                  src={recommendBook.bookImg}
                  alt="book cover image"
                  className={'w-full rounded-[10px] shadow-[6px_6px_15px_rgba(0,0,0,0.4)]'}
                />
              </div>
              {/* 책 제목, 작가 */}
              <div className="flex flex-col items-center gap-[0.3125rem]">
                <p className="font-semibold">{recommendBook.title}</p>
                <p className="opacity-60">{recommendBook.author}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const LandingSearchPart = ({ initSearchBookList }: { initSearchBookList: () => void }) => {
  const navigate = useNavigate();
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
        <SearchBox
          searchWord={searchWord}
          setSearchWord={setSearchWord}
          onEnter={() => {
            navigate(`/search/${searchWord}`);
          }}
        />
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

const Top10 = () => {
  const [isMouseInside, setIsMouseInside] = useState<boolean>(false);

  // 책 리스트 컨테이너 첫 번째 요소 참조
  const [firstRef, firstInView] = useInView({ threshold: 1 });
  // 책 리스트 컨테이너 마지막 요소 참조
  const [lastRef, lastInView] = useInView({ threshold: 1 });

  // 책 리스트 컨테이너 스크롤 조작을 위한 참조
  const bookListRef = useRef<HTMLDivElement>(null);

  return (
    // top10 섹션 컨테이너
    <section
      className={'relative flex flex-col items-center  justify-center gap-[30px]  xl:items-start xl:w-[80%] mx-auto'}
    >
      {/* 타이틀 컨테이너 */}
      <div className={'flex flex-col items-center gap-[5px] xl:items-start'}>
        <h1 className="font-semibold md:text-center text-[1.5em]">인기가 많은 책이에요 🔥</h1>
        <p className={'opacity-60'}>사람들의 좋아요가 많아요</p>
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
        <div ref={bookListRef} className="flex w-[90%] xl:w-full gap-4 mx-auto overflow-x-scroll scrollbar-hidden">
          <span ref={firstRef}></span>
          <BookList />
          <span ref={lastRef}></span>
        </div>
      </div>
    </section>
  );
};

const BookList = () => {
  const { bookList, isTop10Error, isTop10Loading } = useTop10Query();

  if (bookList === undefined || isTop10Loading) {
    return <p>로딩중</p>;
  }

  if (isTop10Error) {
    return <p>다시 시도해주세요</p>;
  }

  return bookList.map((book) => (
    <div key={book.isbn} className="max-w-[120px] flex-shrink-0">
      <BookPrev key={book.isbn} bookImg={book.bookImg} author={book.author} title={book.title} isbn={book.isbn} />
    </div>
  ));
};
export default Landing;
