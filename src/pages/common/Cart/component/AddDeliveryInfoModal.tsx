import { allDeliveryInfoKey } from '@/api/query.ts';
import { PostDeliveryInfoRequestDto } from '@/api/request.dto.ts';
import { Button } from '@/components/ui/button.tsx';
import { DOMAIN } from '@/utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useState } from 'react';
import { useCookies } from 'react-cookie';

interface Props {
  changeAddDeliveryInfoModalStatus: () => void;
}

const AddDeliveryInfoModal = ({ changeAddDeliveryInfoModalStatus }: Props) => {
  const [cookies] = useCookies(['jwt']);
  const [name, setName] = useState<string>('');
  const [receiver, setReceiver] = useState<string>('');
  const [receiverPhoneNumber, setReceiverPhoneNumber] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [addressDetail, setAddressDetail] = useState<string | null>(null);
  const [isDefault, setIsDefault] = useState<boolean>(false);
  const queryClient = useQueryClient();

  // mutation: 배송지 추가
  const addDeliveryInfoMutation = useMutation({
    mutationFn: async (requestDto: PostDeliveryInfoRequestDto) => {
      return await axios.post(DOMAIN + '/user/delivery-info', requestDto, {
        headers: { Authorization: `Bearer ${cookies.jwt}` },
      });
    },
    onSuccess: async () => {
      window.alert('배송지 추가 성공');
      await queryClient.invalidateQueries({
        queryKey: allDeliveryInfoKey
      }).then(() => {
        if (isDefault) {
          // todo: 기본배송지 추가 시 배송지 정보 다시 가져오기
        }
      });
      changeAddDeliveryInfoModalStatus();
    },
    onError: () => {
      window.alert('배송지 추가 실패. 다시 시도해주세요');
    },
  });

  // function 입력값 검증
  const validateAllInptuts = () => {
    if (name === '' || name.includes(' ')) {
      window.alert('배송지명은 필수 입력사항입니다');
      return;
    }
    if (receiver === '' || receiver.includes(' ')) {
      window.alert('이름은 필수 입력사항입니다');
      return;
    }
    if (receiverPhoneNumber === '' && receiverPhoneNumber.includes(' ')) {
      window.alert('휴대폰번호는 필수 입력사항입니다');
      return;
    }

    if (address === '' || address.includes(' ')) {
      window.alert('주소는 필수 입력사항입니다');
      return;
    }

    if (addressDetail !== null && (addressDetail === '' || addressDetail.includes(' '))) {
      window.alert('올바른 상세주소를 입력하세요');
      return;
    }
  };

  // function 배송지 추가 버튼 누르기
  const addDeliveryInfoBtnClickHandler = () => {
    validateAllInptuts();

    addDeliveryInfoMutation.mutate({
      name: name,
      receiver: receiver,
      receiverPhoneNumber: receiverPhoneNumber,
      address: address,
      addressDetail: addressDetail,
      addressDetailPhoneNumber: addressDetail,
      isDefault: isDefault,
    } as PostDeliveryInfoRequestDto);
  };

  // render
  return (
    <div
      className={
        'flex flex-col gap-[1rem] min-w-[25rem] h-[60vh] overflow-y-scroll rounded-[0.6rem] absolute z-30 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white'
      }
    >
      {/* 모달 타이틀 */}
      <div
        className={
          'sticky top-0 flex justify-between items-center p-[1.5rem] bg-white border-b-[0.1rem] border-black/10'
        }
      >
        <p className={'font-bold'}>배송지 추가</p>
        <i
          className="flex items-center justify-center cursor-pointer fi fi-br-cross-small"
          onClick={changeAddDeliveryInfoModalStatus}
        ></i>
      </div>
      {/* 모달 본문 */}
      <div className={'px-[1.5rem] pb-[1.5rem] flex flex-col gap-[1.7rem] text-sm'}>
        {/* 배송지명*/}
        <div className={'flex flex-col gap-[0.5rem]'}>
          <p className={'font-semibold'}>배송지명*</p>
          <input
            type="text"
            placeholder="배송지 이름을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-sm px-[0.8rem] py-[0.6rem] border-[0.08rem] border-gray/20 rounded-lg"
          />
        </div>
        {/* 받는 분*/}
        <div className={'flex flex-col gap-[0.5rem]'}>
          <p className={'font-semibold'}>받는 분*</p>
          <input
            type="text"
            placeholder="이름을 입력해주세요"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
            className="w-full text-sm px-[0.8rem] py-[0.6rem] border-[0.08rem] border-gray/20 rounded-lg"
          />
          <p className={'font-semibold'}>휴대폰번호*</p>
          <input
            type="text"
            placeholder="휴대폰번호를 - 없이 입력해주세요"
            value={receiverPhoneNumber}
            onChange={(e) => setReceiverPhoneNumber(e.target.value)}
            className="w-full text-sm px-[0.8rem] py-[0.6rem] border-[0.08rem] border-gray/20 rounded-lg"
          />
        </div>
        {/* 주소 */}
        <div className={'flex flex-col gap-[0.5rem]'}>
          <p className={'font-semibold'}>주소*</p>
          <input
            type="text"
            placeholder="주소를 입력해주세요"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full text-sm px-[0.8rem] py-[0.6rem] border-[0.08rem] border-gray/20 rounded-lg"
          />
          <p className={'font-semibold'}>상세주소</p>
          <input
            type="text"
            placeholder="상세주소를 입력해주세요"
            value={addressDetail ? addressDetail : ''}
            onChange={(e) => setAddressDetail(e.target.value)}
            className="w-full text-sm px-[0.8rem] py-[0.6rem] border-[0.08rem] border-gray/20 rounded-lg"
          />
        </div>
        {/* 기본 배송지 설정*/}
        <div className={'flex items-center gap-[0.5rem]'}>
          <button
            className={
              'flex justify-center items-center w-[1.2rem] h-[1.2rem] rounded-full border-[0.1rem] border-black/20'
            }
            onClick={() => setIsDefault(!isDefault)}
          >
            {isDefault && <span className={'w-[0.7rem] h-[0.7rem] rounded-full bg-black'}></span>}
          </button>
          <p className={'font-semibold text-xs'}>기본 배송지로 설정</p>
        </div>
        {/* 저장 버튼*/}
        <div className={'flex justify-center'}>
          <Button onClick={addDeliveryInfoBtnClickHandler}>저장</Button>
        </div>
      </div>
    </div>
  );
};

export default AddDeliveryInfoModal;
