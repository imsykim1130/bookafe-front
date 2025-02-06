/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import Footer from './layout/Footer.tsx';
import Header from './layout/Header.tsx';

import { UnknownAction } from '@reduxjs/toolkit';
import { getUserRequest } from './api/api.ts';
import { GetUserResponseDto } from './api/response.dto.ts';
import { error, loading, reset, update } from './redux/userSlice.ts';

const App = () => {
  const [cookies] = useCookies(['jwt']);
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const getUser = async (dispatch: Dispatch<UnknownAction>, jwt: string) => {
    dispatch(loading());
    await getUserRequest(jwt)
      .then((response) => {
        const { user } = response.data as GetUserResponseDto;
        dispatch(update(user));
      })
      .catch(() => {
        dispatch(error());
      });
  };

  useEffect(() => {
    // 새로고침 되어도 유저 정보를 받아오게끔 하는 역할
    // jwt 확인
    // 있으면 유저정보 가져오기
    // 없으면 유저정보 초기화
    if (!cookies.jwt) {
      dispatch(reset());
      sessionStorage.clear();
      return;
    }
    getUser(dispatch, cookies.jwt);
  }, [cookies.jwt]);

  // 페이지 이동 시 스크롤 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
