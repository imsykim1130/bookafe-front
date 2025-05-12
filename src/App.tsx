import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import Footer from './layout/Footer.tsx';
import Header from './layout/Header.tsx';
import { Toaster } from './components/ui/toaster.tsx';
import { DOMAIN } from './utils/env.ts';
import { useEffect } from 'react';
import { useUserQuery } from './hook/user.hook.ts';

const App = () => {
  const { pathname } = useLocation();
  const { user } = useUserQuery();

  const handleBeforeUnload = (userId: number) => {
      const body = {userId: userId};
      const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
      navigator.sendBeacon(DOMAIN + '/sse/unsubscribe', blob);

      // event.preventDefault();
      // event.returnValue = ''; // This empty string is needed for some older browsers
  }

  // effect: 페이지 이동 시 스크롤 맨 위로 이동
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    if(!user) return;
    window.addEventListener('beforeunload', () => handleBeforeUnload(user.id));

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', () => handleBeforeUnload(user.id));
    }
  }, [user]);
  
  // render
  return (
    <>
      <div className="flex flex-col">
        <Header />
        <Outlet />
      </div>
      <Footer />
      <Toaster />
    </>
  );
};

export default App;
