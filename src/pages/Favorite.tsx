import ErrorComp from '@/components/ErrorComp';
import PaginationComp from '@/components/PaginationComp';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useFavorite, useFavoriteBookList } from '@/hook/favoriteHooks';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Favorite = () => {
  const navigate = useNavigate();
  const { page, setPage, favoriteBookList, totalPages, isFavoriteBookListLoading, favoriteBookListError } =
    useFavoriteBookList();

  const {
    checkedBookIsbnList,
    checkAllBtnClickHandler,
    checkBookClickHandler,
    favoriteCancelBtnClickHandler,
    favoriteDeleteIconBtnClickHandler,
  } = useFavorite();

  // effect
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  if (favoriteBookListError) {
    return <ErrorComp />;
  }

  if (isFavoriteBookListLoading) {
    return <p>로딩중</p>;
  }

  if (favoriteBookList) {
    return (
      <main className={'flex flex-col mt-[40px] min-h-[100vh]'}>
        <div className={'w-full max-w-[600px] px-[1rem] mx-auto'}>
          {/* 페이지 이름 */}
          <div className="flex items-center justify-between pr-[1.5rem]">
            <p className="text-lg font-semibold">좋아요</p>
            {/* 전체선택 체크박스 */}
            <div className="flex items-center gap-4">
              <p className="text-sm">전체선택</p>
              <Checkbox onClick={() => checkAllBtnClickHandler(favoriteBookList.map((item) => item.isbn))}></Checkbox>
            </div>
          </div>
          <div>
            {/* 좋아요 책 없을 때 */}
            {favoriteBookList.length === 0 && <h1 className={'opacity-60'}>결과가 없습니다.</h1>}

            {/* 좋아요 책 있을 때 */}
            {favoriteBookList.length > 0 &&
              favoriteBookList.map((book) => (
                <article
                  key={book.isbn}
                  className={
                    'relative flex gap-[1.5rem] py-[1.5rem] border-b-[0.025rem] border-black border-opacity-10'
                  }
                >
                  {/* 책 이미지 */}
                  <div
                    className={
                      'max-w-[8rem] drop-shadow-[2px_2px_5px_rgba(0,0,0,0.4)] transition-all duration-300 ease hover:drop-shadow-[2px_2px_5px_rgba(0,0,0,0.8)] cursor-pointer'
                    }
                    onClick={() => {
                      navigate('/book/detail/' + book.isbn);
                    }}
                  >
                    <img src={book.bookImg} alt="book cover image" className={'rounded-[0.625rem]'} />
                  </div>

                  {/* 오른쪽 */}
                  <div className={'flex-1 text-[14px] flex flex-col gap-[20px]'}>
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
                          favoriteDeleteIconBtnClickHandler(book.isbn);
                        }}
                      ></i>
                    </div>
                    {/* 체크박스 */}
                    <div className="absolute top-[1.5rem] right-[1.5rem]">
                      <Checkbox
                        onClick={() => {
                          checkBookClickHandler(book.isbn);
                        }}
                        checked={checkedBookIsbnList.indexOf(book.isbn) >= 0}
                      ></Checkbox>
                    </div>
                  </div>
                </article>
              ))}
            {/* 페이지네이션 */}
            <PaginationComp currentPage={page} totalPages={totalPages} setCurrentPage={setPage} />
            {/* 일괄 삭제 버튼 */}
            {checkedBookIsbnList.length > 0 && (
              <Button className="sticky bottom-[2rem] w-full my-[1rem]" onClick={favoriteCancelBtnClickHandler}>
                삭제
              </Button>
            )}
          </div>
        </div>
      </main>
    );
  }
};

export default Favorite;
