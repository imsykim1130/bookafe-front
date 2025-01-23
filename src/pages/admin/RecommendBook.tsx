import PageTitle from '../../components/PageTitle.tsx';
import { useEffect, useState } from 'react';
import { RecommendBookItem } from '../../api/item.ts';
import { deleteRecommendBookRequest, getAllRecommendBookRequest } from '../../api';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

// const mock: RecommendBookItem = {
//   title: 'hihi',
//   author: 'heheh',
//   bookImg:
//     'https://plus.unsplash.com/premium_photo-1670598267085-053235b0d6de?q=80&w=3686&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   publisher: 'heheh',
// };

const RecommendBook = () => {
  const [cookies, _] = useCookies();
  const [recommentBookList, setRecommentBookList] = useState<RecommendBookItem[] | null>(null);

  const getAllRecommendBook = async () => {
    getAllRecommendBookRequest(cookies.jwt).then((result) => {
      setRecommentBookList(result);
    });
  };

  const deleteRecommendBook = async (isbn: string) => {
    deleteRecommendBookRequest(cookies.jwt, isbn).then((result) => {
      if (!result) {
        window.alert('오류가 발생했습니다 다시 시도해주세요');
        return;
      }
      getAllRecommendBook();
    });
  };

  useEffect(() => {
    getAllRecommendBook();
  }, []);

  return (
    <div>
      <PageTitle title={'추천 책 관리'} />
      <main className={'mx-[5%] md:mx-[10%] lg:mx-[15%]'}>
        {recommentBookList && recommentBookList.length > 0
          ? recommentBookList.map((book: RecommendBookItem) => (
              <RecommendBookComp key={book.id} book={book} deleteRecommendBook={deleteRecommendBook} />
            ))
          : null}
      </main>
    </div>
  );
};

const RecommendBookComp = ({
  book,
  deleteRecommendBook,
}: {
  book: RecommendBookItem;
  deleteRecommendBook: (isbn: string) => void;
}) => {
  const { title, author, bookImg, publisher, isbn } = book;
  const navigate = useNavigate();

  return (
    <div className={'flex justify-between py-[30px] border-b-[1px] border-black border-opacity-10'}>
      <div className={'flex gap-[30px]'}>
        <div
          className={'w-[120px] rounded-[5px] overflow-hidden cursor-pointer'}
          onClick={() => {
            navigate(`/book/detail/${isbn}`);
          }}
        >
          <img src={bookImg} alt="" />
        </div>
        <div className={'flex flex-col gap-[15px]'}>
          <div className={'flex flex-col gap-[5px]'}>
            <p className={'font-bold'}>{title}</p>
            <p className={'text-black text-opacity-40'}>{publisher}</p>
          </div>
          <p>{author}</p>
        </div>
      </div>
      <div>
        <i
          className="fi fi-rr-trash cursor-pointer text-default-black hover:text-opacity-40 duration-300"
          onClick={() => deleteRecommendBook(isbn)}
        ></i>
      </div>
    </div>
  );
};

export default RecommendBook;
