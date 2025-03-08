import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import TextAreaComp from '@/components/ui/TextAreaComp';
import { useBookQuery } from '@/hook/book.hooks';
import {
  Comment,
  replyListQueryKey,
  reviewListQueryKey,
  useCommentMutation,
  useReplyListQuery,
  useReviewListQuery,
} from '@/hook/comment.hooks';
import { useBookFavoriteInfoQuery, useFavoriteBookMutation } from '@/hook/favorite.book.hooks';
import { useRecommendBookMutation, useRecommendQuery } from '@/hook/recommend.book.hooks';
import { useUserQuery } from '@/hook/user.hook';
import { useAuth } from '@/store/auth.store';
import { useChangePage, usePage } from '@/store/page.store';
import { toBookSite } from '@/utils/utils';
import moment from 'moment';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import AlertDialogComp from '../components/AlertDialogComp';
import { queryClient } from '@/main';

//// page
const Book = () => {
  const { isbn } = useParams();
  const { reviewList, isReviewListError, isReviewListLoading } = useReviewListQuery({ isbn });

  if (!isbn) return;

  return (
    <main className="w-full max-w-[60rem] mx-auto">
      <div className="px-[5%]">
        <BookInfo />
        <div className="flex gap-[0.5rem] items-center text-lg font-semibold">
          <p>리뷰</p>
          <span className="flex gap-[0.08rem]">
            {reviewList ? reviewList.length : 0}
            <span>개</span>
          </span>
        </div>
        <ReviewInput />
        <ReviewList
          reviewList={reviewList}
          isReviewListLoading={isReviewListLoading}
          isReviewListError={isReviewListError}
        />
      </div>
    </main>
  );
};

