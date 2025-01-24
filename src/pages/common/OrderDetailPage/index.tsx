import { useEffect, useState } from 'react';
import { OrderDetail } from '../../../api/item.ts';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { getOrderDetailListRequest } from '../../../api';
import OrderDetailItem from './component/OrderDetailItem.tsx';

const OrderDetailPage = () => {
  const [orderDetailList, setOrderDetailList] = useState<OrderDetail[] | null>(null);
  const [cookie] = useCookies(['jwt']);
  const navigate = useNavigate();

  const now = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 3);

  const [startDate, setStartDate] = useState<Date>(start);

  const [endDate, setEndDate] = useState<Date>(now);

  // 주문 상세 내역 가져오기 요청
  const getOrderDetailList = () => {
    getOrderDetailListRequest(cookie.jwt, startDate, endDate).then((result) => {
      setOrderDetailList(result);
    });
  };

  // 초기 렌더링
  // 날짜 변경 시 주문 내역 받아오기
  useEffect(() => {
    // 로그인 시간 만료시 로그인 화면으로 이동
    if (!cookie.jwt) {
      navigate('/auth/sign-in');
      return;
    }
    // 주문 내역 받아오기
    getOrderDetailList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  return (
    <main className="flex justify-center px-[5%] py-[40px]">
      <div className="w-full max-w-[600px] flex flex-col gap-[30px]">
        <div className="flex flex-col gap-[10px]">
          {/* 날짜 필터*/}
          <div className="flex items-center justify-end">
            {/* 캘린더 아이콘 */}
            <i className="fi fi-br-calendar-day translate-y-[px] opacity-60"></i>
            {/* 시작 날짜 */}
            <div className="flex items-center gap-[10px] ml-[10px]">
              <input
                type="date"
                value={startDate.toISOString().split('T')[0]}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-[10px]"
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setStartDate(date);
                }}
              />
              <span className="text-gray-400">~</span>
              <input
                type="date"
                value={endDate.toISOString().split('T')[0]}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-[10px]"
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setEndDate(date);
                }}
              />
            </div>
          </div>
          {/* 주문 리스트 */}
          {orderDetailList &&
            orderDetailList.map((orderDetail: OrderDetail) => (
              <OrderDetailItem key={orderDetail.orderId} orderDetail={orderDetail} />
            ))}
        </div>
      </div>
    </main>
  );
};

export default OrderDetailPage;
