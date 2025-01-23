import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './layout/Header.tsx';
import Footer from './layout/Footer.tsx';
import { useCookies } from 'react-cookie';
import { Dispatch, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { UnknownAction } from '@reduxjs/toolkit';
import { getUserRequest } from './api';
import { GetUserResponseDto } from './api/response.dto.ts';
import { error, loading, reset, update } from './redux/userSlice.ts';

const App = () => {
  const [cookies] = useCookies(['jwt']);
  const dispatch = useDispatch();

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

  return (
    <div>
      <Header />
      <div className={'min-h-[100vh]'}>
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default App;
