/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { BookPrevData, TodayBookInterface } from '../../../api/item.ts';
import { useNavigate } from 'react-router-dom';
import { getRecommendBookRequest, GetRecommendBookResponseDto, getSearchBookRequest } from '../../../api';
import SearchBox from '@/components/SearchBox.tsx';
import BookPrev from '@/components/BookPrev.tsx';
import { useDebounce } from '@/hook';
import { getSearchBookListRequestDto } from '@/api/request.dto.ts';
import { getSearchBookListResponseDto, ResponseDto } from '@/api/response.dto.ts';

const RecommendBook = () => {
  const [recommendBook, setRecommendBook] = useState<TodayBookInterface | null>(null);
  const navigate = useNavigate();

  const [searchBookList, setSearchBookList] = useState<BookPrevData[]>([]);
  const [searchWord, setSearchWord] = useState<string>('');
  const debouncedSearchWord = useDebounce(searchWord, 500);

  // handler: 책 상세 페이지 이동
  const bookClickHandler = () => {
    navigate('/book/detail/' + recommendBook?.isbn);
  };

  // handler: 빈 화면 클릭 시 책 검색 지우기
  const emptyClickHandler = () => {
    setSearchBookList([]);
  };

  // function: 추천 책 받아오기
  const getRecommendBook = () => {
    getRecommendBookRequest().then((res) => {
      if (!res) {
        // 네트워크 에러
        navigate('/error/500', {state: {pathname: "/"}});
        return;
      }
      const { code } = res as ResponseDto;
      if(code === "ISE") {
        // 서버 동작 에러
        navigate('/error/500', {state: {pathname: "/"}});
        return;
      }

      if(code === "SU") {
        const { todayBook } = res as GetRecommendBookResponseDto;
        setRecommendBook(todayBook);
      }
    });
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

  // effect: 추천 책 받아오기
  useEffect(() => {
    getRecommendBook();
  }, []);

  // 검색어 변경 시 책 검색
  useEffect(() => {
    if (debouncedSearchWord === '') {
      setSearchBookList([]);
      return;
    }
    searchBook();
  }, [debouncedSearchWord]);

  return (
    <section
      className="relative flex flex-col gap-[60px] justify-center items-center pt-[20vh] pb-[15vh]"
      onClick={emptyClickHandler}
    >
      <div className={'flex flex-col gap-[30px]'}>
        {/* 배경 이미지 */}
        <div className={'absolute top-0 left-0 w-full -z-10 blur-2xl'}>
          {recommendBook && (
            <img src={recommendBook.bookImg} alt="book background image" className={`w-[100%] opacity-10`} />
          )}
        </div>
        <div className="flex flex-col md:flex-row-reverse items-center md:items-start gap-[40px]">
          {/* 타이틀, 후기, 책 정보 이동 버튼 */}
          <div className={'flex flex-col items-center md:items-start gap-[20px]'}>
            <div className={'flex flex-col items-center md:items-start gap-[5px]'}>
              {/* 타이틀 */}
              <h1 className={'opacity-90 font-extrabold text-[1.8rem]'}>{recommendBook ? recommendBook.title : ''}</h1>
              {/* 후기 */}
              <p className={'text-black text-opacity-40'}>{recommendBook ? recommendBook.favoriteComment : ''}</p>
            </div>
            <button
              className={' border-[1px] border-black border-opacity-60 rounded-[5px] p-[5px]'}
              onClick={bookClickHandler}
            >
              자세히 보기
            </button>
          </div>
          <div className={'w-[120px]'}>
            {recommendBook ? (
              <img
                src={recommendBook.bookImg}
                alt="book cover image"
                className={'w-full rounded-[10px] shadow-[6px_6px_10px_rgba(0,0,0,0.6)]'}
              />
            ) : null}
          </div>
        </div>
      </div>

      {/* 검색 */}
      <div className={'absolute top-[60px] w-[25rem]'}>
        <SearchBox searchWord={searchWord} setSearchWord={setSearchWord} />
        {/* 검색 미리보기 */}
        {searchBookList.length ? (
          <div
            className={
              'mt-[1rem] z-50 w-full h-[400px] p-[5px] flex flex-col bg-white rounded-[10px] drop-shadow-md overflow-scroll scroll-smooth'
            }
          >
            {searchBookList.map((book) => (
              <div key={book.isbn} className={'rounded-[10px] p-[15px] hover:bg-black hover:bg-opacity-5 duration-200'}>
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
    </section>
  );
};

export default RecommendBook;
