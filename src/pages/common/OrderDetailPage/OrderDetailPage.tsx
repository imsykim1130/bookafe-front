import { useEffect, useState } from 'react';
import { OrderDetail } from '../../../api/item.ts';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { cancelOrderRequest, getOrderDetailListRequest } from '../../../api/index.ts';
import OrderDetailItem from './component/OrderDetailItem.tsx';
import Dropdown from './component/Dropdown.tsx';

// path: /order/detail
const OrderDetailPage = () => {
  const [orderDetailList, setOrderDetailList] = useState<OrderDetail[] | null>(null);
  const [cookie] = useCookies(['jwt']);
  const navigate = useNavigate();

  const [page, setPage] = useState<number>(0);
  const [isFirst, setIsFirst] = useState<boolean>(false);
  const [isLast, setIsLast] = useState<boolean>(false);

  const now = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 3);

  const [startDate, setStartDate] = useState<Date>(start);
  const [endDate, setEndDate] = useState<Date>(now);

  const [selectedStatus, setSelectedStatus] = useState<string>('전체');

  // 주문 상세 내역 가져오기 요청
  const getOrderDetailList = () => {
    getOrderDetailListRequest(cookie.jwt, startDate, endDate, selectedStatus, page).then((result) => {
      // 요청 실패 시 종료
      if (!result) {
        console.log('실패');
        return;
      }

      // 요청 성공 시 처리
      const { isStart, isEnd, orderDetailList } = result;
      // 첫 페이지 여부 설정
      setIsFirst(isStart);
      // 마지막 페이지 여부 설정
      setIsLast(isEnd);
      // 주문 내역 설정
      setOrderDetailList(orderDetailList);
    });
  };

  // 이전 페이지로 변경
  const prevPageClickHandler = () => {
    if (page === 0) return;
    setPage(page - 1);
  };

  // 다음 페이지로 변경
  const nextPageClickHandler = () => {
    if (isLast) return;
    setPage(page + 1);
  };

  // 주문 상태 변경
  const changeSelectedStatus = (value: string) => {
    setSelectedStatus(value);
  };

  // 주문 취소 버튼 클릭 시 처리
  const cancelOrderClickHandler = (orderId: number) => {
    cancelOrderRequest(cookie.jwt, orderId).then((result) => {
      if (!result) return;
      getOrderDetailList();
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
  }, [startDate, endDate, selectedStatus, page]);

  return (
    <main className="flex justify-center px-[5%] py-[40px]">
      <div className="w-full max-w-[600px] flex flex-col gap-[30px]">
        <div className="sticky top-[100px] flex items-center justify-between bg-white">
          {/* 주문 상태 선택 */}
          <Dropdown changeSelected={changeSelectedStatus} options={['전체', '배송준비중', '배송중', '배송완료']} />
          {/* 날짜 필터*/}
          <div className="flex items-center justify-end">
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
              {/* 끝 날짜 */}
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
        </div>
        <div className="flex flex-col gap-[10px]">
          {/* 주문 리스트 */}
          {orderDetailList &&
            orderDetailList.map((orderDetail: OrderDetail) => (
              <OrderDetailItem
                key={orderDetail.orderId}
                orderDetail={orderDetail}
                orderCandelClickHandler={cancelOrderClickHandler}
              />
            ))}
        </div>
        {/* 페이지 버튼 */}
        <div className="flex items-center justify-center gap-[20px]">
          {!isFirst && (
            <button onClick={prevPageClickHandler}>
              <i className="flex items-center justify-center fi fi-rr-angle-circle-left"></i>
            </button>
          )}
          <span className="font-semibold">{page + 1}</span>
          {!isLast && (
            <button onClick={nextPageClickHandler}>
              <i className="flex items-center justify-center fi fi-rr-angle-circle-right"></i>
            </button>
          )}
        </div>
      </div>
    </main>
  );
};

export default OrderDetailPage;
