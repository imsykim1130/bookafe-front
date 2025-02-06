/* eslint-disable react-hooks/exhaustive-deps */
import { getSearchBookListRequestDto } from '@/api/request.dto.ts';
import { getSearchBookListResponseDto } from '@/api/response.dto.ts';
import SearchBox from '@/components/SearchBox.tsx';
import { useDebounce } from '@/hook/index.ts';
import { getJwt } from '@/utils/cookie.ts';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import {
  deleteRecommendBookRequest,
  getAllRecommendBookRequest,
  getSearchBookRequest,
  registerRecommendBookRequest,
} from '../../api/api.ts';
import { BookPrevData, RecommendBookItem } from '../../api/item.ts';

// const mock: RecommendBookItem = {
//   title: 'hihi',
//   author: 'heheh',
//   bookImg:
//     'https://plus.unsplash.com/premium_photo-1670598267085-053235b0d6de?q=80&w=3686&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   publisher: 'heheh',
// };

const RecommendBook = () => {
  const [cookies] = useCookies(['jwt']);
  const [recommentBookList, setRecommentBookList] = useState<RecommendBookItem[] | null>(null);
  const [searchBookList, setSearchBookList] = useState<BookPrevData[] | null>(null);
  const [searchWord, setSearchWord] = useState<string>('');
  const debouncedSearchWord = useDebounce(searchWord, 400);
  const [isMouseInSerchSection, setIsMouseInSerchSection] = useState<boolean>(false);

  // function: 추천 책 리스트 가져오기
  const getAllRecommendBook = async () => {
    getAllRecommendBookRequest(cookies.jwt).then((result) => {
      setRecommentBookList(result);
    });
  };

  // 추천 책 추가
  const registerRecommendBook = (isbn: string) => {
    console.log('recommend');
    registerRecommendBookRequest(getJwt(), isbn).then((res) => {
      if (res !== true) {
        window.alert(res);
        return;
      }
      initSearch();
      getAllRecommendBook();
    });
  };

  // function: 추천 책 삭제하기
  const deleteRecommendBook = async (isbn: string) => {
    deleteRecommendBookRequest(cookies.jwt, isbn).then((result) => {
      if (!result) {
        window.alert('오류가 발생했습니다 다시 시도해주세요');
        return;
      }
      getAllRecommendBook();
    });
  };

  // function: 검색 결과 초기화
  const initSearch = () => {
    setSearchBookList(null);
    setSearchWord('');
  };

  // function: 책 검색하기
  const searchBook = () => {
    const requestDto: getSearchBookListRequestDto = {
      query: searchWord,
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
        setSearchBookList(null);
      });
  };

  const clickHandler = () => {
    if (!isMouseInSerchSection) {
      console.log('init');
      initSearch();
    }
  };

  // effect: 검색어 변경 시 책 검색
  useEffect(() => {
    // 검색어가 없으면 검색 결과를 비워준다
    if (debouncedSearchWord === '') {
      setSearchBookList(null);
      return;
    }
    searchBook();
  }, [debouncedSearchWord]);

  useEffect(() => {
    console.log(isMouseInSerchSection);
  }, [isMouseInSerchSection]);

  // effect: 초기 렌더링 시 추천 책 리스트 가져오기
  useEffect(() => {
    getAllRecommendBook();

    document.addEventListener('click', clickHandler);

    return () => {
      document.removeEventListener('click', clickHandler);
    };
  }, []);

  return (
    <main className="flex flex-col items-center px-[5%] py-[3rem]">
      <div className={'w-full max-w-[600px]'}>
        {/* 검색 */}
        <div
          className="relative"
          onMouseEnter={() => setIsMouseInSerchSection(true)}
          onMouseLeave={() => setIsMouseInSerchSection(false)}
        >
          <SearchBox searchWord={searchWord} setSearchWord={setSearchWord} />
          {/* 검색 결과 */}
          <div className="shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-[10px]">
            {/* 검색결과 있을 때 */}
            {searchBookList && searchBookList.length > 0
              ? searchBookList.map((book: BookPrevData) => (
                  <div
                    key={book.isbn}
                    className="flex items-start justify-between px-4 py-4 hover:bg-gray-100 rounded-[10px] border-b-[1px] border-gray-100"
                  >
                    <div className="flex flex-col gap-2">
                      <h1 className="font-semibold">{book.title}</h1>
                      <p>{book.isbn}</p>
                      <p>{book.author}</p>
                    </div>
                    <div>
                      <button
                        className="px-2 py-1 text-white bg-black rounded-[10px]"
                        onClick={() => registerRecommendBook(book.isbn)}
                      >
                        추천
                      </button>
                    </div>
                  </div>
                ))
              : null}
            {/* 검색 결과 없을 때 */}
            {searchBookList && searchBookList.length === 0 ? (
              <div className="px-4 py-4">
                <p className="text-gray-500">검색 결과가 없습니다</p>
              </div>
            ) : null}
          </div>
        </div>
        {/* 추천 책 리스트 */}
        <div className="py-[2rem]">
          {recommentBookList && recommentBookList.length > 0 ? (
            recommentBookList.map((book: RecommendBookItem) => (
              <RecommendBookComp key={book.id} book={book} deleteRecommendBook={deleteRecommendBook} />
            ))
          ) : (
            <h1 className="font-semibold text-[1.5rem]">추천 책이 없습니다.</h1>
          )}
        </div>
      </div>
    </main>
  );
};

const RecommendBookComp = ({
  book,
  deleteRecommendBook,
}: {
  book: RecommendBookItem;
  deleteRecommendBook: (isbn: string) => void;
}) => {
  const { title, author, bookImg, publisher, isbn } = book;
  const navigate = useNavigate();

  return (
    <div className={'flex justify-between py-[30px] border-b-[1px] border-black border-opacity-10'}>
      <div className={'flex gap-[30px]'}>
        <div
          className={'w-[120px] rounded-[5px] overflow-hidden cursor-pointer'}
          onClick={() => {
            navigate(`/book/detail/${isbn}`);
          }}
        >
          <img src={bookImg} alt="" />
        </div>
        <div className={'flex flex-col gap-[15px]'}>
          <div className={'flex flex-col gap-[5px]'}>
            <p className={'font-bold'}>{title}</p>
            <p className={'text-black text-opacity-40'}>{publisher}</p>
          </div>
          <p>{author}</p>
        </div>
      </div>
      <div>
        <i
          className="text-[1rem] duration-300 cursor-pointer fi fi-rr-trash text-default-black hover:text-opacity-40"
          onClick={() => deleteRecommendBook(isbn)}
        ></i>
      </div>
    </div>
  );
};

export default RecommendBook;
