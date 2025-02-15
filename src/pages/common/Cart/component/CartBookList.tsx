import { CartBookData } from '@/api/item';
import { DOMAIN } from '@/utils';
import axios from 'axios';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useQuery } from 'react-query';
import CartBook from './CartBook';
import CartBookRecomend from './CartBookRecomend';

const fetchGetCartBookList = (jwt: string) => {
  return axios.get(DOMAIN + '/cart/list', {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
};

const CartBookList = () => {
  const [cookies] = useCookies(['jwt']);
  const { isLoading, data, isError, error, refetch } = useQuery(
    'getCartBookList',
    () => fetchGetCartBookList(cookies.jwt),
    {
      enabled: false, // immediate fetching 막기
      onError: () => {
        console.log(error);
      },
    },
  );

  // function: 장바구니 책 refetch
  const refetchCartBookList = () => {
    refetch();
  };

  useEffect(() => {
    refetchCartBookList();
  }, []);

  // render
  return (
    <section className="w-full max-w-[37.5rem] p-[1rem] border-[0.1rem] border-black/10 rounded-[0.6rem]">
      <div className="mb-[1rem] flex flex-col gap-[0.2rem]">
        <p className="font-bold">{data?.data.length === 0 ? '장바구니 책이 없습니다' : '장바구니 책'}</p>
        <p className="text-sm text-black/60">
          {data?.data.length === 0 ? '키워드를 추천해드릴게요' : '구매하실 책을 다시 한 번 확인해주세요'}
        </p>
      </div>

      {/* 로딩중일 때 */}
      {isLoading && <p>loading...</p>}
      {/* 에러 발생했을 때 */}
      {isError && <p>데이터 가져오기 실패</p>}
      {/* 정상 */}
      {!isLoading && !isError && (
        <div>
          {data?.data.map((item: CartBookData) => (
            <CartBook key={item.isbn} book={item} refetchCartBookList={refetchCartBookList} />
          ))}
        </div>
      )}
      {/* 책 추천 */}
      <CartBookRecomend refetchCartBookList={refetchCartBookList} />
    </section>
  );
};

export default CartBookList;
