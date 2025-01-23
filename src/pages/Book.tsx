import { useParams } from 'react-router-dom';
import { Dispatch, useEffect, useReducer, useRef, useState } from 'react';
import { CommentItem, UserItem } from '../api/item.ts';
import { Reducer } from 'react';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import Comment from '../components/Comment.tsx';
import { BookDataAction, BookDataState } from '../reducer';
import {
  bookRequest,
  cartRequest,
  commentRequest,
  deleteRecommendBookRequest,
  favoriteRequest,
  getRecommendedRequest,
  putCartRequest,
  putFavoriteRequest,
  registerRecommendBookRequest,
} from '../api';
import CommentField from '../components/CommentField.tsx';

// 페이지 진입 시
// 1. 책 데이터 가져오기

// 2. 유저 정보가 있다면 jwt, isbn 을 이용해 해당 책에 대한 유저의 정보를 가져오기
// 3. 댓글 가져오기

// book reducer hook

const bookDataInitialState: BookDataState = {
  book: {
    isbn: '',
    bookImg: '',
    title: '',
    price: 0,
    publisher: '',
    author: '',
    pubDate: '',
    description: '',
  },
  favoriteUserIdList: [],
  cartUserIdList: [],
  commentList: [],
  loading: true,
  error: false,
};

const bookReducer = (state: BookDataState, action: BookDataAction) => {
  if (action.type === 'init') {
    return bookDataInitialState;
  }
  if (action.type === 'loading') {
    return { ...state, loading: true, error: false };
  }
  if (action.type === 'book success') {
    return { ...state, book: action.payload };
  }
  if (action.type === 'favorite success') {
    return { ...state, favoriteUserIdList: action.payload };
  }
  if (action.type === 'cart success') {
    return { ...state, cartUserIdList: action.payload };
  }
  if (action.type === 'comment success') {
    return { ...state, commentList: action.payload };
  }
  if (action.type === 'success') {
    return { ...state, loading: false, error: false };
  }
  if (action.type === 'error') {
    return { ...state, loading: false, error: true };
  }
  return state;
};

