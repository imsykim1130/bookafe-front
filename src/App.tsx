/* eslint-disable react-hooks/exhaustive-deps */
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { GetUserResponseDto } from './api/response.dto.ts';
import './App.css';
import Footer from './layout/Footer.tsx';
import Header from './layout/Header.tsx';
import { DOMAIN } from './utils/index.ts';
import { useUserStore } from './zustand/userStore.ts';

const App = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [cookies] = useCookies(['jwt']);
  const { loadingUser, errorUser, updateUser, resetUser } = useUserStore();
  const userInfoKey = 'userInfoKey';

  // effect: 쿠키 변경 시 jwt 가 없으면 userStore 비우기, 쿼리 무효화
  // jwt 가 있으면 새로운 user 값 useStore 로 가져오기
  useEffect(() => {
    if (!cookies.jwt) {
      resetUser();
      queryClient.invalidateQueries({
        queryKey: [userInfoKey],
      });
      navigate('/auth/sign-in');
      return;
    }
    queryClient.fetchQuery({
      queryKey: [userInfoKey],
      queryFn: async () => {
        console.log('fetch user');
        loadingUser();
        return axios
          .get(DOMAIN + '/user', {
            headers: {
              Authorization: `Bearer ${cookies.jwt}`,
            },
          })
          .then((res) => {
            const { user, totalPoint } = res.data as GetUserResponseDto;
            updateUser(user, totalPoint);
          })
          .catch(() => {
            errorUser();
          });
      },
      staleTime: Infinity,
      gcTime: 1000 * 60 * 30, // 30분동안 캐시에 저장
    });
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
