type PointState = {
  loading: boolean;
  error: boolean;
  data: number;
};
type PointAction = {
  type: 'loading' | 'error' | 'success';
  payload?: number;
};

const pointReducer = (state: PointState, action: PointAction) => {
  switch (action.type) {
    case 'loading':
      return { ...state, loading: true, error: false };
    case 'error':
      return { ...state, loading: false, error: true };
    case 'success':
      return { ...state, loading: false, error: false, data: action.payload as number };
  }
};

export default pointReducer;
