/* eslint-disable react-hooks/exhaustive-deps */
import { ResponseDto } from '@/api/response.dto.ts';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecommendBookRequest, GetRecommendBookResponseDto } from '../../../../api/api.ts';
import { TodayBookInterface } from '../../../../api/item.ts';

const RecommendBook = () => {
  const [recommendBook, setRecommendBook] = useState<TodayBookInterface | null>(null);
  const navigate = useNavigate();

  // handler: 책 상세 페이지 이동
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
        <div className={'flex flex-col gap-[30px]'}>
          <div className="flex flex-col md:flex-row-reverse items-center md:items-start gap-[40px]">
            {/* 타이틀, 후기, 책 정보 이동 버튼 */}
            <div className={'flex flex-col items-center md:items-start gap-[20px]'}>
              <div className={'flex flex-col items-center md:items-start gap-[5px]'}>
                {/* 타이틀 */}
                <h1 className={'opacity-90 font-extrabold text-[1.8rem]'}>
                  {recommendBook ? recommendBook.title : ''}
                </h1>
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
                // 책 이미지
                <img
                  src={recommendBook.bookImg}
                  alt="book cover image"
                  className={'w-full rounded-[10px] shadow-[6px_6px_15px_rgba(0,0,0,0.4)]'}
                />
              ) : null}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RecommendBook;
