import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import Footer from './layout/Footer.tsx';
import Header from './layout/Header.tsx';

const App = () => {
  const { pathname } = useLocation();
  
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
