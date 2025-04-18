/* eslint-disable react-hooks/exhaustive-deps */
import { SearchBookListResponse } from '@/api/response.dto.ts';
import { request } from '@/api/template';
import SearchBox from '@/components/SearchBox.tsx';
import { Button } from '@/components/ui/button.tsx';
import { useDebounce } from '@/hook/hooks.ts';
import { useRecommendBookListQuery, useRecommendBookMutation } from '@/hook/recommend.book.hooks.ts';
import { ErrorResponse } from '@/types/common.type.ts';
import { RecommendBook } from '@/types/item.ts';
import { DOMAIN } from '@/utils/env.ts';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookSearchItem, RecommendBookItem } from '../../types/item.ts';

const RecommendBookPage = () => {
  const { recommendBookList, isRecommendBookListLoading, isRecommendBookListError, refetchRecommendBookList } =
    useRecommendBookListQuery();
  const { recommend } = useRecommendBookMutation({
    onRecommendError,
    onRecommendSuccess,
  });

  const [searchBookList, setSearchBookList] = useState<BookSearchItem[] | null>(null);
  const [searchWord, setSearchWord] = useState<string>('');
  const debouncedSearchWord = useDebounce(searchWord, 400);
  const [isMouseInSerchSection, setIsMouseInSerchSection] = useState<boolean>(false);

  // 책 추천 핸들러
  // 성공
  function onRecommendSuccess() {
    initSearch();
    // invalidateRecommendBookList();
    refetchRecommendBookList();
  }
  // 실패
  function onRecommendError(err: ErrorResponse) {
    console.log(err.message);
    window.alert(err.message);
  }

  // function: 검색 결과 초기화
  const initSearch = () => {
    setSearchBookList(null);
    setSearchWord('');
  };

  // function: 책 검색하기
  const searchBook = () => {
    request
      .getWithParams<SearchBookListResponse, { query: string }>(DOMAIN + '/books', { query: searchWord }, false)
      .then((data: SearchBookListResponse) => {
        setSearchBookList(data.bookList);
      })
      .catch((err) => {
        console.log(err.message);
        setSearchBookList([]);
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

  // 마운트
  useEffect(() => {
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
          {searchBookList && (
            <div className="shadow-[0_0_10px_rgba(0,0,0,0.1)] rounded-[10px] max-h-[20rem] overflow-scroll">
              {/* 검색결과 있을 때 */}
              {searchBookList.length > 0
                ? searchBookList.map((book: BookSearchItem) => (
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
                        <Button onClick={() => recommend(book.isbn)}>추천</Button>
                      </div>
                    </div>
                  ))
                : null}
              {/* 검색 결과 없을 때 */}
              {searchBookList.length === 0 ? (
                <div className="px-4 py-4">
                  <p className="text-gray-500">검색 결과가 없습니다</p>
                </div>
              ) : null}
            </div>
          )}
        </div>
        {/* 추천 책 리스트 */}
        <div className="py-[2rem]">
          <RecommendBookList
            recommendBookList={recommendBookList}
            isLoading={isRecommendBookListLoading}
            isError={isRecommendBookListError}
          />
        </div>
      </div>
    </main>
  );
};

const RecommendBookList = ({
  recommendBookList,
  isLoading,
  isError,
}: {
  recommendBookList: RecommendBook[] | undefined;
  isLoading: boolean;
  isError: boolean;
}) => {
  if (!recommendBookList || isLoading) {
    return <p>로딩중</p>;
  }
  if (isError) {
    return <p>불러오지 못했습니다</p>;
  }

  if (recommendBookList.length === 0) {
    return <p>추천 책이 없습니다</p>;
  }

  return recommendBookList.map((book) => <RecommendBookComp book={book} />);
};

const RecommendBookComp = ({ book }: { book: RecommendBookItem }) => {
  const { title, author, bookImg, publisher, isbn } = book;
  const { unrecommend, invalidateRecommendBookList } = useRecommendBookMutation({
    onUnrecommendSuccess,
    onUnrecommendError,
  });
  const navigate = useNavigate();

  // 책 추천 취소 핸들러
  // 성공
  function onUnrecommendSuccess() {
    invalidateRecommendBookList();
  }

  // 실패
  function onUnrecommendError(err: ErrorResponse) {
    console.log(err.message);
    window.alert('추천 취소 실패. 다시 시도해주세요');
  }

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
          onClick={() => unrecommend(isbn)}
        ></i>
      </div>
    </div>
  );
};

export default RecommendBookPage;
