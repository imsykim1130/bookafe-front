// /cart
import CartDeliveryInfo from '@/pages/common/Cart/component/CartDeliveryInfo.tsx';
import { useState } from 'react';
import CartBookList from './component/CartBookList';
import CartCouponList from './component/CartCouponList';
import CartPointComp from '@/pages/common/Cart/component/CartPointComp.tsx';

function CartFix() {
  const [deliveryRequest, setDeliveryRequest] = useState<string>('');
  const [usingCouponId, setUsingCouponId] = useState<number | null>(null);
  const [usingPoint, setUsingPoint] = useState<number>(0);

  // function: 사용 쿠폰 아이디 변경
  const changeUsingCouponId = (couponId: number) => {
    if (usingCouponId === couponId) {
      setUsingCouponId(null);
      return;
    }
    setUsingCouponId(couponId);
  };

  // function: 사용 포인트 변경
  const changeUsingPoint = (point: number) => {
    setUsingPoint(point);
  };

  // render
  return (
    <main className={'flex flex-col gap-5'}>
      <CartDeliveryInfo deliveryRequest={deliveryRequest} setDeliveryRequest={setDeliveryRequest} />
      <CartBookList />
      <CartCouponList usingCouponId={usingCouponId} changeUsingCouponId={changeUsingCouponId} />
      <CartPointComp point={usingPoint} changeUsingPoint={changeUsingPoint} />
    </main>
  );
}

export default CartFix;
