import { getTotalPointRequest } from '@/api/common.api';
import { Button } from '@/components/ui/button.tsx';
import pointReducer from '@/pages/common/Cart/reducer/pointReducer.ts';
import { useEffect, useReducer, useState } from 'react';
import { useCookies } from 'react-cookie';

interface Props {
  usingPoint: number;
  changeUsingPoint: (point: number) => void;
  isPossible: boolean; // 포인트 사용 가능 여부
}
const CartPointComp = ({ usingPoint, changeUsingPoint, isPossible }: Props) => {
  const [cookies] = useCookies(['jwt']);
  const [isValidPoint, setIsValidPoint] = useState<boolean>(false);
  const [totalPoint, totalPointDispatcher] = useReducer(pointReducer, {
    loading: true,
    error: false,
    data: 0,
  });
  const usableMaxPoint = Math.floor(totalPoint.data / 100) * 100;

  // function: 보유 포인트 가져오기 요청
  const getTotalPoint = () => {
    totalPointDispatcher({ type: 'loading' });
    getTotalPointRequest(cookies.jwt).then((result) => {
      if (!result) {
        totalPointDispatcher({ type: 'error' });
        return;
      }
      totalPointDispatcher({ type: 'success', payload: result });
    });
  };

  // function: 전액 사용 버튼 누르기
  const useAllPointBtnClickHandler = () => {
    changeUsingPoint(usableMaxPoint);
  };

  // effect: 첫 마운트
  useEffect(() => {
    getTotalPoint();
  }, []);

  // effect: 포인트 사용 가능 여부 판별
  useEffect(() => {
    if (usingPoint === 0) {
      setIsValidPoint(false);
      return;
    }

    if (usingPoint > totalPoint.data || usingPoint % 100 !== 0) {
      setIsValidPoint(true);
    } else {
      setIsValidPoint(false);
    }
  }, [usingPoint]);

  return (
    <section className={'cart-section'}>
      <div className={'flex flex-col gap-[0.2rem]'}>
        <p className={'font-bold'}>포인트</p>
        <p className={'text-sm text-black/60'}>100 단위로 입력해주세요</p>
      </div>
      <div className={'flex items-center'}>
        {/* 보유 포인트 */}
        <p className={'min-w-[8rem] font-black text-xl flex gap-3'}>
          보유 <span>{totalPoint.data} P</span>
        </p>
        {/* 사용 포인트 */}
        <div className={'relative w-full flex justify-end items-center gap-2 text-sm'}>
          <div className={'relative'}>
            <input
              type="number"
              value={usingPoint === 0 ? '' : usingPoint}
              min={0}
              onChange={(e) => {
                const value = e.target.value;
                changeUsingPoint(Number(value));
              }}
              disabled={!isPossible}
              className="w-full max-w-[10rem] px-[1.8rem] py-[0.6rem] border-[0.08rem] border-gray/20 rounded-lg text-end font-bold"
            />
            <span className={'absolute top-1/2 right-[0.75rem] -translate-y-1/2 font-bold'}>P</span>
          </div>
          {/* 에러 메세지 */}
          {isValidPoint && (
            <p className={'absolute right-0 -top-[2rem] text-xs text-red-500 font-semibold text-nowrap'}>
              {'잘못된 포인트입니다.'}
            </p>
          )}
          {/* 포인트 전액 사용 버튼 */}
          <Button variant={'outline'} className={'py-[1.2rem]'} onClick={useAllPointBtnClickHandler}>
            전액사용
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CartPointComp;
