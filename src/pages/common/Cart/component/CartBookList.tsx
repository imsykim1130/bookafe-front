import { CartBookData } from '@/api/item';
import CartBook from './CartBook';
import CartBookRecommend from './CartBookRecommend.tsx';

interface Props {
  isLoading: boolean;
  isError: boolean;
  cartBookList: CartBookData[];
  cartBookListRefetch: () => void;
}

const CartBookList = ({ isLoading, isError, cartBookList, cartBookListRefetch }: Props) => {
  // function: 장바구니 책 refetch
  const refetchCartBookList = () => {
    cartBookListRefetch();
  };

  // render
  return (
    <section className="cart-section">
      <div className="flex flex-col gap-[0.2rem]">
        <p className="font-bold">{cartBookList?.length === 0 ? '장바구니 책이 없습니다' : '장바구니 책'}</p>
        <p className="text-sm text-black/60">
          {cartBookList?.length === 0 ? '키워드를 추천해드릴게요' : '구매하실 책을 다시 한 번 확인해주세요'}
        </p>
      </div>

      {/* 로딩중일 때 */}
      {isLoading && <p>loading...</p>}
      {/* 에러 발생했을 때 */}
      {isError && <p>데이터 가져오기 실패</p>}
      {/* 정상 */}
      {!isLoading && !isError && (
        <div>
          {cartBookList?.map((item: CartBookData) => (
            <CartBook key={item.isbn} book={item} refetchCartBookList={refetchCartBookList} />
          ))}
        </div>
      )}
      {/* 책 추천 */}
      <CartBookRecommend refetchCartBookList={refetchCartBookList} />
    </section>
  );
};

export default CartBookList;
