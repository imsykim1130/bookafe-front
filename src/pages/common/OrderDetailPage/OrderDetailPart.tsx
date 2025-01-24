import { OrderDetail } from '../../../api/item.ts';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { cancelOrderRequest } from '../../../api';

const OrderDetailPart = ({
  orderDetail,
  getOrderDetailList,
}: {
  orderDetail: OrderDetail;
  getOrderDetailList: () => void;
}) => {
  const [more, setMore] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [cookies] = useCookies(['jwt']);

  const calculateTotalPrice = () => {
    let price = 0;
    orderDetail.orderBookViewsList.forEach((item) => {
      price += item.price;
    });
    setTotalPrice(price);
  };

  useEffect(() => {
    calculateTotalPrice();
  }, []);

  const onDetailBtnClickHandler = () => {
    setMore(!more);
  };

  const cancelOrderBtnClickHandler = () => {
    cancelOrderRequest(cookies.jwt, orderDetail.orderId).then((isSuccess) => {
      if (isSuccess) {
        getOrderDetailList();
      } else {
        window.alert('주문 삭제 실패! 다시 시도해주세요');
      }
    });
  };

  return (
    <article
      className={'flex flex-col gap-[15px] text-md bg-white py-[30px] border-b-[1px] border-black border-opacity-40'}
    >
      <div className={'flex items-center justify-between font-bold'}>
        <div className={'flex items-center gap-[5px]'}>
          <p>주문번호 {orderDetail.orderId}</p>
          <p>{orderDetail.orderStatus}</p>
        </div>
        <button onClick={onDetailBtnClickHandler}>{more ? '간략히 보기' : '자세히 보기'}</button>
      </div>
      <div>
        {more ? (
          <div className={'flex flex-col gap-[10px]'}>
            {orderDetail.orderBookViewsList.map((bookView) => (
              <div key={bookView.title} className={'flex justify-between'}>
                <div>
                  <p>{bookView.title}</p>
                </div>
                <div className={'flex gap-[10px] items-center'}>
                  <p>총 {bookView.count} 권</p>
                  <div className={'w-[1px] h-[15px] bg-black bg-opacity-80'}></div>
                  <p>{bookView.price} 원</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div>
            {orderDetail.orderBookViewsList[0].title} 외 {orderDetail.orderBookViewsList.length - 1} 개
          </div>
        )}
      </div>
      <div className={'w-full h-[1px] bg-black bg-opacity-10 mt-[10px]'}></div>
      {/* 가격 */}
      <div className={'flex justify-between items-center'}>
        {orderDetail.orderStatus === '배송준비중' ? (
          <button
            className={
              'border-[0.5px] border-black border-opacity-80 rounded-[5px] px-[8px] py-[5px]  duration-300 hover:bg-black hover:bg-opacity-5'
            }
            onClick={cancelOrderBtnClickHandler}
          >
            취소하기
          </button>
        ) : (
          <div className={'flex-1'}></div>
        )}
        <p className={'font-bold'}>총 {totalPrice} 원</p>
      </div>
    </article>
  );
};

export default OrderDetailPart;
