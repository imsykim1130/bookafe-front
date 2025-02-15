// /cart
import CartDeliveryInfo from '@/pages/common/Cart/component/CartDeliveryInfo.tsx';
import { useState } from 'react';
import CartBookList from './component/CartBookList';
import CartCouponList from './component/CartCouponList';

function CartFix() {
  const [deliveryRequest, setDeliveryRequest] = useState<string>('');
  const [usingCouponId, setUsingCouponId] = useState<number | null>(null);

  // function: 사용 쿠폰 아이디 변경
  const changeUsingCouponId = (couponId: number) => {
    if(usingCouponId === couponId) {
      setUsingCouponId(null);
      return;
    }
    setUsingCouponId(couponId);
  };

  // render
  return (
    <main>
      <CartDeliveryInfo deliveryRequest={deliveryRequest} setDeliveryRequest={setDeliveryRequest} />
      <CartBookList />
      <CartCouponList usingCouponId={usingCouponId} changeUsingCouponId={changeUsingCouponId} />
    </main>
  );
}

export default CartFix;
