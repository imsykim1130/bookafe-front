import { Button } from './ui/button';

const ErrorComp = () => {
  return (
    <div className="absolute pt-[8rem] top-0 bottom-0 right-0 left-0 flex flex-col gap-[1rem] items-center bg-white">
      <p className="text-lg font-semibold">에러가 발생했습니다</p>
      <Button>새로고침</Button>
    </div>
  );
};

export default ErrorComp;
