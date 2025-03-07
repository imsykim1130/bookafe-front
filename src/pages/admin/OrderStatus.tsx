/* eslint-disable react-hooks/exhaustive-deps */
import { GetDeliveryStatusListResponseDto } from '@/api/response.dto.ts';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { getDeliveryStatusListRequest } from '../../api/common.api.ts';
import { DeliveryStatus } from '../../api/item.ts';
import DateInput from '../../components/DateInput';
import OrderStatusComp from '../../components/OrderStatusComp.tsx';
import Dropdown from '../common/OrderDetailPage/component/Dropdown.tsx';

// component
const OrderStatus = () => {
  const navigate = useNavigate();
  const [cookies] = useCookies(['jwt']);

  const now = new Date();

  const [date, setDate] = useState<Date>(now);
  const [orderStatusItemList, setOrderStatusItemList] = useState<DeliveryStatus[] | null>(null);
  const [renderKey, setRenderKey] = useState<number>(0);

  const [page, setPage] = useState<number>(0);
  const [isFirst, setIsFirst] = useState<boolean>(false);
  const [isLast, setIsLast] = useState<boolean>(false);

  const [orderStatus, setOrderStatus] = useState<string>('전체');
  const orderStatusList = ['전체', '배송준비중', '배송중', '배송완료'];

  const getDeliveryStatusList = () => {
    getDeliveryStatusListRequest(orderStatus, date, cookies.jwt, page).then((response) => {
      const { isFirst, isLast, deliveryStatusViewList } = response as GetDeliveryStatusListResponseDto;
      setOrderStatusItemList(deliveryStatusViewList);
      setIsFirst(isFirst);
      setIsLast(isLast);
    });
  };

  useEffect(() => {
    // 토큰 검증
    if (!cookies.jwt) {
      navigate('/auth/sign-in');
    }
    getDeliveryStatusList();
  }, [date, page, orderStatus, renderKey]);

  /**
   * 필터링
   * 1. 배송상태
   * 2. 달력
   * 배송상태
   * 1. 배송상태 리스트
   * 2. 페이지네이션
   */

  return (
    <main className={'px-[5%] flex flex-col items-center py-[2rem]'}>
      <div className={'w-full max-w-[600px]'}>
        {/* 필터링 */}
        <div className={'flex items-center justify-between'}>
          {/* 배송상태*/}
          <Dropdown
            changeSelected={(value) => {
              setOrderStatus(value);
            }}
            options={orderStatusList}
          />
          {/* 달력 */}
          <DateInput date={date} setDate={setDate} />
        </div>

        {/* 배송상태 */}
        <div>
          {/* 배송상태 리스트 */}
          <div>
            {orderStatusItemList ? (
              orderStatusItemList.map((item: DeliveryStatus) => (
                <OrderStatusComp key={item.orderId} item={item} renderKey={renderKey} setRenderKey={setRenderKey} />
              ))
            ) : (
              <p className="text-[1.5rem] font-semibold py-[2rem]">주문이 존재하지 않습니다</p>
            )}
          </div>
          {/* 페이지네이션 */}
          {orderStatusItemList && orderStatusItemList.length ? (
            <div className="flex items-center justify-center gap-[2rem] py-[2rem]">
              {!isFirst ? <button onClick={() => setPage(page - 1)}>이전</button> : null}
              <span className="font-semibold">{page + 1}</span>
              {!isLast ? <button onClick={() => setPage(page + 1)}>다음</button> : null}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
};

export default OrderStatus;
