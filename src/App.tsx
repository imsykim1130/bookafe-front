/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import Footer from './layout/Footer.tsx';
import Header from './layout/Header.tsx';

import { UnknownAction } from '@reduxjs/toolkit';
import { getUserRequest } from './api/api.ts';
import { GetUserResponseDto, ResponseDto } from './api/response.dto.ts';
import { error, loading, reset, update } from './redux/userSlice.ts';
import { getJwt } from './utils/cookie.ts';
import { useUserStore } from './zustand/userStore.ts';

const App = () => {
  const dispatch = useDispatch();
  const { pathname } = useLocation();

  const { loadingUser, errorUser, updateUser, resetUser } = useUserStore();

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

  // zustand userStore 에 유저 정보 가져오기
  const zustandGetUserStore = () => {
    // 로딩 표시
    loadingUser();
    getUserRequest(getJwt())
      .then((res) => {
        // 성공
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

  useEffect(() => {
    // 새로고침 되어도 유저 정보를 받아오게끔 하는 역할
    // jwt 확인
    // 있으면 유저정보 가져오기
    // 없으면 유저정보 초기화
    if (!getJwt()) {
      dispatch(reset());
      sessionStorage.clear();
      return;
    }
    getUser(dispatch, getJwt());
  }, [getJwt()]);

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
