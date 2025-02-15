/* eslint-disable react-hooks/exhaustive-deps */
import { getDeliveryInfoRequest } from '@/api/api';
import { DeliveryInfoItem } from '@/api/item.ts';
import { GetDeliveryInfoResponseDto, ResponseDto } from '@/api/response.dto';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

interface Props {
  deliveryRequest: string;
  setDeliveryRequest: React.Dispatch<React.SetStateAction<string>>;
}

const CartDeliveryInfo = (props: Props) => {
  const { deliveryRequest, setDeliveryRequest } = props;
  // const deliveryInfoMock: DeliveryInfoItem = {
  //   name: '집',
  //   isDefault: true,
  //   receiver: '김소영',
  //   receiverPhoneNumber: '010-4053-8553',
  //   address: '창원시 마산회원구 봉암북3길 8',
  //   addressDetail: '202 호',
  // };

  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfoItem | null>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [cookies] = useCookies(['jwt']);

  // function: 배송정보 가져오기 요청
  const getDeliveryInfo = () => {
    setError(false);
    getDeliveryInfoRequest(cookies.jwt)
      .then((response) => {
        const { userDeliveryInfo } = response.data as GetDeliveryInfoResponseDto;
        setDeliveryInfo(userDeliveryInfo);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        const { message } = err.response.data as ResponseDto;
        console.log(message);
      });
  };

  // effect: 로딩 시 배송지 정보 가져오기
  useEffect(() => {
    getDeliveryInfo();
  }, []);

  return (
    <section className="w-full max-w-[600px] flex flex-col gap-6 p-4 border-[0.1rem] border-black/10 rounded-[0.6rem]">
      {/* 배송지 정보*/}
      <div className="flex">
        <p className={'min-w-[7rem] font-bold'}>배송지 정보</p>
        {/* 데이터 로딩중 */}
        {loading ? (
          <div className="flex-1">
            <p className="text-sm text-black/40">로딩중...</p>
          </div>
        ) : null}
        {/* 데이터 가져오기 성공 */}
        {!loading && deliveryInfo ? (
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
        ) : null}
        {/* 설정된 기본 배송지가 없을 때 */}
        {!loading && deliveryInfo === null ? (
          <div className={'flex-1'}>
            <button className="p-[0.5rem] border-[0.08rem] border-black/20 rounded-[0.4rem] text-sm">
              배송지 추가하기
            </button>
          </div>
        ) : null}
        {/* 데이터 가져오기 실패 */}
        {!loading && error ? (
          <div className={'flex-1 flex items-center'}>
            <p className={'text-black/60 text-xs'}>배송지 정보 가져오기 실패</p>
          </div>
        ) : null}
      </div>
      {/* 배송 요청사항 */}
      <div className="flex items-center">
        <p className={'min-w-[7rem] font-bold'}>배송요청사항</p>
        {/* 배송 요청사항 인풋박스 */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="배송시 요청사항을 입력해주세요"
            value={deliveryRequest}
            onChange={(e) => setDeliveryRequest(e.target.value)}
            className="w-full text-sm px-[0.8rem] py-[0.6rem] border-[0.08rem] border-gray/20 rounded-lg"
          />
        </div>
      </div>
    </section>
  );
};

export default CartDeliveryInfo;
