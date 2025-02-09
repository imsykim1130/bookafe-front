/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import Footer from './layout/Footer.tsx';
import Header from './layout/Header.tsx';

import { useCookies } from 'react-cookie';
import { getUserRequest } from './api/api.ts';
import { GetUserResponseDto, ResponseDto } from './api/response.dto.ts';
import { useUserStore } from './zustand/userStore.ts';

const App = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [cookies] = useCookies(['jwt']);
  const { user, loadingUser, errorUser, updateUser, resetUser } = useUserStore();

  // function: zustand userStore 에 유저 정보 가져오기
  const zustandGetUserStore = () => {
    // 로딩 표시
    loadingUser();
    getUserRequest(cookies.jwt)
      .then((res) => {
        // 성공
        console.log('zustand user 정보 가져오기 성공');
        const { user, totalPoint } = res.data as GetUserResponseDto;
        updateUser(user, totalPoint);
      })
      .catch((err) => {
        // 실패
        // 에러 응답이 아예 안왔을 때
        if (!err) {
          window.alert('네트워크 에러');
          errorUser();
          return;
        }
        // 에러 응답 콘솔 출력
        const { message } = err.response.data as ResponseDto;
        console.log('유저 정보 받아오기 에러 발생 : ' + message);
        errorUser();
      });
  };

  // effect: 쿠키 변경 시 jwt 가 없으면 userStore 비우기
  // jwt 가 있으면 새로운 user 값 useStore 로 가져오기
  useEffect(() => {
    if (!cookies.jwt && user) {
      resetUser();
      navigate('/auth/sign-in');
      return;
    }
    
    if(cookies.jwt && !user) {
      zustandGetUserStore();
    }
  }, [cookies]);

  // effect: 페이지 이동 시 스크롤 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // render
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default App;