////
const BookInfo = () => {
  const { isbn } = useParams();
  const { book, isBookLoading, isBookError } = useBookQuery({ isbn });
  const kyobo = `https://search.kyobobook.co.kr/search?keyword=${book?.title}`;
  const yes24 = `https://www.yes24.com/Product/Search?query=${book?.title}`;
  const aladin = `https://www.aladin.co.kr/search/wsearchresult.aspx?SearchTarget=All&KeyWord=${book?.title}`;

  if (!book) return null;

  if (isBookLoading) {
    return <p>로딩중</p>;
  }

  if (isBookError) {
    return <p>에러</p>;
  }

  return (
    <div className={'overflow-hidden pt-[100px] pb-[60px] flex flex-col items-center'}>
      {/* 책 배경 */}
      <img src={book.bookImg} className={'w-[100vw] absolute -z-10 bottom-[50vh] blur-3xl opacity-40'}></img>
      {/* 책 표지*/}
      <div className={'w-[150px]'}>
        <img
          src={book.bookImg}
          alt="book cover image"
          className={'w-full rounded-[10px] shadow-[0_0_40px_rgba(0,0,0,0.4)]'}
        />
      </div>
      {/* 책 설명 */}
      <div
        className={
          'min-w-[30rem] mx-[5%] shadow-[0_0_30px_rgba(0,0,0,0.1)] flex flex-col gap-[30px] p-[30px] mt-[60px] rounded-[20px] bg-white bg-opacity-70'
        }
      >
        {/* 위 */}
        <div className={'flex justify-between'}>
          {/* 왼쪽 */}
          <div className={'flex flex-col gap-[10px]'}>
            <p className={'font-bold'}>{book.title}</p>
            <div className={'text-black text-opacity-60 flex gap-[15px]'}>
              <p>{book.publisher}</p>
              <div className={'border-r-[1px] border-black border-opacity-40'}></div>
              <p>{book.pubDate}</p>
            </div>
            <p>{book.author} 저자</p>
          </div>
          {/* 오른쪽 */}
          <div className={'flex gap-[25px]'}>
            {/* 추천*/}
            {<RecommendBtnComp />}
            {/* 좋아요 */}
            <FavoriteBtnComp />
          </div>
        </div>
        <div className="flex flex-col gap-[0.9rem]">
          <p className="font-semibold">구매하기</p>
          <div className="flex gap-[0.9rem]">
            <Button
              variant={'outline'}
              className="border-black/50"
              onClick={() => {
                toBookSite(aladin);
              }}
            >
              알라딘
            </Button>
            <Button
              onClick={() => {
                toBookSite(yes24);
              }}
              variant={'outline'}
              className="border-black/50"
            >
              Yes24
            </Button>
            <Button
              variant={'outline'}
              className="border-black/50"
              onClick={() => {
                toBookSite(kyobo);
              }}
            >
              교보문고
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 책 추천 표시 컴포넌트
const RecommendBtnComp = () => {
  const { isbn } = useParams();
  const { user } = useUserQuery();
  const role = user ? user.role : '';
  const { isRecommended, refetchIsRecommended } = useRecommendQuery({ isbn });

  function onRecommendSuccess() {
    refetchIsRecommended();
  }

  function onRecommendError() {
    console.log('추천 실패. 잠시후 다시 시도해주세요');
  }

  function onUnrecommendSuccess() {
    refetchIsRecommended();
  }

  function onUnrecommendError() {
    console.log('추천 취소 실패. 잠시후 다시 시도해주세요');
  }

  const { recommend, unrecommend } = useRecommendBookMutation({
    onRecommendSuccess,
    onRecommendError,
    onUnrecommendSuccess,
    onUnrecommendError,
  });

  if (!user || role !== 'ROLE_ADMIN' || !isbn) {
    return null;
  }

  return (
    <div className="text-xl font-semibold">
      {isRecommended ? (
        <i className="cursor-pointer fi fi-sr-star" onClick={()=>unrecommend(isbn)}></i>
      ) : (
        <i className="cursor-pointer fi fi-rr-star" onClick={()=>recommend(isbn)}></i>
      )}
    </div>
  );
};

//// 책 좋아요 표시 컴포넌트
const FavoriteBtnComp = () => {
  const { isbn } = useParams();
  const { isFavorite, favoriteCount, refetchBookFavoriteInfo } = useBookFavoriteInfoQuery({ isbn });
  const { likeBook, unlikeBook } = useFavoriteBookMutation({ onLikeBookSuccess, onUnlikeBookSuccess });
  const auth = useAuth();
  function onLikeBookSuccess() {
    refetchBookFavoriteInfo();
  }

  function onUnlikeBookSuccess() {
    refetchBookFavoriteInfo();
  }

  if (!isbn) return;

  return (
    <div className="flex flex-col items-center">
      {auth && isFavorite ? (
        <i
          className="fi fi-ss-heart cursor-pointer text-[1.2rem]"
          onClick={() => {
            if (!auth) {
              window.alert('로그인이 필요합니다');
              return;
            }
            unlikeBook(isbn);
          }}
        ></i>
      ) : (
        <i
          className="fi fi-rs-heart cursor-pointer text-[1.2rem]"
          onClick={() => {
            if (!auth) {
              window.alert('로그인이 필요합니다');
              return;
            }
            likeBook(isbn);
          }}
        ></i>
      )}
      {favoriteCount && <p>{favoriteCount}</p>}
    </div>
  );
};

//// 리뷰 작성창
const ReviewInput = () => {
  const { isbn } = useParams();
  const changePage = useChangePage();
  const auth = useAuth();

  const [content, setContent] = useState<string>('');
  const [emojiIndex, setEmojiIndex] = useState<number>(0);
  const emojiList = ['😀', '🥲', '🤯', '😱'];

  const { createReview } = useCommentMutation({ isbn, onCreateReviewError, onCreateReviewSuccess });

  console.log('review input render');

  function onCreateReviewSuccess() {
    // 리뷰 작성 성공 시 리뷰 리스트 캐시 무효화 하고 첫번째 페이지로 이동
    queryClient.invalidateQueries({
      queryKey: [reviewListQueryKey, isbn],
    });

    changePage(0);
    setContent('');
    setEmojiIndex(0);
  }

  function onCreateReviewError() {
    window.alert('리뷰 작성 실패. 다시 시도해주세요');
  }
  return (
    <div className={'flex flex-col gap-[15px] my-[1.5rem]'}>
      <TextAreaComp
        content={content}
        setContent={setContent}
        loggedInPlaceholder={'리뷰를 남겨보세요'}
        loggedOutPlaceholder={'로그인이 필요합니다'}
      />
      <div className={'flex justify-end gap-[1.5rem] items-center'}>
        <div
          className={'border-[1px] border-black border-opacity-10 rounded-[20px] p-[10px] flex gap-[20px] items-center'}
        >
          <EmojiList emojiList={emojiList} setEmojiIndex={setEmojiIndex} emojiIndex={emojiIndex} />
        </div>
        {/* 작성 버튼 */}
        <Button
          onClick={() => {
            if (!isbn) return;
            createReview({
              content,
              emoji: emojiList[emojiIndex],
            });
          }}
          disabled={!auth}
        >
          작성
        </Button>
      </div>
    </div>
  );
};

/// 이모지 리스트
type EmojiListProps = {
  emojiList: string[];
  emojiIndex: number;
  setEmojiIndex: (index: number) => void;
};

const EmojiList = (props: EmojiListProps) => {
  const auth = useAuth();
  const { emojiList, setEmojiIndex, emojiIndex } = props;

  return emojiList.map((emoji, index) => (
    <div
      key={emoji}
      className={`w-[30px] h-[30px] flex justify-center items-center rounded-full ${index === emojiIndex ? 'bg-black bg-opacity-10' : ''}`}
    >
      <button
        disabled={!auth}
        onClick={() => {
          setEmojiIndex(index);
        }}
      >
        {emoji}
      </button>
    </div>
  ));
};

//// 리뷰 리스트 컴포넌트
type ReviewListProps = {
  reviewList: Comment[];
  isReviewListLoading: boolean;
  isReviewListError: boolean;
};

const ReviewList = (props: ReviewListProps) => {
  const { reviewList, isReviewListLoading, isReviewListError } = props;
  const page = usePage();

  console.log('review list render');

  const Alert = ({ children }: { children: React.ReactNode }) => {
    return <div className="text-black/40 text-center my-[3rem]">{children}</div>;
  };

  if (isReviewListLoading) {
    return (
      <Alert>
        <p>리뷰 로딩중...</p>
      </Alert>
    );
  }

  if (isReviewListError) {
    return (
      <Alert>
        <p>리뷰를 불러오는 중에 문제가 생겼습니다</p>
      </Alert>
    );
  }

  if (reviewList.length === 0) {
    return (
      <Alert>
        <p>리뷰가 없습니다</p>
      </Alert>
    );
  }

  return (
    <div className="my-[3rem]">
      {reviewList.map((reviewItem: Comment) => (
        <Review key={reviewItem.id} review={reviewItem} page={page} />
      ))}
    </div>
    // 페이지네이션 추후 추가
  );
};

//// 리뷰 컴포넌트
const Review = ({
  review,
  page,
  // pageChange,
}: {
  review: Comment;
  page: number;
}) => {
  const [isFavorite] = useState<boolean>(false);
  const [favoriteCount] = useState<number>(0);
  const [replyCount, setReplyCount] = useState<number>(0);
  const [replyOpen, setReplyOpen] = useState<boolean>(false);
  const { isbn } = useParams();
  const changePage = useChangePage();

  const [isModify, setIsModify] = useState<boolean>(false);
  const [content, setContent] = useState('');
  const { fixReview, deleteReview } = useCommentMutation({ isbn, onFixReviewSuccess, onDeleteReviewSuccess });

  // handler: 리뷰 수정 성공 핸들러
  function onFixReviewSuccess() {
    // 리뷰 수정 성공 시 수정된 리뷰의 캐시 데이터 수정
    // 수정의 경우 캐시 데이터를 다시 받아오면 수정한 리뷰가 다른 화면으로 넘어가는 경우가 생길 수 있기 때문에
    // 캐시 무효화로 데이터를 새로 받아오지 않고 수동으로 캐시 데이터를 수정함
    queryClient.setQueryData([reviewListQueryKey, isbn, page], (oldReviews: Comment[]) =>
      oldReviews.map((oldReview) => {
        return oldReview.id === review.id ? { ...oldReview, content: content } : oldReview;
      }),
    );
    setIsModify(false);
  }

  // handler: 리뷰 삭제 성공 핸들러
  function onDeleteReviewSuccess() {
    // 리뷰 삭제 성공 시 리뷰 리스트 캐시 삭제 후 첫 페이지로 이동
    queryClient.invalidateQueries({
      queryKey: [reviewListQueryKey, isbn],
    });
    changePage(0);
  }

  // 리뷰 수정 취소
  const cancelUpdateReview = (page: number, reviewId: number) => {
    // 쿼리에서 수정하기 전 리뷰 내용을 캐시에서 가져와서 현재 리뷰 내용에 덮어쓰기
    const replyList = queryClient.getQueryData([reviewListQueryKey, isbn, page]) as Comment[];
    console.log(replyList);
    const oldReply = replyList.filter((reply: Comment) => reply.id === reviewId)[0] as Comment;
    setContent(oldReply.content);
  };

  useEffect(() => {
    setReplyCount(review.replyCount);
    setContent(review.content);
  }, []);

  return (
    <article>
      <div className="border-b-[0.0625rem] pb-[1.5rem] border-black/10 flex flex-col gap-[1.3rem] py-[1.3rem]">
        <div className="flex flex-col gap-[0.6rem]">
          <div className="flex items-center justify-between">
            <ReviewInfo
              profileImg={review.profileImg}
              nickname={review.nickname}
              writeDate={review.writeDate}
              emoji={review.emoji}
            />
            <ReviewModify
              isDeleted={review.isDeleted}
              isModify={isModify}
              nickname={review.nickname}
              setIsModify={setIsModify}
              deleteReview={() => deleteReview(review.id)}
              updateReview={() =>
                fixReview({
                  reviewId: review.id,
                  content,
                })
              }
              cancelUpdateReview={() => cancelUpdateReview(page, review.id)}
            />
          </div>
          <ReviewContent
            reviewContent={content}
            setReviewContent={setContent}
            isModify={isModify}
            isDeleted={review.isDeleted}
          />
        </div>
        <ReviewStats
          replyCount={replyCount}
          setReplyOpen={() => setReplyOpen(!replyOpen)}
          isFavorite={isFavorite}
          favoriteCount={favoriteCount}
        />
      </div>
      <ReplySection isOpen={replyOpen} reviewId={review.id} />
    </article>
  );
};

////
interface ReviewStatsProps {
  replyCount: number;
  setReplyOpen: () => void;
  isFavorite: boolean;
  favoriteCount: number;
}

const ReviewStats = (props: ReviewStatsProps) => {
  const { replyCount, setReplyOpen, isFavorite, favoriteCount } = props;
  return (
    <div className="flex justify-end gap-[1.5rem]">
      <div
        className={'flex gap-[5px] items-center cursor-pointer'}
        onClick={() => {
          setReplyOpen();
        }}
      >
        <span>💬</span>
        <span>{replyCount}</span>
      </div>
      <div className={'flex gap-[5px] items-center cursor-pointer'}>
        <span>{isFavorite ? <span>❤️</span> : <span className={'opacity-40'}>❤️</span>}</span>
        <span>{favoriteCount}</span>
      </div>
    </div>
  );
};

////
const ReviewModify = ({
  isDeleted,
  isModify,
  nickname,
  setIsModify,
  updateReview,
  cancelUpdateReview,
  deleteReview,
}: {
  isDeleted: boolean;
  isModify: boolean;
  nickname: string;
  setIsModify: React.Dispatch<React.SetStateAction<boolean>>;
  updateReview: () => void;
  cancelUpdateReview: () => void;
  deleteReview: () => void;
}) => {
  const { user } = useUserQuery();

  const Container = ({ children }: { children: React.ReactNode }) => {
    return <div className="flex gap-[0.8rem] text-sm text-black/60">{children}</div>;
  };

  if (!user || user?.nickname !== nickname || isDeleted) return;

  // 수정 중일 때
  if (isModify) {
    return (
      <Container>
        <button onClick={updateReview}>제출</button>
        <span className="border-r-[0.0625rem]"></span>
        <button
          onClick={() => {
            cancelUpdateReview();
            setIsModify(false);
          }}
        >
          취소
        </button>
      </Container>
    );
  }
  // 수정 중 아닐 때
  return (
    <Container>
      <button onClick={() => setIsModify(true)}>수정</button>
      <span className="border-r-[0.0625rem]"></span>
      <AlertDialogComp logoutClickHandler={deleteReview} message="삭제하시겠습니까?">
        <button>삭제</button>
      </AlertDialogComp>
    </Container>
  );
};

//// 리뷰 정보
const ReviewInfo = ({
  profileImg,
  nickname,
  writeDate,
  emoji,
}: {
  profileImg: string | undefined;
  nickname: string | undefined;
  writeDate: string | undefined;
  emoji: string | undefined;
}) => {
  return (
    <div className={'flex gap-[10px] items-center'}>
      <div className={'w-[30px] h-[30px] rounded-full overflow-hidden flex justify-center items-center'}>
        {profileImg ? (
          <img src={profileImg} alt="profile image" />
        ) : (
          <div className={'flex justify-center items-center w-full h-full bg-black bg-opacity-5'}>
            <i className="text-black fi fi-br-user text-opacity-20"></i>
          </div>
        )}
      </div>
      <span className={'font-semibold'}>{nickname}</span>
      <span className={'text-black text-opacity-60'}>{moment(writeDate).format('YYYY.MM.DD')}</span>
      <span>{emoji ? emoji : ''}</span>
    </div>
  );
};

//// 리뷰 내용
const ReviewContent = ({
  reviewContent,
  setReviewContent,
  isModify,
  isDeleted,
}: {
  reviewContent: string | null;
  setReviewContent: (newContent: string) => void;
  isModify: boolean;
  isDeleted: boolean;
}) => {
  const reviewContentRef = useRef<HTMLTextAreaElement>(null);

  const resizeTextArea = (element: HTMLTextAreaElement) => {
    element.style.height = 'auto'; // 높이 초기화
    element.style.height = element.scrollHeight + 'px';
  };

  useEffect(() => {
    if (!reviewContentRef.current) return;
    resizeTextArea(reviewContentRef.current);
  }, [reviewContentRef]);

  useEffect(() => {
    if (!isModify || !reviewContentRef.current || !reviewContent) return;
    reviewContentRef.current.focus();
    reviewContentRef.current.setSelectionRange(reviewContent.length, reviewContent.length);
  }, [isModify]);

  if (isDeleted) {
    return <p>삭제된 댓글입니다</p>;
  }

  return (
    <textarea
      ref={reviewContentRef}
      value={reviewContent ? reviewContent : ''}
      disabled={!isModify}
      onInput={() => resizeTextArea(reviewContentRef.current as HTMLTextAreaElement)}
      onChange={(e) => {
        setReviewContent(e.target.value);
      }}
      className="w-full outline-none resize-none input-disabled"
    ></textarea>
  );
};

//// 리플 섹션
interface ReplySectionProps {
  isOpen: boolean;
  reviewId: number;
}
const ReplySection = (props: ReplySectionProps) => {
  const { isbn } = useParams();
  const { isOpen, reviewId } = props;
  const page = usePage(); // 리뷰 페이지
  const [content, setContent] = useState('');
  const { createReply } = useCommentMutation({ isbn, onCreateReplySuccess });

  // 리플 작성 성공 핸들러
  function onCreateReplySuccess() {
    // 성공
    // 입력창 초기화
    setContent('');

    // 리뷰의 리플 개수 캐시 수정
    queryClient.setQueryData([reviewListQueryKey, isbn, page], (oldReviews: Comment[]) => {
      return oldReviews.map((review) =>
        review.id === reviewId ? { ...review, replyCount: review.replyCount + 1 } : review,
      );
    });
    // 리플 리스트 캐시 무효화하여 데이터 다시 가져오기
    queryClient.invalidateQueries({
      queryKey: [replyListQueryKey, reviewId],
    });
  }

  if (!isOpen) return null;

  return (
    <>
      <div className="my-[0.6rem]">
        <ReplyList replyOpen={isOpen} reviewId={reviewId} />
        <TextAreaComp
          content={content}
          setContent={setContent}
          loggedInPlaceholder={'어떻게 생각하세요?'}
          loggedOutPlaceholder={'로그인이 필요합니다'}
        />
        <div className="flex justify-end my-[0.5rem]">
          <ReplyCreateBtn
            onClick={() =>
              createReply({
                content,
                parentId: reviewId,
              })
            }
          />
        </div>
      </div>
    </>
  );
};

//// 리플 작성 버튼 컴포넌트
interface ReplyCreateBtnProps {
  onClick: () => void;
  className?: string;
}

const ReplyCreateBtn = (props: ReplyCreateBtnProps) => {
  const { onClick, className } = props;
  const auth = useAuth();

  return (
    <Button className={className} onClick={onClick} disabled={!auth}>
      작성
    </Button>
  );
};

/// 리플 리스트
const ReplyList = ({ replyOpen, reviewId }: { replyOpen: boolean; reviewId: number }) => {
  const { replyList } = useReplyListQuery(reviewId, replyOpen);
  const { isbn } = useParams();
  const page = usePage();
  const { deleteReply } = useCommentMutation({ isbn, onDeleteReplySuccess });

  // 리뷰 삭제 성공 핸들러
  function onDeleteReplySuccess() {
    // 리뷰의 리플 개수 캐시 수정
    queryClient.setQueryData([reviewListQueryKey, isbn, page], (oldReviews: Comment[]) => {
      return oldReviews.map((review) =>
        review.id === reviewId ? { ...review, replyCount: review.replyCount - 1 } : review,
      );
    });

    // 성공하면 리플 리스트 캐시 무효화
    queryClient.invalidateQueries({
      queryKey: [replyListQueryKey, reviewId],
    });
  }

  if (!replyList || !replyOpen) {
    return null;
  }

  if (replyList.length === 0) {
    return (
      <Container className={'py-[1.5rem] bg-black/5 rounded-[1rem] my-[1rem]'}>
        <p className="text-sm text-center text-black/60 my">리플이 없습니다</p>
      </Container>
    );
  }

  return (
    <Container className="pt-[1rem] pb-[3rem]">
      {replyList.map((reply: Comment) => (
        <Reply key={reply.id} reply={reply} deleteReply={(replyId: number) => deleteReply(replyId)} />
      ))}
    </Container>
  );
};

//// 리플
const Reply = ({ reply, deleteReply }: { reply: Comment; deleteReply: (replyId: number) => void }) => {
  const { user } = useUserQuery();

  return (
    <div className="relative p-[1.5rem] pl-[2rem] border-b-[0.0625rem] border-black/10 flex flex-col gap-[0.6rem]">
      <i className="absolute top-[1.5rem] left-0 fi fi-rr-arrow-turn-down-right"></i>
      <div className="flex items-center gap-[1rem]">
        <div className="size-[2rem] rounded-full overflow-auto flex justify-center items-center border-[0.0625rem] border-black/10">
          <img src={reply.profileImg} alt="reply profile image" />
        </div>
        <div className="flex items-center gap-[1rem]">
          <p className="font-semibold">{reply.nickname}</p>
          <p className="opacity-60">{moment(reply.writeDate).format('YYYY-MM-DD')}</p>
        </div>
        <div className="flex justify-end flex-1">
          {user && reply.nickname === user.nickname && reply.content && (
            <button className="text-sm opacity-60" onClick={() => deleteReply(reply.id)}>
              삭제
            </button>
          )}
        </div>
      </div>
      <div>
        <p>{reply.content ? reply.content : '삭제된 댓글입니다'}</p>
      </div>
    </div>
  );
};

export default Book;
