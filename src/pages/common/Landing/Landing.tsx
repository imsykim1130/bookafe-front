/* eslint-disable react-hooks/exhaustive-deps */
import { searchBookListQueryKey, useRecommendBookQuery } from '@/hook/book.hooks.ts';
import { useUserQuery } from '@/hook/user.hook';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import AdminLanding from './AdminLanding.tsx';
import LandingSearchPart from './component/LandingSearchPart.tsx';
import Top10 from './component/Top10.tsx';

const Landing = () => {
  const { user } = useUserQuery();
  const role = user?.role ?? '';
  const queryClient = useQueryClient();

  // 검색 결과 캐시 초기화
  function initSearchBookList() {
    queryClient.resetQueries({
      queryKey: [searchBookListQueryKey],
    });
  }

  // render: 관리자 페이지
  if (role === 'ROLE_ADMIN') {
    return <AdminLanding />;
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

export default Landing;
