import moment from 'moment';
import { Dispatch, SetStateAction } from 'react';
import { useCookies } from 'react-cookie';
import { changeDeliveryStatusRequest } from '../api/api.ts';
import { DeliveryStatus } from '../api/item.ts';

// function
function getButtonName(name: 'READY' | 'DELIVERING' | 'DELIVERED' | string) {
  switch (name) {
    case 'READY':
      return '배송시작';
    case 'DELIVERING':
      return '배송완료';
    default:
      return null;
  }
}

function buttonShape(name: 'READY' | 'DELIVERING' | 'DELIVERED' | string) {
  switch (name) {
    case 'READY':
      return 'border-[0.5px] border-black border-opacity-80 rounded-[5px] px-[15px] py-[10px]';
    case 'DELIVERING':
      return 'bg-black bg-opacity-80 rounded-[5px] px-[15px] py-[10px] text-white';
    default:
      return '';
  }
}

function changeOrderStatusToKorean(orderStatus: string) {
  if (orderStatus === 'READY') {
    return '배송준비중';
  }
  if (orderStatus === 'DELIVERING') {
    return '배송중';
  }
  if (orderStatus === 'DELIVERED') {
    return '배송완료';
  }
}

function orderStatusColor(orderStatus: string) {
  switch (orderStatus) {
    case 'READY':
      return 'text-red-500';
    case 'DELIVERING':
      return 'text-blue-500';
    case 'DELIVERED':
      return 'text-black text-opacity-60';
  }
}

function deliveryStatusChangeButtonClickHandler(
  orderId: number,
  orderStatus: string,
  jwt: string,
  renderKey: number,
  setRenderKey: Dispatch<SetStateAction<number>>,
) {
  let changeOrderStatus = '';

  if (orderStatus === 'READY') {
    changeOrderStatus = '배송중';
  }
  if (orderStatus === 'DELIVERING') {
    changeOrderStatus = '배송완료';
  }

  changeDeliveryStatusRequest(orderId, changeOrderStatus, jwt).then((response) => {
    if (response) {
      setRenderKey(renderKey + 1);
    }
  });
}

// render
const OrderStatusComp = ({
  item,
  renderKey,
  setRenderKey,
}: {
  item: DeliveryStatus;
  renderKey: number;
  setRenderKey: Dispatch<SetStateAction<number>>;
}) => {
  const [cookies] = useCookies(['jwt']);

  return (
    <div className={'flex flex-col gap-[30px] border-b-[1px] border-black border-opacity-10 py-[30px]'}>
      {/* top */}
      <div className={'flex items-center justify-between'}>
        <p className={'font-bold'}>주문번호 {item.orderId}</p>
        <div className={'flex items-center gap-[10px] text-black text-opacity-60'}>
          <p>{item.email}</p>
          <p>{moment(item.orderDate).format('YYYY.MM.DD')}</p>
        </div>
      </div>
      {/* bottom */}
      <div className={'flex items-center justify-between'}>
        <button
          className={buttonShape(item.orderStatus)}
          onClick={() =>
            deliveryStatusChangeButtonClickHandler(item.orderId, item.orderStatus, cookies.jwt, renderKey, setRenderKey)
          }
        >
          {getButtonName(item.orderStatus) ? getButtonName(item.orderStatus) : null}
        </button>
        <p className={orderStatusColor(item.orderStatus) + ' font-bold'}>
          {changeOrderStatusToKorean(item.orderStatus)}
        </p>
      </div>
    </div>
  );
};

export default OrderStatusComp;
