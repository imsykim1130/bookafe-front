import { changeCartBookCountRequest, deleteCartBookRequest } from '@/api/api';
import { CartBookData } from '@/api/item';
import { useMemo } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const CartBookComp = ({ book, refetchCartBookList }: { book: CartBookData,  refetchCartBookList: () => void }) => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['jwt']);
  const discounted = (book.price * (100 - book.discountPercent)) / 100;

  // function: 장바구니 책 삭제 요청
  const deleteCartBook = () => {
    deleteCartBookRequest(cookies.jwt, book.isbn).then((response) => {
      // 실패
      if (!response) {
        window.alert('장바구니 삭제 실패. 다시 시도해주세요');
        return;
      }
      // 성공
      refetchCartBookList();
    });
  };

  // function: 장바구니 수량 감소 요청
  const changeCount = (changeCount: number, isbn: string) => {
    // 1보다 작은 수량으로 변경 불가
    if (changeCount < 1) {
      window.alert('주문 수량은 최소 1개입니다');
      return;
    }
    console.log('장바구니 수량 변경');
    // 수량 변경 요청
    changeCartBookCountRequest(cookies.jwt, isbn, changeCount)
    .then(result => {
      // 수량 변경 실패
      if(!result) {
        window.alert("다시 시도해주세요");
        return;
      }
      // 수량 변경 성공
      refetchCartBookList();
    })
  };

  const cartBookDeleteBtnClickHandler = () => {
    deleteCartBook();
  };

  return useMemo(
    () => (
      <article key={book.id} className={'flex gap-[20px] py-[30px] border-t-[1px] border-black border-opacity-10'}>
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
