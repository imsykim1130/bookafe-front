import { useEffect, useState } from 'react';
import { OrderDetail } from '../../../api/item.ts';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { getOrderDetailListRequest } from '../../../api';
import OrderDetailPart from './OrderDetailPart.tsx';
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';

const OrderDetailPage = () => {
  const [orderDetailList, setOrderDetailList] = useState<OrderDetail[] | null>(null);
  const [cookie] = useCookies(['jwt']);
  const navigate = useNavigate();
  const orderCount = orderDetailList ? orderDetailList.length : 0;

  const now = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 3);

  const [startDate, setStartDate] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });

  const [endDate, setEndDate] = useState<DateValueType>({
    startDate: null,
    endDate: null,
  });

  // 주문 상세 내역 가져오기 요청
  const getOrderDetailList = () => {
    if (!startDate || !endDate || !startDate.startDate || !endDate.endDate) {
      return;
    }
    getOrderDetailListRequest(cookie.jwt, startDate.startDate, endDate?.endDate).then((result) => {
      setOrderDetailList(result);
    });
  };

  // 초기 렌더링
  useEffect(() => {
    // 로그인 시간 만료시 로그인 화면으로 이동
    if (!cookie.jwt) {
      navigate('/auth/sign-in');
      return;
    }

    // 날짜 초기화
    setStartDate({
      startDate: start,
      endDate: start,
    });

    setEndDate({
      startDate: now,
      endDate: now,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="px-[5%] md:px-[10%] lg:px-[15%] flex justify-center">
      <main className="w-full max-w-[700px]">
        {/* 총 주문 개수 & 날짜 필터*/}
        <section className={'w-full flex flex-col items-start md:flex-row md:justify-between gap-y-[20px] py-[30px]'}>
          {/* 총 개수*/}
          <h2 className={'font-bold text-[16px]'}>총 {orderCount} 개</h2>
          <div className={'flex justify-end items-center gap-[10px]'}>
            {/* 캘린더 아이콘 */}
            <i className="fi fi-br-calendar-day translate-y-[2px]"></i>
            {/* 시작 날짜 */}
            <Datepicker
              asSingle={true}
              value={startDate}
              onChange={(newDate) => {
                if (!newDate || !newDate.startDate) return;
                setStartDate(newDate);
              }}
              displayFormat={'YYYY년 MM월 DD일'}
              readOnly={true}
              useRange={false}
              containerClassName={'relative'}
              inputClassName={'bg-white w-[110px] text-center text-[14px] cursor-pointer'}
              toggleClassName={'hidden'}
            />
            <span>-</span>
            {/* 끝 날짜 */}
            <Datepicker
              asSingle={true}
              value={endDate}
              onChange={(newDate) => {
                if (!newDate || !newDate.startDate) return;

                setEndDate(newDate);
              }}
              displayFormat={'YYYY년 MM월 DD일'}
              readOnly={true}
              useRange={false}
              containerClassName={'relative'}
              inputClassName={'bg-white w-[110px] text-center text-[14px] cursor-pointer'}
              toggleClassName={'hidden'}
            />
          </div>
        </section>
        {/* 주문 리스트 */}
        <section>
          <div className={'flex flex-col gap-[15px]'}>
            {orderDetailList?.length ? (
              orderDetailList.map((item) => (
                <OrderDetailPart key={item.orderId} orderDetail={item} getOrderDetailList={getOrderDetailList} />
              ))
            ) : (
              <p>주문 내역이 없습니다 🥲</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default OrderDetailPage;
