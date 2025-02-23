import { DeliveryInfoItem } from '@/api/item.ts';
import { deliveryInfoKey, useAllDeliveryInfoQuery } from '@/api/query.ts';
import { Button } from '@/components/ui/button.tsx';
import AddDeliveryInfoModal from '@/pages/common/Cart/component/AddDeliveryInfoModal.tsx';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

import { DOMAIN } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface Props {
  setDeliveryInfoListPopup: React.Dispatch<React.SetStateAction<boolean>>;
  selectedDeliveryInfo: DeliveryInfoItem | null;
  changeDeliveryInfo: (deliveryInfo: DeliveryInfoItem | null) => void;
}
const ChangeDeliveryInfoModal = ({ setDeliveryInfoListPopup, selectedDeliveryInfo, changeDeliveryInfo }: Props) => {
  const [cookies] = useCookies(['jwt']);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [addDeliveryInfoModal, setAddDeliveryInfoModal] = useState<boolean>(false);

  // state: 변경할 배송지
  const [selectDeliveryInfo, setSelectDeliveryInfo] = useState<DeliveryInfoItem | null>(null);

  // query: 배송지 리스트
  const {
    isLoading,
    isError,
    data: deliveryInfoList
  } = useAllDeliveryInfoQuery(cookies.jwt);

  // mutation: 배송지 삭제
  const { mutate } = useMutation({
    mutationFn: async (deliveryInfoId: number) => {
      return await axios
        .delete(DOMAIN + '/user/delivery-info/' + deliveryInfoId, {
          headers: {
            Authorization: `Bearer ${cookies.jwt}`,
          },
        })
        .then(() => {
          window.alert('배송지 삭제 성공');
          if (deliveryInfoId === selectedDeliveryInfo?.id) {
            changeDeliveryInfo(null);
          }
          queryClient.invalidateQueries({
            queryKey: deliveryInfoKey,
          });
        });
    },
  });

  // function: 닫기 버튼 클릭
  const closeBtnClickHandler = () => {
    setDeliveryInfoListPopup(false);
  };

  // function: 배송지 선택 링 클릭
  const deliveryInfoClickHandler = (deliveryInfo: DeliveryInfoItem) => {
    // 이미 선택된 배송지를 클릭하면 아무것도 일어나지 않음
    if (selectDeliveryInfo?.id === deliveryInfo.id) return;
    setSelectDeliveryInfo(deliveryInfo);
  };

  // function: 배송지 선택 버튼 클릭
  const selectBtnClickHandler = () => {
    if (!selectDeliveryInfo) return;
    changeDeliveryInfo(selectDeliveryInfo);
    setDeliveryInfoListPopup(false);
  };

  // function: 배송지 추가하기 모달창 열기/닫기 토글
  const changeAddDeliveryInfoModalStatus = () => {
    setAddDeliveryInfoModal(!addDeliveryInfoModal);
  };

  // function 배송지 삭제 버튼 클릭
  const deleteDeliveryInfoBtnClick = (deliveryInfoId: number) => {
    mutate(deliveryInfoId);
  };

  // effect: 첫 마운트
  useEffect(() => {
    if (!cookies.jwt) {
      navigate('/auth/sign-in');
    }
    // 모달창 열림 시 스크롤 방지
    window.document.body.style.overflowY = 'hidden';
  
    // 모달을 열기 전 선택된 배송지 정보 반영
    setSelectDeliveryInfo(selectedDeliveryInfo);

    return () => {
      window.document.body.style.overflowY = 'auto';
    };
  }, []);

  return (
    <>
      {/* 배경 어둡게 */}
      <div className={'z-10 absolute top-0 left-0 right-0 h-[200vh] bg-black/20'}></div>
      {/* 배송지 변경 모달 */}
      <div
        className={`z-20 min-w-[20rem] max-h-[60vh] overflow-y-scroll absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-[2rem] rounded-[0.6rem] ${addDeliveryInfoModal ? 'opacity-0' : 'opacity-100'}`}
      >
        {/* 모달 타이틀 */}
        <div className={'flex items-center justify-between pb-[1rem]'}>
          <p className={'font-semibold'}>배송지 변경</p>
          <i
            className="flex items-center justify-center cursor-pointer fi fi-br-cross-small"
            onClick={closeBtnClickHandler}
          ></i>
        </div>
        {/* 모달 본문 */}
        <div className={'text-sm'}>
          {/* 로딩중 */}
          {isLoading && <p>로딩중...</p>}
          {/* 에러 */}
          {isError && <p>데이터를 가져오는데 실패했습니다</p>}
          {/* 정상 */}
          {!isLoading && !isError && (
            <div className={'flex flex-col gap-[2rem]'}>
              {/* 배송지 추가 버튼*/}
              <div>
                <Button variant={'outline'} className={'w-full'} onClick={changeAddDeliveryInfoModalStatus}>
                  + 배송지 추가하기
                </Button>
              </div>
              {/* 배송지 리스트 */}
              <div className={'flex flex-col gap-[2rem]'}>
                {deliveryInfoList?.length === 0 && <p className={'text-xs text-black/60'}>등록된 배송지가 없습니다</p>}
                {deliveryInfoList?.map((item) => (
                  <div key={item.id} className={'flex gap-[0.5rem]'}>
                    {/* 배송지 선택 버튼*/}
                    <button
                      className={
                        'mt-[0.4rem] flex justify-center items-center w-[1.2rem] h-[1.2rem] rounded-full border-[0.1rem] border-black/20'
                      }
                      onClick={() => {
                        deliveryInfoClickHandler(item);
                      }}
                    >
                      {
                        <span
                          className={`w-[0.7rem] h-[0.7rem] rounded-full bg-black ${selectDeliveryInfo?.id === item.id ? 'opacity-100' : 'opacity-0'}`}
                        ></span>
                      }
                    </button>
                    {/* 배송지 */}
                    <div key={item.id} className={`flex-1 flex flex-col gap-[0.4rem]`}>
                      <div className={'relative flex gap-[1rem] items-center'}>
                        {/* 배송지 이름 */}
                        <div className="flex items-center gap-1">
                          <i className="flex justify-center fi fi-sr-marker iems-center"></i>
                          <span className={'font-semibold text-base'}>{item.name}</span>
                        </div>
                        {/* 기본배송지 배지 */}
                        {item.isDefault && (
                          <span
                            className={'p-[0.3rem] border-[0.1rem] border-black rounded-full text-xs font-semibold'}
                          >
                            기본배송지
                          </span>
                        )}
                        {/* 삭제 버튼 */}
                        <i
                          className="cursor-pointer absolute z-20 top-0 right-0 fi fi-rr-trash flex items-center justify-center text-white bg-black/100 rounded-full p-[0.4rem]"
                          onClick={() => {
                            deleteDeliveryInfoBtnClick(item.id);
                          }}
                        ></i>
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
                  </div>
                ))}
              </div>
              <Button className={'w-full'} onClick={selectBtnClickHandler}>
                선택
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* 배송지 추가 모달 */}
      {addDeliveryInfoModal && (
        <AddDeliveryInfoModal changeAddDeliveryInfoModalStatus={changeAddDeliveryInfoModalStatus} />
      )}
    </>
  );
};

export default ChangeDeliveryInfoModal;
