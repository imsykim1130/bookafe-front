// /cart
import { createOrderRequest } from '@/api/common.api';
import { CartBookData, CouponData, DeliveryInfoItem } from '@/api/item.ts';
import { useAllCartBookQuery, useDeliveryInfoQuery } from '@/api/query.ts';
import CartDeliveryInfo from '@/pages/common/Cart/component/CartDeliveryInfo.tsx';
import CartPointComp from '@/pages/common/Cart/component/CartPointComp.tsx';
import CartTotalPriceComp from '@/pages/common/Cart/component/CartTotalPriceComp.tsx';
import { useEffect, useMemo, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import CartBookList from './component/CartBookList';
import CartCouponList from './component/CartCouponList';

function Cart() {
  const [cookies] = useCookies(['jwt']);
  const navigate = useNavigate();

  // query: 배송지
  const {
    isLoading: deliveryInfoLoading,
    isError: deliveryInfoError,
    data: deliveryInfo,
  } = useDeliveryInfoQuery(cookies.jwt);
  const [deliveryInfoView, setDeliveryInfoView] = useState<DeliveryInfoItem | null>(null);
  const [deliveryRequest, setDeliveryRequest] = useState<string>(''); // 배송 요청사항
  const [usingCoupon, setUsingCoupon] = useState<CouponData | null>(null); // 사용 쿠폰
  const [usingPoint, setUsingPoint] = useState<number>(0); // 사용 포인트
  const [price, setPrice] = useState<number>(0); // 구매할 책 총 금액
  const couponDiscountedPrice = usingCoupon ? (price * usingCoupon.discountPercent) / 100 : 0; // 쿠폰 할인 금액
  // 최종 결제 금액
  const totalPrice = useMemo(() => {
    return price - couponDiscountedPrice - usingPoint;
  }, [price, couponDiscountedPrice, usingPoint]);
  // query: 장바구니 책
  const { isLoading, isError, data: cartBookList, refetch: cartBookListRefetch } = useAllCartBookQuery(cookies.jwt);

  const allDataReady = !isLoading && !isError && !deliveryInfoLoading && !deliveryInfoError;

  // function: 장바구니 책 가져오기 성공 시 책의 총 가격 계산
  const calculateBookTotalPrice = () => {
    let price = 0;
    cartBookList?.forEach((item) => {
      const bookPrice = item.price - (item.price * item.discountPercent) / 100;
      price = price + bookPrice * item.count;
    });
    changePrice(price);
  };

  // function: 사용 쿠폰 아이디 변경
  const changeUsingCoupon = (coupon: CouponData) => {
    if (usingCoupon?.id === coupon.id) {
      setUsingCoupon(null);
      return;
    }
    setUsingCoupon(coupon);
  };

  // function: 사용 포인트 변경
  const changeUsingPoint = (point: number) => {
    setUsingPoint(point);
  };

  // function: 구매하는 책의 총 금액 변경
  const changePrice = (price: number) => {
    setPrice(price);
  };

  // function: 배송정보 변경
  const changeDeliveryInfoView = (deliveryInfo: DeliveryInfoItem | null) => {
    setDeliveryInfoView(deliveryInfo);
  };

  // function: 주문하기
  const putOrder = () => {
    // 배송지 검증
    if (!deliveryInfo) {
      window.alert('배송지 정보는 필수 입력사항입니다.');
      return;
    }

    // 장바구니 책 개수 검증
    if (cartBookList !== undefined && cartBookList.length === 0) {
      return;
    }

    createOrderRequest(cookies.jwt, {
      address: deliveryInfo.address,
      addressDetail: deliveryInfo.addressDetail,
      couponId: usingCoupon ? usingCoupon.id : null,
      phoneNumber: deliveryInfo.receiverPhoneNumber,
      usedPoint: usingPoint,
    }).then((result) => {
      if (!result) {
        window.alert('주문 실패. 다시 시도해주세요');
        return;
      }
      window.alert('주문 성공!');
      navigate('/order/success');
    });
  };

  // effect: 첫 마운트
  useEffect(() => {
    if (!cartBookList) return;
    calculateBookTotalPrice();
  }, [cartBookList]);

  // effect: 첫 마운트 시 기본 배송정보 있는지 가져오기
  useEffect(() => {
    if (deliveryInfo === undefined) return;
    setDeliveryInfoView(deliveryInfo);
  }, [deliveryInfo]);

  // render
  if (!allDataReady) {
    return;
  }
  return (
    <main className={'flex flex-col items-center gap-5 py-4 px-4'}>
      <CartDeliveryInfo
        deliveryRequest={deliveryRequest}
        setDeliveryRequest={setDeliveryRequest}
        deliveryInfoView={deliveryInfoView}
        changeDeliveryInfoView={changeDeliveryInfoView}
        loading={deliveryInfoLoading}
        error={deliveryInfoError}
      />
      <CartBookList
        isLoading={isLoading}
        isError={isError}
        cartBookList={cartBookList as CartBookData[]}
        cartBookListRefetch={() => cartBookListRefetch()}
      />
      <CartCouponList usingCoupon={usingCoupon} changeUsingCoupon={changeUsingCoupon} isPossible={usingPoint === 0} />
      <CartPointComp usingPoint={usingPoint} changeUsingPoint={changeUsingPoint} isPossible={usingCoupon === null} />
      <CartTotalPriceComp
        price={price}
        couponDiscountedPrice={couponDiscountedPrice}
        usingPoint={usingPoint}
        totalPrice={totalPrice}
        putOrder={putOrder}
        isOrderable={(cartBookList as CartBookData[]).length > 0 && !!deliveryInfo}
      />
    </main>
  );
}

export default Cart;
