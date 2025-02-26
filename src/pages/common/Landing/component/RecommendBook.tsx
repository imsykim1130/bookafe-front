/* eslint-disable react-hooks/exhaustive-deps */
import { ResponseDto } from '@/api/response.dto.ts';
import { useUserStore } from '@/zustand/userStore.ts';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecommendBookRequest, GetRecommendBookResponseDto } from '@/api/api.ts';
import { TodayBookInterface } from '@/api/item.ts';

const RecommendBook = () => {
  const { user } = useUserStore();
  const [recommendBook, setRecommendBook] = useState<TodayBookInterface | null>(null);
  const navigate = useNavigate();
  
  // function: 책 상세 페이지 이동
  const bookClickHandler = () => {
    navigate('/book/detail/' + recommendBook?.isbn);
  };

  // function: 추천 책 받아오기
  const getRecommendBook = () => {
    getRecommendBookRequest().then((res) => {
      if (!res) {
        // 네트워크 에러
        navigate('/error/500', { state: { pathname: '/' } });
        return;
      }
      const { code } = res as ResponseDto;
      if (code === 'ISE') {
        // 서버 동작 에러
        navigate('/error/500', { state: { pathname: '/' } });
        return;
      }

      if (code === 'SU') {
        const { todayBook } = res as GetRecommendBookResponseDto;
        setRecommendBook(todayBook);
      }
    });
  };

  // effect: 추천 책 받아오기
  useEffect(() => {
    getRecommendBook();
  }, []);

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

export default RecommendBook;
