/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { userInfoKey, useUserInfoQuery } from './api/query.ts';
import './App.css';
import Footer from './layout/Footer.tsx';
import Header from './layout/Header.tsx';
import { useUserStore } from './zustand/userStore.ts';
import { useQueryClient } from '@tanstack/react-query';


const App = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cookies] = useCookies(['jwt']);
  const { data: userInfo, refetch: refetchUserInfo } = useUserInfoQuery(cookies.jwt);
  const { resetUser, updateUser, loadingUser } = useUserStore();

  // effect: 쿠키 변경 시 jwt 가 없으면 userStore 비우기, 쿼리 무효화
  // jwt 가 있으면 새로운 user 값 useStore 로 가져오기
  useEffect(() => {
    if (cookies.jwt === undefined) {
      resetUser();
      queryClient.invalidateQueries({
        queryKey:[userInfoKey]
      })
      navigate('/auth/sign-in');
      return;
    }
    refetchUserInfo();
    loadingUser();
  }, [cookies]);

  // effect
  useEffect(() => {
    if (userInfo === undefined) {
      resetUser();
      return;
    }
    updateUser(userInfo.user, userInfo.totalPoint);
  }, [userInfo]);

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
