import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import PageTitle from '../../components/PageTitle.tsx';
import { DeliveryStatus } from '../../api/item.ts';
import { getDeliveryStatusListRequest } from '../../api';
import moment from 'moment';
import Calendar from 'react-calendar';
import OrderStatusComp from '../../components/OrderStatusComp.tsx';

// function

// component
const OrderStatus = () => {
  // const { role } = useSelector((state: { user: userState }) => state.user);
  const navigate = useNavigate();
  const [cookies, _] = useCookies();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isCalOpen, setIsCalOpen] = useState<boolean>(false);
  const [orderStatusIndex, setOrderStatusIndex] = useState<number>(0);
  const [date, setDate] = useState<Date>(new Date());
  const [orderStatusItemList, setOrderStatusItemList] = useState<DeliveryStatus[] | null>(null);
  const [renderKey, setRenderKey] = useState<number>(0);

  const orderStatusList = ['전체', '배송준비중', '배송중', '배송완료'];

  useEffect(() => {
    // 토큰 검증
    if (!cookies.jwt) {
      navigate('/auth/sign-in');
    }

    getDeliveryStatusListRequest(orderStatusList[orderStatusIndex], date, cookies.jwt).then((response) => {
      setOrderStatusItemList(response);
    });
  }, [date, orderStatusIndex, renderKey]);

  return (
    <div>
      <PageTitle title={'배송상태'} />
      <main className={'px-[5%] md:px-[10%] lg:px-[15%]'}>
        {/* 필터링 */}
        <div className={'flex items-center justify-between'}>
          {/* 배송상태*/}
          <div
            className={
              'relative w-[120px] flex justify-between items-center p-[10px] border-[0.5px] border-black border-opacity-80 rounded-[5px] cursor-pointer'
            }
            onClick={() => {
              if (!isOpen) {
                setIsOpen(true);
              }
            }}
          >
            <p>{orderStatusList[orderStatusIndex]}</p>
            <i className="fi fi-rr-caret-down"></i>
            {isOpen ? (
              <div
                className={
                  'absolute w-full flex flex-col items-center bg-white left-0 top-[60px] border-[0.5px] border-black border-opacity-80 rounded-[5px]'
                }
              >
                {orderStatusList.map((item, index) => (
                  <p
                    key={item}
                    className={'w-full p-[10px] hover:bg-black hover:bg-opacity-10'}
                    onClick={() => {
                      setOrderStatusIndex(index);
                      setIsOpen(false);
                    }}
                  >
                    {item}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
          {/* 달력 */}
          <div
            className={'relative flex items-center gap-[10px] cursor-pointer'}
            onClick={() => {
              if (!isCalOpen) {
                setIsCalOpen(true);
              }
            }}
          >
            <i className="fi fi-br-calendar-day"></i>
            <p>{moment(date).format('YYYY.MM.DD')}</p>
            {isCalOpen ? (
              <Calendar
                value={date}
                formatDay={(_, date) => moment(date).format('DD')}
                onClickDay={(value, _) => {
                  setDate(value);
                  setIsCalOpen(false);
                }}
                className={'absolute right-0 top-[40px] min-w-[300px]'}
              />
            ) : null}
          </div>
        </div>
        <div>
          {orderStatusItemList ? (
            orderStatusItemList.map((item: DeliveryStatus) => (
              <OrderStatusComp key={item.orderId} item={item} renderKey={renderKey} setRenderKey={setRenderKey} />
            ))
          ) : (
            <p>주문이 존재하지 않습니다</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderStatus;
