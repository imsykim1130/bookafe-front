interface Props {
  point: number;
  changeUsingPoint: (point: number) => void;
}
const CartPointComp = ({ point, changeUsingPoint }: Props) => {
  return (
    <section className={'cart-section'}>
      <div className={'flex flex-col gap-[0.2rem]'}>
        <p className={'font-bold'}>포인트</p>
        <p className={'text-sm text-black/60'}>100 단위로 입력해주세요</p>
      </div>
      <div className={'flex items-center'}>
        <p className={'min-w-[8rem] font-black text-xl flex gap-6'}>
          보유 <span>{point} P</span>
        </p>
        <div className={'w-full flex justify-end items-center gap-2 text-sm'}>
          <input
            type="text"
            value={point === 0 ? '' : point}
            onChange={(e) => {
              const value = e.target.value;
              if (value === '') {
                changeUsingPoint(0);
                return;
              }
              changeUsingPoint(Number(value));
            }}
            className="w-full max-w-[10rem] px-[0.8rem] py-[0.6rem] border-[0.08rem] border-gray/20 rounded-lg text-end font-bold"
          />
          <span className={'font-bold'}>P</span>
        </div>
      </div>
    </section>
  );
};

export default CartPointComp;
