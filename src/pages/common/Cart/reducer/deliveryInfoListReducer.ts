import { DeliveryInfoItem } from '@/api/item.ts';

type DeliveryInfoListState = {
  loading: boolean;
  error: boolean;
  data: DeliveryInfoItem[];
};

type DeliveryInfoListAction = {
  type: 'loading' | 'error' | 'success';
  payload?: DeliveryInfoItem[];
};

const deliveryInfoListReducer = (state: DeliveryInfoListState, action: DeliveryInfoListAction) => {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: true, error: false };
    case 'error':
      return { ...state, loading: false, error: true };
    case 'success':
      return { loading: false, error: false, data: action.payload as DeliveryInfoItem[] };
    default:
      throw new Error('Unknown action type');
  }
};

export default deliveryInfoListReducer;
