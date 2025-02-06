/* eslint-disable react-hooks/exhaustive-deps */
import { getSearchBookRequest } from '@/api/api.ts';
import { BookPrevData } from '@/api/item.ts';
import { getSearchBookListRequestDto } from '@/api/request.dto.ts';
import { getSearchBookListResponseDto } from '@/api/response.dto.ts';
import BookPrev from '@/components/BookPrev.tsx';
import SearchBox from '@/components/SearchBox.tsx';
import { useDebounce } from '@/hook/index.ts';
import { userState } from '@/redux/userSlice.ts';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AdminLanding from './AdminLanding.tsx';
import RecommendBook from './RecommendBook.tsx';
import Top10 from './Top10.tsx';

const Landing = () => {
  const { role } = useSelector((state: { user: userState }) => state.user);
  const [searchWord, setSearchWord] = useState<string>('');
  const debouncedSearchWord = useDebounce(searchWord, 500);
  const [searchBookList, setSearchBookList] = useState<BookPrevData[]>([]);

  // handler: 빈 화면 클릭 시 책 검색 지우기
  const emptyClickHandler = () => {
    setSearchBookList([]);
  };

  // function: 책 검색하기
  const searchBook = () => {
    const requestDto: getSearchBookListRequestDto = {
      query: debouncedSearchWord,
      sort: 'accuracy',
      page: 1,
      size: 10,
      target: 'title',
    };
    getSearchBookRequest(requestDto)
      .then((response) => {
        // 책 데이터 받아오기 성공
        const { bookList } = response.data as getSearchBookListResponseDto;
        setSearchBookList(bookList);
      })
      .catch((error) => {
        // 책 데이터 받아오기 실패
        console.log(error.response.data);
      });
  };

  // effect: 검색어 변경 시 책 검색
  useEffect(() => {
    if (debouncedSearchWord === '') {
      setSearchBookList([]);
      return;
    }
    searchBook();
  }, [debouncedSearchWord]);

  // 관리자 페이지
  if (role === 'ROLE_ADMIN') {
    return <AdminLanding />;
  }

  return (
    <main className={'flex flex-col overflow-y-hidden'} onClick={emptyClickHandler}>
      {/* 추천 책 */}
      <RecommendBook />
      {/* 검색 */}
      <div className={'absolute flex flex-col w-full items-center top-[120px] px-[5%]'}>
        <div className={'w-full max-w-[25rem]'}>
          <SearchBox searchWord={searchWord} setSearchWord={setSearchWord} />
          {/* 검색 미리보기 */}
          {searchBookList.length ? (
            <div
              className={
                'mt-[1rem] z-50 w-full h-[400px] p-[5px] flex flex-col bg-white rounded-[10px] drop-shadow-md overflow-scroll scroll-smooth'
              }
            >
              {searchBookList.map((book) => (
                <div
                  key={book.isbn}
                  className={'rounded-[10px] p-[15px] hover:bg-black hover:bg-opacity-5 duration-200'}
                >
                  <div className={'w-[100px]'}>
                    <BookPrev
                      bookImg={book.bookImg}
                      author={book.author}
                      title={book.title}
                      isbn={book.isbn}
                      imgSize={3}
                    />
                  </div>
                </div>
              ))}
              <button className={'font-semibold py-[10px] hover:bg-black hover:bg-opacity-5 rounded-[10px]'}>
                검색결과 더보기
              </button>
            </div>
          ) : null}
        </div>
      </div>
      {/* top 10 */}
      <Top10 />
    </main>
  );
};

export default Landing;
