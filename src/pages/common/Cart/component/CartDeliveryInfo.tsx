/* eslint-disable react-hooks/exhaustive-deps */
import { DeliveryInfoItem } from '@/api/item.ts';
import { useEffect, useState } from 'react';

const CartDeliveryInfo = () => {
  const deliveryInfoMock: DeliveryInfoItem = {
    name: '집',
    isDefault: true,
    receiver: '김소영',
    receiverPhoneNumber: '010-4053-8553',
    address: '창원시 마산회원구 봉암북3길 8',
    addressDetail: '202 호',
  };
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfoItem | null>(null);

  // effect: 로딩 시 배송지 정보 가져오기
  useEffect(() => {
    // setDeliveryInfo(null);
    setDeliveryInfo(deliveryInfoMock);
  }, []);

  return (
    <section className="w-full max-w-[600px] flex flex-col gap-6 p-4 border-[0.1rem] border-black/10 rounded-[10px]">
      {/* 배송지 정보*/}
      <div className="flex">
        <p className={'min-w-[7rem] font-bold'}>배송지 정보</p>
        {deliveryInfo ? (
          <div className={'flex-1 flex flex-col gap-[0.4rem]'}>
            {/* 배송지 */}
            <div className={'flex gap-[1rem] items-center'}>
              {/* 배송지 이름 */}
              <div className="flex items-center gap-1">
                <i className="flex justify-center fi fi-sr-marker iems-center"></i>
                <span className={'font-semibold text-base'}>{deliveryInfo.name}</span>
              </div>
              {/* 기본배송지 배지 */}
              <span className={'p-[0.3rem] border-[0.1rem] border-black rounded-full text-xs font-semibold'}>
                기본배송지
              </span>
              {/* 배송지 변경 버튼*/}
              <button className={'p-[0.4rem] border-[0.08rem] border-gray/20 rounded-lg text-xs'}>변경</button>
            </div>
            {/* 수신인 정보*/}
            <div className={'text-sm flex items-center gap-2 font-semibold'}>
              <span>{deliveryInfo.receiver}</span>
              <span>{'|'}</span>
              <span>{deliveryInfo.receiverPhoneNumber}</span>
            </div>
            {/* 주소 */}
            <div className={'text-black/60 text-sm'}>{`${deliveryInfo.address} ${deliveryInfo.addressDetail}`}</div>
          </div>
        ) : (
          <div className={'flex-1 flex items-center'}>
            <p className={'text-black/60 font-semibold'}>배송지 정보 가져오기 실패</p>
          </div>
        )}
      </div>
      {/* 배송 요청사항 */}
      <div className="flex items-center">
        <p className={'min-w-[7rem] font-bold'}>배송요청사항</p>
        {/* 배송 요청사항 인풋박스 */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="배송시 요청사항을 입력해주세요"
            className="w-full text-sm px-[0.8rem] py-[0.6rem] border-[0.08rem] border-gray/20 rounded-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default CartDeliveryInfo;
