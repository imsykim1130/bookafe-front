import RecommendBook from './RecommendBook.tsx';
import Top10 from './Top10.tsx';

const Landing = () => {
  return (
    <main className={'flex flex-col'}>
      <RecommendBook />
      <Top10 />
    </main>
  );
};

export default Landing;
