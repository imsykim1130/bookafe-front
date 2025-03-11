import ErrorComp from '@/components/ErrorComp';
import PaginationComp from '@/components/PaginationComp';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  FavoriteBook,
  favoriteBookListQueryKey,
  useFavoriteBookHandler,
  useFavoriteBookListQuery,
  useFavoriteBookMutation,
} from '@/hook/favorite.book.hooks';
import { queryClient } from '@/main';
import { ErrorResponse } from '@/types/common.type';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Favorite = () => {
  // handlers
  const { size, page, setPage, checkedBookIsbnList, setCheckedBookIsbnList, bookCheckHandler, checkAllClickHandler } =
    useFavoriteBookHandler();
  // query
  const { favoriteBookList, totalPages, isFavoriteBookListLoading, isFavoriteBookListError } = useFavoriteBookListQuery(
    { page, size },
  );
  // mutate
  const { unlikeBook, unlikeBookList } = useFavoriteBookMutation({
    onUnlikeBookError,
    onUnlikeBookSuccess,
    onUnlikeBookListError,
    onUnlikeBookListSuccess,
  });

  // mutation 성공, 실패 핸들러
  // 좋아요 취소 성공 핸들러
  function onUnlikeBookError(err: ErrorResponse) {
    console.log(err.message);
    window.alert('좋아요 취소 실패. 잠시후 다시 시도해주세요');
  }

  // 좋아요 취소 실패 핸들러
  function onUnlikeBookSuccess() {
    // 좋아요 책 리스트 쿼리 무효화
    queryClient.invalidateQueries({
      queryKey: [favoriteBookListQueryKey],
    });
    // 선택 isbn 리스트 초기화
    setCheckedBookIsbnList([]);
  }

  // 좋아요 일괄 취소 성공 핸들러
  function onUnlikeBookListSuccess() {
    // 좋아요 책 리스트 쿼리 무효화
    queryClient.invalidateQueries({
      queryKey: [favoriteBookListQueryKey],
    });
    // 선택 isbn 리스트 초기화
    setCheckedBookIsbnList([]);
  }

  // 좋아요 일괄 취소 실패 핸들러
  function onUnlikeBookListError(err: ErrorResponse) {
    console.log(err.message);
    window.alert('좋아요 취소 실패. 잠시후 다시 시도해주세요');
  }

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: [favoriteBookListQueryKey],
    });
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <main className={'flex flex-col mt-[40px] min-h-[100vh]'}>
      <div className={'w-full max-w-[600px] px-[1rem] mx-auto'}>
        {/* 페이지 이름 */}
        <div className="flex items-center justify-between pr-[1.5rem]">
          <p className="text-lg font-semibold">좋아요</p>
          {/* 전체선택 체크박스 */}
          {favoriteBookList.length !== 0 && (
            <div className="flex items-center gap-4">
              <p className="text-sm">전체선택</p>
              <Checkbox onClick={() => checkAllClickHandler(favoriteBookList.map((item) => item.isbn))}></Checkbox>
            </div>
          )}
        </div>
        <div className="mt-[1rem]">
          <FavoriteBookList
            favoriteBookList={favoriteBookList}
            isError={isFavoriteBookListError}
            isLoading={isFavoriteBookListLoading}
            unlikeBook={unlikeBook}
            bookCheckHandler={bookCheckHandler}
            checkedBookIsbnList={checkedBookIsbnList}
          />
          <PaginationComp currentPage={page} setCurrentPage={setPage} totalPages={totalPages} />
          {/* 일괄 삭제 버튼 */}
          {checkedBookIsbnList.length > 0 && (
            <Button
              className="sticky bottom-[2rem] w-full my-[1rem]"
              onClick={() => unlikeBookList(checkedBookIsbnList)}
            >
              삭제
            </Button>
          )}
        </div>
      </div>
    </main>
  );
};

function FavoriteBookList({
  favoriteBookList,
  isError,
  isLoading,
  unlikeBook,
  bookCheckHandler,
  checkedBookIsbnList,
}: {
  favoriteBookList: FavoriteBook[];
  isError: boolean;
  isLoading: boolean;
  unlikeBook: (isbn: string) => void;
  bookCheckHandler: (isbn: string) => void;
  checkedBookIsbnList: string[];
}) {
  const navigate = useNavigate();

  // render
  if (isError) {
    return <ErrorComp />;
  }

  if (isLoading) {
    return <p className="text-center">로딩중...</p>;
  }

  if (favoriteBookList.length === 0) {
    return <h1 className={'text-black/60'}>결과가 없습니다.</h1>;
  }

  return favoriteBookList.map((book) => (
    <article
      key={book.isbn}
      className={'relative flex gap-[1.5rem] py-[1.5rem] border-b-[0.025rem] border-black border-opacity-10'}
    >
      {/* 책 이미지 */}
      <div
        className={'max-w-[8rem]  cursor-pointer'}
        onClick={() => {
          navigate('/book/detail/' + book.isbn);
        }}
      >
        <img
          src={book.bookImg}
          alt="book cover image"
          className={
            'rounded-[0.625rem] shadow-[0_0_5px_rgba(0,0,0,0.3)] transition-shadow ease hover:shadow-[0_0_10px_rgba(0,0,0,0.5)]'
          }
        />
      </div>

      {/* 오른쪽 */}
      <div className={'flex-1 text-[14px] flex flex-col gap-[20px] mr-[3rem]'}>
        {/* 위 */}
        <div className={'w-full flex flex-col gap-[20px]'}>
          {/* 왼쪽 */}
          <div>
            <p className={'font-semibold'}>{book.title}</p>
            <p className={'text-black text-opacity-60'}>{book.author}</p>
          </div>
        </div>
        <div className="absolute bottom-[1.5rem] right-[1.5rem]">
          {/* 휴지통 */}
          <i
            className="fi fi-rr-trash text-[16px] cursor-pointer flex   justify-center items-center icon-btn"
            onClick={() => {
              unlikeBook(book.isbn);
            }}
          ></i>
        </div>
        {/* 체크박스 */}
        <div className="absolute top-[1.5rem] right-[1.5rem]">
          <Checkbox
            onClick={() => {
              bookCheckHandler(book.isbn);
            }}
            checked={checkedBookIsbnList.indexOf(book.isbn) >= 0}
          ></Checkbox>
        </div>
      </div>
    </article>
  ));
}

export default Favorite;