const Book = () => {
  const { isbn } = useParams();
  const [bookData, bookDispatch] = useReducer<Reducer<BookDataState | any, BookDataAction>>(
    bookReducer,
    bookDataInitialState,
  );
  const [cookies, _] = useCookies();
  const { id, role } = useSelector((state: { user: UserItem }) => state.user);
  const requestCount = useRef<number>(0); // 3 되면 로딩 다 된 것으로 간주
  const isFavorite = bookData.favoriteUserIdList.indexOf(id.toString()) >= 0;
  const favoriteCount = bookData.favoriteUserIdList.length;
  const isCart = bookData.cartUserIdList.indexOf(id.toString()) >= 0;
  const cartCount = bookData.cartUserIdList.length;
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const [isRecommended, setIsRecommended] = useState<boolean>(false);

  // 요청1 : 책 상세 정보
  // 요청2 : 좋아요 정보
  // 요청3 : 장바구니 정보
  // 요청4 : 댓글 정보
  const init = async (dispatch: Dispatch<BookDataAction>, isbn: string) => {
    dispatch({ type: 'init' });
    // 요청1
    await bookRequest(dispatch, isbn, requestCount);
    // 요청2
    await favoriteRequest(dispatch, isbn, requestCount);
    // 요청3
    await cartRequest(dispatch, isbn, requestCount);
    // 요청4
    await commentRequest(dispatch, isbn, requestCount);

    await getRecommended();
  };

  // 추천 책 여부 가져오기
  const getRecommended = async () => {
    if (!isbn) return;
    getRecommendedRequest(cookies.jwt, isbn).then((res) => {
      if (res === null) {
        window.alert('오류가 발생했습니다 다시 시도해주세요');
        return;
      }
      setIsRecommended(res);
    });
  };

  // 추천 책 추가
  const registerRecommendBook = () => {
    if (!isbn) return;
    registerRecommendBookRequest(cookies.jwt, isbn).then((res) => {
      if (res !== true) {
        window.alert(res);
        return;
      }
      getRecommended();
    });
  };

  // 추천 책 삭제
  const deleteRecommendBook = () => {
    if (!isbn) return;
    deleteRecommendBookRequest(cookies.jwt, isbn).then((res) => {
      if (res === null) {
        window.alert('오류가 발생했습니다 다시 시도해주세요');
        return;
      }
      getRecommended();
    });
  };

  useEffect(() => {
    // 책 데이터 가져오기
    if (!isbn) return;
    init(bookDispatch, isbn);
  }, []);

  useEffect(() => {
    if (requestCount.current === 4) {
      requestCount.current = 0;
      bookDispatch({ type: 'success' });
    }
  }, [requestCount.current]);

  return (
    <div>
      {!bookData.loading ? (
        <>
          {/* 책 상세정보 섹션*/}
          <section className={`w-full relative overflow-y-hidden`}>
            {bookData.loading ? (
              ''
            ) : (
              <img src={bookData.book.bookImg} alt="" className={'absolute w-full top-1/2 -translate-y-1/2 left-0'} />
            )}
            <div className={'backdrop-blur-[40px] lg:flex items-center md:px-[15%] md:pb-[30px] pt-[60px]'}>
              {/* 책 이미지 컨테이너 */}
              <div className="w-full flex min-h-[300px] justify-center py-[60px]">
                {/* 책 이미지*/}
                {!bookData.loading ? (
                  <img
                    src={bookData.book.bookImg}
                    alt="book image"
                    className="w-[150px] shadow-[0_0_30px_10px_rgba(0,0,0,0.1)]"
                  />
                ) : (
                  ''
                )}
              </div>
              {/* 책 상세정보 컨테이너*/}
              <div className="w-full bg-white rounded-t-[25px] py-[25px] px-[30px] flex flex-col gap-[20px] md:rounded-[25px] shadow-[0_0_30px_10px_rgba(0,0,0,0.1)]">
                <div className="flex justify-between gap-[20px]">
                  <div className="flex flex-col gap-[5px]">
                    {/* 책 제목 */}
                    {!bookData.loading ? <p className={'text-default-black font-bold'}>{bookData.book.title}</p> : ''}
                    <p className="flex gap-[15px] text-md items-center">
                      {/* 출판사 */}
                      {!bookData.loading ? <span className="text-light-black">{bookData.book.publisher}</span> : ''}
                      {/* 출판일 */}
                      {!bookData.loading ? <span className="text-light-black">{bookData.book.pubDate}</span> : ''}
                    </p>
                    {/* 저자 */}
                    <p className="text-default-black text-md">{bookData.book.author}</p>
                  </div>
                  <div className="flex gap-[20px] text-default-black">
                    {/* 추천 */}
                    {role === 'ROLE_ADMIN' ? (
                      <div>
                        {isRecommended ? (
                          <i className="fi fi-sr-star cursor-pointer" onClick={deleteRecommendBook}></i>
                        ) : (
                          <i className="fi fi-rr-star cursor-pointer" onClick={registerRecommendBook}></i>
                        )}
                      </div>
                    ) : null}
                    {/* 좋아요 컨테이너 */}
                    <div className="flex flex-col gap-[1px] items-center">
                      <div
                        className={'cursor-pointer'}
                        onClick={() => {
                          if (!cookies.jwt) {
                            window.alert('로그인이 필요합니다');
                            return;
                          }
                          putFavoriteRequest(bookDispatch, isbn as string, cookies.jwt, requestCount);
                        }}
                      >
                        {isFavorite ? <i className="fi fi-ss-heart"></i> : <i className="fi fi-rs-heart"></i>}
                      </div>
                      <p className={'text-default-black text-md'}>{favoriteCount}</p>
                    </div>
                    {/* 카트 컨테이너 */}
                    <div className="flex flex-col gap-[1px] items-center">
                      <div
                        className={'cursor-pointer'}
                        onClick={() => {
                          if (!cookies.jwt) {
                            window.alert('로그인이 필요합니다');
                            return;
                          }
                          putCartRequest(bookDispatch, isbn as string, cookies.jwt, requestCount);
                        }}
                      >
                        {isCart ? (
                          <i
                            className="fi fi-sr-shopping-cart"
                            onClick={() => {
                              // todo: 장바구니 넣기
                            }}
                          ></i>
                        ) : (
                          <i
                            className="fi fi-rr-shopping-cart"
                            onClick={() => {
                              // todo: 장바구니 취소
                            }}
                          ></i>
                        )}
                      </div>
                      <p className="text-default-black text-md">{cartCount}</p>
                    </div>
                  </div>
                </div>
                {/* 책 설명 */}
                <div className="flex flex-col gap-[5px]">
                  {!bookData.loading ? (
                    <p className="text-default-black text-md leading-[160%]">{bookData.book.description}</p>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </section>
          {/* 구분선 */}
          <div className="w-full h-[10px] bg-extra-light-black"></div>
          {/* 댓글 리스트*/}
          <section className="py-[20px]">
            {/* 댓글 작성창 컨테이너*/}
            <div className="flex flex-col gap-[15px] mx-[5%] md:mx-[10%] lg:mx-[15%]">
              <p className="text-dark-black">댓글</p>
              {/* 댓글 작성창 */}
              <CommentField
                ref={commentRef}
                isbn={isbn as string}
                dispatch={bookDispatch}
                placeholder={'책에 대한 의견을 남겨주세요'}
              />
            </div>
            {/* 댓글 리스트 컨테이너*/}
            <div className="mt-[30px]">
              {bookData.commentList.map((commentItem: CommentItem, index: number) => (
                <Comment key={index} comment={commentItem} />
              ))}
            </div>
          </section>
        </>
      ) : (
        ''
      )}
    </div>
  );
};

export default Book;
