/* eslint-disable react-hooks/exhaustive-deps */
import { getSearchBookListRequest, putBookToCartRequest } from '@/api/api';
import { BookSearchItem } from '@/api/item';
import { GetSearchBookListResponseDto, ResponseDto } from '@/api/response.dto';
import BookPrev from '@/components/BookPrev';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';

gsap.registerPlugin(useGSAP);

const CartBookRecommend = ({ refetchCartBookList }: { refetchCartBookList: () => void }) => {
  const [cookies] = useCookies(['jwt']);
  // 추천 키워드 중 선택한 키워드의 인덱스
  const [keywordIndex, setKeywordIndex] = useState<number | null>(null);
  const keywordListRef = useRef(null);

  const [keywordList] = useState<string[]>(['소년', '사랑', '바다', '파도']);

  const [searchBookList, setSearchBookList] = useState<BookSearchItem[]>([]);

  useGSAP(
    () => {
      const keywordListContainer = keywordListRef.current;
      if (!keywordListContainer) return;
      gsap.to('.keyword', {
        opacity: 1,
        duration: 2,
        ease: 'power1.inOut',
        stagger: 0.2,
      });
    },
    { dependencies: [keywordList], scope: keywordListRef },
  );

  // function: 장바구니 담기 요청
  const putBookToCart = (isbn: string) => {
    putBookToCartRequest(cookies.jwt, isbn).then((result: boolean) => {
      // 실패
      if (!result) {
        window.alert('장바구니 담기 실패. 다시 시도해주세요');
      }
      // 성공하면 장바구니 책 다시 가져오기
      refetchCartBookList();
    });
  };

  // effect: 키워드 변경 시 검색결과 가져오기
  useEffect(() => {
    // 선택한 키워드 없을 때
    if (keywordIndex === null) {
      setSearchBookList([]);
      return;
    }
    getSearchBookListRequest({
      query: keywordList[keywordIndex],
      sort: 'accuracy',
      page: 0,
      size: 5,
      target: 'title',
    }).then((result) => {
      // 아무 응답 없을 때
      if (!result) {
        window.alert('네트워크 에러');
        return;
      }
      // 실패
      const { code, message } = result as ResponseDto;
      if (code !== 'SU') {
        console.log(message);
        return;
      }
      // 성공
      const { bookList } = result as GetSearchBookListResponseDto;
      console.log(bookList);
      setSearchBookList(bookList);
    });
  }, [keywordIndex]);

  return (
    <div className="flex flex-col gap-4">
      {/* 추천 키워드*/}
      <div ref={keywordListRef} className="flex flex-wrap gap-5 text-[1rem] font-semibold">
        {keywordList.map((keyword, index) => (
          <span
            key={keyword}
            className={`keyword px-4 py-2 border-gray-300 rounded-2xl border-[1px] cursor-pointer opacity-0 ${index === keywordIndex ? 'border-gray-800 bg-gray-100 shadow-lg' : ''}`}
            onClick={() => {
              if (index === keywordIndex) {
                setKeywordIndex(null);
                return;
              }
              setKeywordIndex(index);
            }}
          >
            {keyword}
          </span>
        ))}
      </div>
      {/* 키워드 검색 책 리스트 */}
      <div className="flex flex-wrap gap-x-14">
        {keywordIndex !== null
          ? searchBookList.map((book: BookSearchItem) => (
              <div key={book.isbn} className="relative py-5 w-[8rem]">
                <BookPrev bookImg={book.bookImg} author={book.author} title={book.title} isbn={book.isbn} imgSize={9} />
                {/* 장바구니 아이콘 */}
                <div
                  onClick={() => {
                    putBookToCart(book.isbn);
                  }}
                  className="absolute top-11 right-2 z-10 flex items-center justify-center w-10 h-10 bg-white rounded-full shadow-lg border-[1px] border-gray-300 hover:bg-gray-100 cursor-pointer transition-all duration-300"
                >
                  <i className="fi fi-rr-shopping-cart text-[1rem] text-gray-800 flex items-center justify-center" />
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default CartBookRecommend;
