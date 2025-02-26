import { useNavigate } from 'react-router-dom';

interface Props {
  bookImg: string;
  author: string;
  title: string;
  isbn: string;
  price?: number;
  imgSize?: number;
}

const BookPrev = (props: Props) => {
  const { bookImg, author, title, isbn, price } = props;
  const navigate = useNavigate();

  const bookImgClickHandler = () => {
    // isbn 을 네비게이션을 이용해 url param 으로 넘겨준다.
    const url = `/book/detail/${isbn}`;
    navigate(url);
  };

  return (
    <article className={`w-full cursor-pointer flex flex-col`} onClick={bookImgClickHandler}>
      <img
        src={bookImg}
        alt="book image"
        className={`w-full my-[15px] rounded-[10px] shadow-[0_0_10px_rgba(0,0,0,0.2)] icon-btn`}
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
