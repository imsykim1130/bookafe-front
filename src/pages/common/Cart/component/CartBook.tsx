import { deleteCartBookRequest } from '@/api/api';
import { CartBookData } from '@/api/item';
import { useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const CartBookComp = ({
  book,
  changeCount,
  getCartBookList,
}: {
  book: CartBookData;
  changeCount: (changeCount: number, isbn: string) => void;
  getCartBookList: () => void;
}) => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['jwt']);
  const discounted = (book.price * (100 - book.discountPercent)) / 100;

  const deleteCartBook = () => {
    deleteCartBookRequest(cookies.jwt, book.isbn).then((response) => {
      if (!response) {
        window.alert('장바구니 삭제 실패. 다시 시도해주세요');
        return;
      }
      getCartBookList();
    });
  };

  const cartBookDeleteBtnClickHandler = () => {
    deleteCartBook();
  };

  return useMemo(
    () => (
      <article key={book.id} className={'flex gap-[20px] py-[30px] border-b-[1px] border-black border-opacity-10'}>
        {/* 왼쪽 */}
        <div
          className={
            'w-[120px] drop-shadow-[2px_2px_5px_rgba(0,0,0,0.4)] transition-all duration-300 ease hover:drop-shadow-[2px_2px_5px_rgba(0,0,0,0.8)] cursor-pointer'
          }
        >
          {/* 책 이미지 */}
          <img
            src={book.bookImg}
            alt="book cover image"
            className={'rounded-[5px]'}
            onClick={() => {
              navigate(`/book/detail/${book.isbn}`);
            }}
          />
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
            {/* 오른쪽 */}
            <div className={'flex flex-col font-semibold'}>
              <p className={'line-through text-black text-opacity-40'}>{book.price} 원</p>
              <div className={'flex items-center gap-[10px]'}>
                <p>{discounted} 원</p>
                <p className={'text-red-600 text-[12px]'}>{book.discountPercent} %</p>
              </div>
            </div>
          </div>
          {/* 아래 */}
          <div className={'flex gap-[30px] items-center'}>
            <div
              className={
                'flex gap-[25px] items-center border-[1px] border-black border-opacity-60 rounded-full px-[15px] py-[7px] text-md font-bold text-default-black'
              }
            >
              <span
                className={'cursor-pointer'}
                onClick={() => {
                  changeCount(book.count - 1, book.isbn);
                }}
              >
                -
              </span>
              {book.count}
              <span
                className={'cursor-pointer'}
                onClick={() => {
                  changeCount(book.count + 1, book.isbn);
                }}
              >
                +
              </span>
            </div>
            {/* 휴지통 */}
            <i
              className="fi fi-rr-trash text-[16px] cursor-pointer flex justify-center items-center"
              onClick={cartBookDeleteBtnClickHandler}
            ></i>
          </div>
        </div>
      </article>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [book.count],
  );
};

export default CartBookComp;
