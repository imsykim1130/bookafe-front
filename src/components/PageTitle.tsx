import { useMemo } from 'react';

const PageTitle = ({ title }: { title: string }) => {
  return useMemo(() => {
    return (
      <div className={'flex justify-center items-center pt-[10px] pb-[50px]'}>
        <h1 className={'font-bold'}>{title}</h1>
      </div>
    );
  }, [title]);
};

export default PageTitle;
