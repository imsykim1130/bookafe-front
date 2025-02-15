// /cart
import CartDeliveryInfo from '@/pages/common/Cart/component/CartDeliveryInfo.tsx';
import { useState } from 'react';
import CartBookList from './component/CartBookList';

function CartFix() {
  const [deliveryRequest, setDeliveryRequest] = useState<string>('');

  // render
  return (
    <main>
      <CartDeliveryInfo deliveryRequest={deliveryRequest} setDeliveryRequest={setDeliveryRequest} />
      <CartBookList/>
    </main>
  );
}

export default CartFix;
