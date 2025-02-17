import { Button } from '@/components/ui/button.tsx';

interface Props {
  price: number;
  couponDiscountedPrice: number;
  usingPoint: number;
  totalPrice: number;
  putOrder: () => void;
  isOrderable: boolean;
}

const earnPointPercent = 10;

const CartTotalPriceComp = ({ price, couponDiscountedPrice, usingPoint, totalPrice, putOrder, isOrderable }: Props) => {
  const earnPoint = couponDiscountedPrice === 0 && usingPoint === 0 ? (totalPrice * earnPointPercent) / 100 : 0;

  return (
    <section className={'flex flex-col gap-[0.2rem] cart-section text-sm font-semibold'}>
      {/* 책 금액 합계*/}
      <div className={'flex justify-between items-center'}>
        <span>금액</span>
        <span>{price} 원</span>
      </div>
      <div className={'flex justify-between items-center'}>
        <span>포인트 할인</span>
        <span>- {usingPoint === 0 ? '' : `${usingPoint} P`}</span>
      </div>
      <div className={'flex justify-between items-center'}>
        <span>쿠폰 할인</span>
        <span>- {couponDiscountedPrice === 0 ? '' : `${couponDiscountedPrice} 원`}</span>
      </div>
      <span className={'w-full border-b-[0.1rem] border-black/10'}></span>
      <div className={'flex justify-between items-center'}>
        <span>총 결제금액</span>
        <span>{totalPrice} 원</span>
      </div>
      <div className={'flex justify-between items-center font-normal text-black/60 text-xs mb-2'}>
        <span>적립 예정 포인트</span>
        <span>+ {earnPoint} P</span>
      </div>
      <Button disabled={!isOrderable} className={'py-6'} onClick={putOrder}>
        주문하기
      </Button>
    </section>
  );
};

export default CartTotalPriceComp;
