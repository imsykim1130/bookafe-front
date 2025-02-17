import { useEffect } from 'react';

interface Props {
  name: string;
  discountPercent: number;
  selected: boolean;
}

const CouponComp = ({ name, discountPercent, selected }: Props) => {
  useEffect(() => {
    console.log(selected);
  }, [selected]);
  return (
    <button
      className={`flex items-center border-[0.1rem] p-[1rem] border-black/15 rounded-[0.6rem] ${selected ? 'bg-black/15' : ''} w-full`}
    >
      <p className="flex-1 text-start">{name}</p>
      <div>
        <div></div>
        <p className="pl-5 border-l-[0.17rem] border-black/15">{discountPercent} %</p>
      </div>
    </button>
  );
};

export default CouponComp;
