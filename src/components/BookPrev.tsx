import { useNavigate } from 'react-router-dom';

interface Props {
  bookImg: string;
  author: string;
  title: string;
  isbn: string;
  price?: number;
  imgSize: number;
}

const BookPrev = (props: Props) => {
  const { bookImg, author, title, isbn, imgSize, price } = props;
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
    <article className={`cursor-pointer flex flex-col`} onClick={bookImgClickHandler}>
      <img
        src={bookImg}
        alt="book image"
        className={`${getImageSize()} my-[15px] rounded-[10px] transition-all duration-500 ease shadow-[2px_2px_10px_rgba(0,0,0,0.6)] hover:shadow-[6px_6px_10px_rgba(0,0,0,0.6)] hover:translate-y-[-10px] hover:scale-105`}
      />
      <div className="flex flex-col gap-[5px] mt-[10px] ml-[5px] text-md">
        <p className="font-semibold text-default-black text-wrap">{title}</p>
        <p className="text-light-black">{author}</p>
        {price ? <p className="text-light-black">{price} 원</p> : null}
      </div>
    </article>
  );
};

export default BookPrev;
