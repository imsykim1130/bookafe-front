/* eslint-disable react-hooks/exhaustive-deps */
import { getSearchBookRequest } from '@/api/api.ts';
import { BookSearchItem } from '@/api/item.ts';
import { getSearchBookListRequestDto } from '@/api/request.dto.ts';
import { GetSearchBookListResponseDto } from '@/api/response.dto.ts';
import { useDebounce } from '@/hook/index.ts';
import { useUserStore } from '@/zustand/userStore.ts';
import { useEffect, useState } from 'react';
import AdminLanding from './AdminLanding.tsx';
import LandingSearchPart from './component/LandingSearchPart.tsx';
import RecommendBook from './component/RecommendBook.tsx';
import Top10 from './component/Top10.tsx';

const Landing = () => {
  const [searchWord, setSearchWord] = useState<string>('');
  const debouncedSearchWord = useDebounce(searchWord, 500);
  const [searchBookList, setSearchBookList] = useState<BookSearchItem[]>([]);
  const { user } = useUserStore();
  const role = user ? user.role : 'ROLE_USER';

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
        const { bookList } = response.data as GetSearchBookListResponseDto;
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

  // render: 관리자 페이지
  if (role === 'ROLE_ADMIN') {
    return <AdminLanding />;
  }

  // render: 일반 랜딩 페이지
  return (
    <main className={'landing-container-layout'} onClick={emptyClickHandler}>
      {/* 추천 책 */}
      <RecommendBook />
      {/* 구분 */}
      <span className="w-full bg-black/5"></span>
      <div className="flex flex-col justify-center lg:relative">
        {/* top 10 */}
        <Top10 />
        {/* 검색 */}
        <LandingSearchPart searchWord={searchWord} setSearchWord={setSearchWord} searchBookList={searchBookList} />
      </div>
    </main>
  );
};

export default Landing;
