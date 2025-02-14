// /cart
import { getCartBookListRequest } from '@/api/api';
import CartDeliveryInfo from '@/pages/common/Cart/component/CartDeliveryInfo.tsx';
import { useState } from 'react';
import { useCookies } from 'react-cookie';
import CartBookList from './component/CartBookList';

function CartFix() {
  const [cookies] = useCookies(['jwt']);
  const [deliveryRequest, setDeliveryRequest] 

  // function: 장바구니 책 가져오기
  const getCartBookList = () => {
    getCartBookListRequest(cookies.jwt).then((result) => {});
  };

  // render
  return (
    <main>
      <CartDeliveryInfo deliveryRequest={deliveryRequest} setDeliveryRequest={setDeliveryRequest} />
      <CartBookList cartBookList={cartBookList} getCartBookList={getCartBookList} />
    </main>
  );
}

export default CartFix;
