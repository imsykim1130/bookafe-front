import {
  changeCartBookCountRequest,
  createOrderRequest,
  getCartBookListRequest,
  getCouponListRequest,
  getOrderInfoRequest,
  getTotalPointRequest,
} from '@/api/index.ts';
import { CartBookData, CouponData, OrderInfoData } from '@/api/item';
import { PostOrderRequestDto } from '@/api/request.dto';
import Button from '@/components/Button';
import { Dispatch, forwardRef, RefObject, SetStateAction, useEffect, useRef, useState } from 'react';

import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import CartBookComp from './component/CartBook';
import CartBookButtonPart from './component/CartBookButtonPart';

/// 전체
const Cart = () => {
  const [cookies] = useCookies(['jwt']);
  const navigate = useNavigate();
  const [cartBookList, setCartBookList] = useState<CartBookData[] | null>(null);

  // 장바구니 책 리스트 가져오기
  const getCartBookList = async () => {
    await getCartBookListRequest(cookies.jwt).then((response) => {
      if (response === null) return;
      setCartBookList(response);
    });
  };

  // 장바구니 수량 감소
  const changeCount = (changeCount: number, isbn: string) => {
    if (changeCount < 1) {
      window.alert('주문 수량은 최소 1개입니다');
      return;
    }
    changeCartBookCountRequest(cookies.jwt, isbn, changeCount).then((response) => {
      if (response) {
        getCartBookList();
      }
    });
  };

  useEffect(() => {
    getCartBookList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!cookies.jwt) {
      navigate('/auth/sign-in', {
        state: {
          pathname: '/cart',
        },
      });
      return;
    }
  }, [cookies.jwt, navigate]);

  return (
    <main className={'relative mt-[40px]'}>
      <div className="flex justify-center">
        {cartBookList && cartBookList.length ? (
          <div className={'w-full flex flex-col gap-[60px] max-w-[600px] mx-[5%]'}>
            <CartBookListSection
              cartBookList={cartBookList}
              getCartBookList={getCartBookList}
              changeCount={changeCount}
            />
            <OrderInfo />
          </div>
        ) : (
          <div className={'w-full h-[65vh] flex justify-center items-center'}>
            <p className={'text-[16px] text-black text-opacity-40'}>
              <span>🛒</span> 장바구니가 비었습니다
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

interface CartBookListSectionProps {
  cartBookList: CartBookData[] | null;
  getCartBookList: () => void;
  changeCount: (changeCount: number, isbn: string) => void;
}

//// 장바구니 책 리스트
const CartBookListSection = ({ cartBookList, getCartBookList, changeCount }: CartBookListSectionProps) => {
  return (
    <section>
      <div className={'flex flex-col gap-[5px]'}>
        <h2 className={'font-bold text-[16px]'}>구매목록</h2>
        <p className={'text-[14px] text-black text-opacity-40'}>구매할 책을 다시 한 번 확인해주세요</p>
      </div>
      <div>
        {cartBookList &&
          cartBookList.map((book) => {
            return (
              <CartBookComp key={book.isbn} book={book} changeCount={changeCount} getCartBookList={getCartBookList} />
            );
          })}
      </div>
    </section>
  );
};

////// 배송 관련 정보
const OrderInfo = () => {
  const [cookies] = useCookies(['jwt']);
  const navigate = useNavigate();
  const addressRef = useRef<HTMLInputElement>(null);
  const addressDetailRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);
  const [couponId, setCouponId] = useState<number | null>(null);
  const [usePoint, setUsePoint] = useState<number | null>(null);

  // 구매하기 버튼 클릭 핸들러
  const orderButtonClickHandler = async () => {
    if (!addressRef.current || !addressDetailRef.current || !phoneNumberRef.current) return;

    const requestDto: PostOrderRequestDto = {
      address: addressRef.current.value,
      addressDetail: addressDetailRef.current.value,
      phoneNumber: phoneNumberRef.current.value,
      couponId: couponId,
      usedPoint: usePoint,
    };

    createOrderRequest(cookies.jwt, requestDto).then((response) => {
      if (response !== true) {
        window.alert(response.message);
        return;
      }
      navigate('/order/success');
    });
  };

  const changeCouponId = (changeCouponId: number | null) => {
    if (changeCouponId === couponId) {
      setCouponId(null);
    } else {
      setCouponId(changeCouponId);
    }
  };

  return (
    <div className={'min-w-[350px]'}>
      <DeliveryInfo addressRef={addressRef} addressDetailRef={addressDetailRef} phoneNumberRef={phoneNumberRef} />
      <h2 className={'text-[16px] font-semibold mt-[60px]'}>할인</h2>
      <CouponInfo couponId={couponId} changeCouponId={changeCouponId} />
      <PointInfo usePoint={usePoint} setUsePoint={setUsePoint} />
      <div className={'mt-[60px] flex flex-col gap-[15px]'}>
        <div onClick={orderButtonClickHandler}>
          <Button
            name={'구매하기'}
            bgColor={'bg-black'}
            bgOpacity={80}
            bgHoverOpacity={60}
            textColor={'text-white'}
            textSize={'md'}
          />
        </div>
        <div
          onClick={() => {
            navigate('/');
          }}
        >
          <Button
            name={'취소하기'}
            bgColor={'bg-black'}
            bgOpacity={40}
            bgHoverOpacity={80}
            textColor={'text-white'}
            textSize={'md'}
          />
        </div>
      </div>
    </div>
  );
};

const DeliveryInfo = ({
  addressRef,
  addressDetailRef,
  phoneNumberRef,
}: {
  addressRef: RefObject<HTMLInputElement>;
  addressDetailRef: RefObject<HTMLInputElement>;
  phoneNumberRef: RefObject<HTMLInputElement>;
}) => {
  const [cookies] = useCookies(['jwt']);
  const [deliveryInfo, setDeliveryInfo] = useState<OrderInfoData | null>(null);

  const getDeliveryInfo = () => {
    getOrderInfoRequest(cookies.jwt).then((response) => {
      if (response === null) return;
      setDeliveryInfo(response);
    });
  };

  return (
    <section className={'text-[14px]'}>
      <div className={'flex justify-between'}>
        <h2 className={'text-[16px] font-bold'}>배송정보 확인</h2>
        <p className={'cursor-pointer'} onClick={getDeliveryInfo}>
          {'주문자 정보와 동일 정보 사용하기 >'}
        </p>
      </div>
      <div className={'mt-[30px]'}>
        <InputBox ref={addressRef} type={'text'} name={'주소'} value={deliveryInfo ? deliveryInfo.address : null} />
        <InputBox
          ref={addressDetailRef}
          type={'text'}
          name={'상세주소'}
          value={deliveryInfo ? deliveryInfo.addressDetail : null}
        />
        <InputBox
          ref={phoneNumberRef}
          type={'text'}
          name={'휴대폰 번호'}
          value={deliveryInfo ? deliveryInfo.phoneNumber : null}
        />
      </div>
    </section>
  );
};

const InputBox = forwardRef<HTMLInputElement, { type: string; name: string; value: string | null }>(
  ({ type, name, value }, ref) => {
    const [inputValue, setInputValue] = useState<string>('');

    useEffect(() => {
      if (!value) {
        setInputValue('');
      } else {
        setInputValue(value);
      }
    }, [value]);

    return (
      <div className={'mt-[20px]'}>
        <label htmlFor={name}>{name}</label>
        <input
          ref={ref}
          type={type}
          id={name}
          value={inputValue}
          onChange={(event) => {
            setInputValue(event.target.value);
          }}
          className={
            'w-full mt-[10px] border-[1px] border-black border-opacity-20 rounded-[5px] outline-none px-[20px] py-[15px]'
          }
        />
      </div>
    );
  },
);

const CouponInfo = ({
  couponId,
  changeCouponId,
}: {
  couponId: number | null;
  changeCouponId: (couponId: number | null) => void;
}) => {
  const [cookies] = useCookies(['jwt']);
  const [couponList, setCouponList] = useState<CouponData[] | null>(null);

  const getCouponList = async () => {
    await getCouponListRequest(cookies.jwt).then((response) => {
      setCouponList(response);
    });
  };

  useEffect(() => {
    getCouponList();
    // 첫 렌더링에만 실행되도록 하기 위해 추가
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={'text-[14px] mt-[20px]'}>
      <div className={'flex flex-col gap-[5px]'}>
        <div className={'flex justify-between'}>
          <p className={'font-semibold'}>사용가능한 쿠폰</p>
          <p>{couponList ? couponList.length + ' 개' : '정보를 가져올 수 없습니다'}</p>
        </div>
        <div className={'mt-[10px] flex flex-col gap-[10px]'}>
          {couponList &&
            couponList.length > 0 &&
            couponList.map((coupon) => (
              <div
                key={coupon.id}
                onClick={() => {
                  changeCouponId(coupon.id);
                }}
              >
                <CouponDataComp coupon={coupon} selectedCouponId={couponId} />
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};

const CouponDataComp = ({ coupon, selectedCouponId }: { coupon: CouponData; selectedCouponId: number | null }) => {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  useEffect(() => {
    if (selectedCouponId === coupon.id) {
      setIsSelected(true);
    } else {
      setIsSelected(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCouponId]);

  return (
    <article
      className={
        'flex justify-between border-[1px] border-black border-opacity-60 rounded-[5px] p-[25px] cursor-pointer ' +
        `${isSelected ? 'bg-black bg-opacity-10' : ''}`
      }
    >
      <p>{coupon.name}</p>
      <div className={'flex gap-[20px]'}>
        <div className={'w-[1px] bg-black bg-opacity-20'}></div>
        <p className={'font-semibold'}>{coupon.discountPercent} %</p>
      </div>
    </article>
  );
};

const PointInfo = ({
  usePoint,
  setUsePoint,
}: {
  usePoint: number | null;
  setUsePoint: Dispatch<SetStateAction<number | null>>;
}) => {
  const [cookies] = useCookies(['jwt']);
  const [point, setPoint] = useState<number | null>(null);

  const getTotalPoint = async () => {
    getTotalPointRequest(cookies.jwt).then((response) => {
      setPoint(response);
    });
  };

  useEffect(() => {
    getTotalPoint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className={'mt-[30px] text-[14px]'}>
      <div>
        <p className={'font-semibold'}>포인트</p>
      </div>
      <div
        className={
          'mt-[10px] p-[25px] border-[1px] border-black border-opacity-20 rounded-[5px] flex flex-col gap-[20px]'
        }
      >
        {/* 사용 가능 포인트*/}
        <div className={'flex justify-between'}>
          <p>사용가능한 포인트</p>
          <div className={'w-[140px] flex gap-[5px] items-center font-semibold'}>
            <p
              className={
                'flex-1 font-semibold border-[1px] border-black border-opacity-10 bg-black bg-opacity-5 rounded-[5px] px-[10px] py-[5px]'
              }
            >
              {point ? point : 0}
            </p>
            <span>P</span>
          </div>
        </div>
        {/* 사용할 포인트 */}
        <div className={'flex justify-between items-center'}>
          <p>사용할 포인트</p>
          <div className={'w-[140px] flex gap-[5px] items-center font-semibold'}>
            <div className={'flex-1'}>
              <input
                type="text"
                className={
                  'w-full font-semibold border-[1px] border-black border-opacity-10 rounded-[5px] px-[10px] py-[5px] outline-none'
                }
                value={usePoint === null || usePoint === 0 ? '' : usePoint.toString()}
                onChange={(event) => {
                  if (event.target.value === '') {
                    setUsePoint(null);
                    return;
                  }
                  setUsePoint(Number.parseInt(event.target.value));
                }}
              />
            </div>
            <span>P</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cart;
