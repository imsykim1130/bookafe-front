import AdminLanding from './AdminLanding.tsx';
import RecommendBook from './RecommendBook.tsx';
import Top10 from './Top10.tsx';
import { userState } from '@/redux/userSlice.ts';
import { useSelector } from 'react-redux';

const Landing = () => {
  const { role } = useSelector((state: { user: userState }) => state.user);

  if (role === 'ROLE_ADMIN') {
    return <AdminLanding />;
  }

  return (
    <main className={'flex flex-col overflow-y-hidden'}>
      <RecommendBook />
      <Top10 />
    </main>
  );
};

export default Landing;
