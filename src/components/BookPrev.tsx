import { useNavigate } from 'react-router-dom';

interface Props {
  bookImg: string;
  author: string;
  title: string;
  isbn: string;
  price?: number;
  type?: 'favorite' | 'cart';
  imgSize: number;
}

const BookPrev = (props: Props) => {
  const { bookImg, author, title, isbn, type, imgSize, price } = props;
  const navigate = useNavigate();

  const getImageSize = () => {
    return `w-[${imgSize}px]`;
  };

  const bookImgClickHandler = () => {
    // isbn 을 네비게이션을 이용해 url param 으로 넘겨준다.
    const url = `/book/detail/${isbn}`;
    navigate(url);
  };

  return (
    <article
      className={`cursor-pointer flex ${!type ? 'flex-col' : 'flex-row gap-[15px]'}`}
      onClick={bookImgClickHandler}
    >
      <img src={bookImg} alt="book image" className={`rounded-[5px] ` + getImageSize()} />
      <div className="flex flex-col gap-[5px] mt-[10px] ml-[5px] text-md">
        <p className="text-default-black font-semibold text-wrap">{title}</p>
        <p className="text-light-black">{author}</p>
        {price ? <p className="text-light-black">{price} 원</p> : null}
      </div>
    </article>
  );
};

export default BookPrev;
