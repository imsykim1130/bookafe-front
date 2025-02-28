/* eslint-disable react-hooks/exhaustive-deps */
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import Footer from './layout/Footer.tsx';
import Header from './layout/Header.tsx';
import { userKey} from './hook/useUser.ts';

const App = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cookies] = useCookies(['jwt']);

  // effect: 쿠키 변경 시 jwt 가 없으면 쿼리 무효화
  useEffect(() => {
    if (!cookies.jwt) {
      queryClient.invalidateQueries({
        queryKey: [userKey],
      });
      navigate('/auth/sign-in');
      return;
    }
  }, [cookies]);

  // effect: 페이지 이동 시 스크롤 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // render
  return (
    <>
      <div className="flex flex-col">
        <Header />
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default App;
