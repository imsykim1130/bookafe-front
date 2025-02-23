/* eslint-disable react-hooks/exhaustive-deps */
import { CouponData } from '@/api/item';
import { useEffect, useReducer } from 'react';

import { getCouponListRequest } from '@/api/api';
import { useCookies } from 'react-cookie';

import couponListReducer from '../reducer/couponListReducer';
import CouponComp from './CouponComp';

const CartCouponList = ({
  usingCoupon,
  changeUsingCoupon,
  isPossible,
}: {
  usingCoupon: CouponData | null;
  changeUsingCoupon: (coupon: CouponData) => void;
  isPossible: boolean; // 쿠폰 사용 가능 여부
}) => {
  const [cookies] = useCookies(['jwt']);
  const [couponList, couponListDispatcher] = useReducer(couponListReducer, {
    loading: true,
    error: false,
    data: [],
  });

  // function: 쿠폰 가져오기 요청
  const getCouponList = () => {
    couponListDispatcher({ type: 'loading' });
    getCouponListRequest(cookies.jwt).then((result) => {
      if (!result) {
        // 실패
        couponListDispatcher({ type: 'error' });
        return;
      }
      // 성공
      couponListDispatcher({ type: 'success', payload: result });
    });
  };

  const couponClickHandler = (coupon: CouponData) => {
    if (!isPossible) {
      window.alert('포인트 사용 시 쿠폰 사용이 불가합니다.');
      return;
    }
    changeUsingCoupon(coupon);
  };

  // effect: 첫 마운트 시 쿠폰 가져오기
  useEffect(() => {
    getCouponList();
  }, []);

  return (
    <section className="cart-section">
      {/* 로딩중 일 때 */}
      {couponList.loading && <p>로딩중입니다</p>}

      {/* 로딩중이 아니고 에러가 없을 때 */}
      {!couponList.loading && !couponList.error && (
        <>
          <div className="flex items-center gap-8 font-bold">
            <span>쿠폰</span>
            {/* 쿠폰 개수 */}
            <span>총 {couponList.data.length}개</span>
          </div>
          {couponList.data.length ? (
            // 쿠폰이 존재할 때
            <div className="flex flex-col gap-2 font-semibold">
              {couponList.data.map((item: CouponData) => (
                <div key={item.id} onClick={() => couponClickHandler(item)}>
                  <CouponComp
                    key={item.id}
                    name={item.name}
                    discountPercent={item.discountPercent}
                    selected={usingCoupon?.id === item.id}
                  />
                </div>
              ))}
            </div>
          ) : (
            // 쿠폰이 존재하지 않을 때
            <p className="font-sm text-black/60">쿠폰이 존재하지 않습니다.</p>
          )}
        </>
      )}
    </section>
  );
};

export default CartCouponList;
