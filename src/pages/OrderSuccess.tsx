import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();

  const homeBtnClickHandler = () => {
    navigate('/');
  };

  const orderDetailClickHandler = () => {
    navigate('/order/detail');
  };

  // render
  return (
    <div className={'w-full min-h-[80vh] flex flex-col justify-center items-center gap-y-[5px]'}>
      <span className={'text-[60px]'}>👍</span>
      <div className={'text-[30px] font-bold'}>주문 성공!</div>
      <div className={'w-[150px] flex flex-col gap-[10px] text-md font-semibold mt-[20px]'}>
        <button
          className={
            'w-full border-[1px] border-black border-opacity-80 rounded-[5px] px-[10px] py-[5px] duration-300 hover:bg-black hover:bg-opacity-10'
          }
          onClick={homeBtnClickHandler}
        >
          홈으로
        </button>
        <button
          className={
            'w-full border-[1px] border-black border-opacity-80 rounded-[5px] px-[10px] py-[5px] duration-300 hover:bg-black hover:bg-opacity-10'
          }
          onClick={orderDetailClickHandler}
        >
          주문내역
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;
