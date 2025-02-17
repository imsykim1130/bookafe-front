import { useEffect, useReducer } from 'react';
import deliveryInfoListReducer from '@/pages/common/Cart/reducer/deliveryInfoListReducer.ts';
import { getAllDeliveryInfoRequest } from '@/api/api.ts';
import { useCookies } from 'react-cookie';
import { DeliveryInfoItem } from '@/api/item.ts';

interface Props {
  setDeliveryInfoListPopup: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDeliveryInfoId: number | null;
  changeDeliveryInfo: (deliveryInfo: DeliveryInfoItem) => void;
}
const DeliveryInfoList = ({ setDeliveryInfoListPopup, selectedDeliveryInfoId, changeDeliveryInfo }: Props) => {
  const [cookies] = useCookies(['jwt']);
  const [deliveryInfoList, deliveryInfoListDispatcher] = useReducer(deliveryInfoListReducer, {
    loading: false,
    error: false,
    data: [],
  });

  // function: 닫기 버튼 클릭
  const closeBtnClickHandler = () => {
    setDeliveryInfoListPopup(false);
  };

  // function: 배송 정보 리스트 가져오기
  const getAllDeliveryInfo = () => {
    deliveryInfoListDispatcher({ type: 'loading' });
    getAllDeliveryInfoRequest(cookies.jwt).then((result) => {
      if (!result) {
        // 실패
        deliveryInfoListDispatcher({ type: 'error' });
        return;
      }
      // 성공
      deliveryInfoListDispatcher({ type: 'success', payload: result });
    });
  };

  // function: 배송지 클릭
  const deliveryInfoClickHandler = (deliveryInfo: DeliveryInfoItem) => {
    changeDeliveryInfo(deliveryInfo);
    // 배송지 변경하고 모달 닫기
    setDeliveryInfoListPopup(false);
  };

  // effect: 첫 마운트
  useEffect(() => {
    // 모달창 열림 시 스크롤 방지
    window.document.body.style.overflowY = 'hidden';
    // 데이터 가져오기
    getAllDeliveryInfo();

    return () => {
      window.document.body.style.overflowY = 'auto';
    };
  }, []);

  return (
    <>
      {/* 배경 어둡게 */}
      <div className={'z-10 absolute top-0 left-0 right-0 h-[200vh] bg-black/20'}></div>
      {/* 모달 */}
      <div
        className={
          'z-20 min-w-[20rem] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-[2rem] rounded-[0.6rem]'
        }
      >
        <div className={'flex items-center justify-between pb-[1rem]'}>
          <p className={'font-semibold'}>배송지 변경</p>
          <i
            className="fi fi-br-cross-small flex items-center justify-center cursor-pointer"
            onClick={closeBtnClickHandler}
          ></i>
        </div>
        <div className={'text-sm'}>
          {/* 로딩중 */}
          {deliveryInfoList.loading && <p>로딩중...</p>}
          {/* 에러 */}
          {deliveryInfoList.error && <p>데이터를 가져오는데 실패했습니다</p>}
          {/* 정상 */}
          {!deliveryInfoList.loading && !deliveryInfoList.error && (
            <div className={'flex flex-col gap-[0.5rem]'}>
              {/* 배송지 리스트 */}
              {deliveryInfoList.data.map((item) => (
                // 배송지
                <div
                  key={item.id}
                  className={`cursor-pointer flex-1 flex flex-col gap-[0.4rem] p-[0.8rem] rounded-[0.6rem] hover:bg-black/5 ${selectedDeliveryInfoId === item.id ? 'border-[0.1rem] bg-black/5 border-black/40' : ''}`}
                  onClick={() => {
                    deliveryInfoClickHandler(item);
                  }}
                >
                  <div className={'flex gap-[1rem] items-center'}>
                    {/* 배송지 이름 */}
                    <div className="flex items-center gap-1">
                      <i className="flex justify-center fi fi-sr-marker iems-center"></i>
                      <span className={'font-semibold text-base'}>{item.name}</span>
                    </div>
                    {/* 기본배송지 배지 */}
                    {item.isDefault && (
                      <span className={'p-[0.3rem] border-[0.1rem] border-black rounded-full text-xs font-semibold'}>
                        기본배송지
                      </span>
                    )}
                  </div>
                  {/* 수신인 정보*/}
                  <div className={'text-sm flex items-center gap-2 font-semibold'}>
                    <span>{item.receiver}</span>
                    <span>{'|'}</span>
                    <span>{item.receiverPhoneNumber}</span>
                  </div>
                  {/* 주소 */}
                  <div className={'text-black/60 text-sm'}>{`${item.address} ${item.addressDetail}`}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DeliveryInfoList;
