import { CartBookData } from '../api/item.ts';
import { useNavigate } from 'react-router-dom';

const CartBook = ({
  book,
  changeTotalPrice,
  deleteCartBook,
  checkedCartBookIdList,
  checkClickHandler,
  changeCartBookCount,
}: {
  book: CartBookData;
  changeTotalPrice: (price: number) => void;
  deleteCartBook: () => void;
  checkedCartBookIdList: number[];
  checkClickHandler: (id: number) => void;
  changeCartBookCount: (isbn: string, count: number) => void;
}) => {
  const { isbn, title, img, author, price, discountPercent, count } = book;
  const navigate = useNavigate();

  const discountedPrice = (price * (100 - discountPercent)) / 100;

  // 수량 감소 버튼 클릭 핸들러
  const minusCountClickHandler = () => {
    if (count > 1) {
      changeCartBookCount(isbn, count - 1);
    }
  };

  // 수량 증가 버튼 클릭 핸들러
  const plusCountClickHandler = () => {
    changeCartBookCount(isbn, count + 1);
  };

  const checkHandler = () => {
    changeTotalPrice(discountedPrice * count);
  };

  const uncheckHandler = () => {
    changeTotalPrice(-discountedPrice * count);
  };

  return (
    <div
      className={
        'w-full flex justify-between border-b-[1px] border-black border-opacity-10 pb-[25px] mb-[30px] px-[10px]'
      }
    >
      <div className={'flex gap-[20px]'}>
        <div className={'flex gap-[10px]'}>
          <div
            className={
              'w-[20px] h-[20px] flex justify-center items-center mt-[5px] rounded-full border-[1px] border-black border-opacity-20 cursor-pointer'
            }
            onClick={() => {
              checkClickHandler(book.id);
              if (checkedCartBookIdList.includes(book.id)) {
                uncheckHandler();
              } else {
                checkHandler();
              }
            }}
          >
            {checkedCartBookIdList.includes(book.id) ? (
              <div className={'w-[12px] h-[12px] rounded-full bg-black bg-opacity-80'}></div>
            ) : null}
          </div>
          <img
            src={img}
            alt="book preview"
            className={'w-[70px] rounded-[5px] cursor-pointer'}
            onClick={() => {
              navigate(`/book/${isbn}`);
            }}
          />
        </div>
        <div className={'flex flex-col gap-[30px]'}>
          <div>
            <h2 className={'text-md font-bold text-default-black'}>{title}</h2>
            <p className={'text-md text-light-black'}>{author}</p>
          </div>
          <div className={'flex gap-[30px] items-center'}>
            <div
              className={
                'flex gap-[25px] items-center border-[1px] border-black border-opacity-60 rounded-full px-[15px] py-[7px] text-md font-bold text-default-black'
              }
            >
              <span className={'cursor-pointer'} onClick={minusCountClickHandler}>
                -
              </span>
              {count}
              <span className={'cursor-pointer'} onClick={plusCountClickHandler}>
                +
              </span>
            </div>
            <i
              className="fi fi-rr-trash cursor-pointer text-default-black hover:text-opacity-40 duration-300"
              onClick={deleteCartBook}
            ></i>
          </div>
        </div>
      </div>
      <div className={'text-default-black text-md font-bold flex flex-col items-end'}>
        <div className={'flex gap-[10px] items-center'}>
          <p className={'text-[10px] text-red-500'}>{discountPercent} %</p>
          <p className={'text-light-black line-through'}>{price} 원</p>
        </div>
        <p>{discountedPrice} 원</p>
      </div>
    </div>
  );
};

export default CartBook;
