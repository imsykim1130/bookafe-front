import { OrderDetail } from '@/api/item';
import moment from 'moment';
import { useState } from 'react';

interface Props {
  orderDetail: OrderDetail;
  orderCandelClickHandler: (orderId: number) => void;
}

function OrderDetailItem({ orderDetail, orderCandelClickHandler }: Props) {
  const { orderId, orderDatetime, orderStatus, orderBookViewsList } = orderDetail;
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // 주문 책 개수에 따라 책 제목 표시
  const bookInfoText =
    orderBookViewsList.length > 1
      ? `${orderBookViewsList[0].title} 외 ${orderBookViewsList.length - 1}건`
      : orderBookViewsList[0].title;

  // 총 주문 금액 계산
  const totalPrice = orderBookViewsList.reduce((sum, book) => sum + book.price, 0);

  return (
    <article className="flex flex-col gap-[30px] py-[30px] bg-white border-b-[1px] border-black border-opacity-10">
      <div>
        {/* top */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-3">
            <span className="font-semibold">주문번호 {orderId}</span>
            <span className="text-black text-opacity-60">{moment(orderDatetime).format('YYYY-MM-DD HH:mm:ss')}</span>
          </div>
          <button onClick={() => setIsDetailOpen(!isDetailOpen)}>
            {isDetailOpen ? '간략히보기' : '자세히보기'} {'>'}
          </button>
        </div>

        {/* middle */}
        <div className="flex flex-col gap-2.5">
          {isDetailOpen ? (
            <div className="flex flex-col gap-2.5">
              {orderBookViewsList.map((book) => (
                <div key={book.title} className="flex justify-between">
                  <div className="flex-1">{book.title}</div>
                  <div className="flex gap-[10px]">
                    <span>{book.price.toLocaleString()} 원</span>
                    <span>{book.count}권</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            bookInfoText
          )}
        </div>
      </div>

      {/* bottom */}
      <div className="w-full flex justify-between items-center">
        <button
          className="px-4 py-2 border border-gray-300 rounded-[10px] bg-white hover:bg-gray-50 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={orderStatus !== '배송준비중'}
          onClick={() => orderCandelClickHandler(orderId)}
        >
          취소하기
        </button>
        <div className="flex justify-end">
          {/* 총 주문 금액 */}
          {/* 금액 표시 부분에 toLocaleString()을 사용하여 천 단위 구분자(쉼표)를 추가하여 가독성 향상 */}
          <div className="font-bold text-base">총 {totalPrice.toLocaleString()} 원</div>
        </div>
      </div>
    </article>
  );
}

export default OrderDetailItem;
