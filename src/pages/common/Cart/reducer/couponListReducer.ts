import { CouponData } from "@/api/item";

type CouponListState = {
    loading: boolean;
    error: boolean;
    data: CouponData[];
  };
  
type CouponListAction = {
    type: 'loading' | 'reset' | 'error' | 'success';
    payload?: CouponData[];
  };
  
const couponListReducer = (state: CouponListState, action: CouponListAction) => {
    switch (action.type) {
      case 'loading':
        return { ...state, loading: true, error: false };
      case 'reset':
        return { ...state, loading: false, error: false, data: [] };
      case 'error':
        return { ...state, loading: false, error: true };
      case 'success':
        return { ...state, loading: false, error: false, data: action.payload as CouponData[] };
    }
  };

  export default couponListReducer;