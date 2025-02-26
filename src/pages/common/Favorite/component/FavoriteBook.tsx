import { FavoriteBookItem } from '@/api/item';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate } from 'react-router-dom';

interface Props {
  book: FavoriteBookItem;
  deleteFavoriteBook: (isbn: string) => void;
  checkedBookIsbnList: string[];
  checkBook: (isbn: string) => void;
}

function FavoriteBook({ book, deleteFavoriteBook, checkedBookIsbnList, checkBook }: Props) {
  const discounted = book.price - (book.price * book.discountPercent) / 100;
  const navigate = useNavigate();

  return (
    <article
      key={book.isbn}
      className={'relative flex gap-[1.5rem] py-[1.5rem] border-b-[0.025rem] border-black border-opacity-10'}
    >
      {/* 책 이미지 */}
      <div
        className={
          'max-w-[8rem] drop-shadow-[2px_2px_5px_rgba(0,0,0,0.4)] transition-all duration-300 ease hover:drop-shadow-[2px_2px_5px_rgba(0,0,0,0.8)] cursor-pointer'
        }
        onClick={() => {
          navigate("/book/detail/" + book.isbn);
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
          {/* 오른쪽 */}
          <div className={'flex flex-col font-semibold'}>
            <p className={'line-through text-black text-opacity-40'}>{book.price} 원</p>
            <div className={'flex items-center gap-[10px]'}>
              <p>{discounted} 원</p>
              <p className={'text-red-600 text-[12px]'}>{book.discountPercent} %</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-[1.5rem] right-[1.5rem]">
          {/* 휴지통 */}
          <i
            className="fi fi-rr-trash text-[16px] cursor-pointer flex   justify-center items-center icon-btn"
            onClick={() => {
              deleteFavoriteBook(book.isbn);
            }}
          ></i>
        </div>
        {/* 체크박스 */}
        <div className="absolute top-[1.5rem] right-[1.5rem]">
          <Checkbox
            onClick={() => {
              checkBook(book.isbn);
            }}
            checked={checkedBookIsbnList.indexOf(book.isbn) >= 0}
          ></Checkbox>
        </div>
      </div>
    </article>
  );
}

export default FavoriteBook;
