import AlertDialogComp from '@/components/AlertDialogComp';
import { useJwt } from '@/hook/useJwt';
import { useUser } from '@/hook/useUser';
import { useEffect, useState } from 'react';

import { Link, useLocation, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const { jwt, removeCookie } = useJwt();
  const { pathname } = useLocation();
  const { deleteUser } = useUser(jwt);

  const [isAlarm] = useState<boolean>(false);
  const [isNavOpened, setIsNavOpened] = useState<boolean>(false);

  // function: 로그아웃 버튼 클릭 핸들러
  function logoutClickHandler() {
    removeCookie('jwt', { path: '/' });
    deleteUser();
    navigate("/");
  }

  // function: 로그인 버튼 클릭 핸들러
  // 로그인 성공 시 로그인 버튼을 누른 페이지로 다시 돌아가기 위해 state 에 돌아올 pathname 넣어서 보냄
  function signInClickHandler() {
    navigate('/auth/sign-in', { state: { pathname: pathname } });
  }

  // function: 네비게이션 열기/닫기
  function toggleNav() {
    setIsNavOpened(!isNavOpened);
  }

  // effect: 페이지 이동마다 메뉴 네비게이션 드롭다운 닫기
  useEffect(() => {
    setIsNavOpened(false);
  }, [pathname]);

  return (
    <header
      className={`sticky z-40 top-0 w-full flex justify-between items-center px-[5vw] md:px-[10vw] py-5 bg-white shadow-[0_0_4px_rgba(0,0,0,0.1)] text-xs`}
    >
      {/*로고*/}
      <Link to="/" className="w-[30px] h-[30px] flex justify-center items-center">
        <i className="fi fi-ss-book-alt text-[px]"></i>
      </Link>

      {/*네비게이션*/}
      <nav className="relative flex gap-[2rem] md:gap-[3rem] items-center">
        {/* 알림 버튼 */}
        <button className="relative icon-btn ">
          <i className="flex items-center justify-center text-base fi fi-ss-bell"></i>
          {isAlarm && (
            <span className="absolute block -translate-x-1/2 bg-red-500 rounded-full size-[0.3125rem] top-5 left-1/2"></span>
          )}
        </button>
        {/* 메뉴 버튼 */}
        <button className="md:hidden icon-btn" onClick={toggleNav}>
          <i className="flex items-center justify-center text-base fi fi-br-grid"></i>
        </button>

        {/* 드롭다운 */}
        <div className={`items-start gap-[1.875rem] nav ${isNavOpened ? 'flex' : 'hidden md:flex'}`}>
          {!jwt ? (
            <>
              {/* 로그인 안되어 있을 때 */}
              {/* 로그인, 로그아웃 */}
              <Link to={'/auth/sign-in'} className="text-nowrap icon-btn" onClick={signInClickHandler}>
                로그인
              </Link>
              <Link to={'/auth/sign-up'} className="text-nowrap icon-btn">
                회원가입
              </Link>
            </>
          ) : (
            <>
              {/* 로그인 되어 있을 때 */}
              {/* 좋아요, 내 정보, 로그아웃 */}
              <Link to={'/favorite'} className="icon-btn ">
                좋아요
              </Link>
              <Link to={'/user'} className="icon-btn ">
                내 정보
              </Link>
              <AlertDialogComp logoutClickHandler={logoutClickHandler}>
                {/* 로그아웃 팝업 띄울 트리거 버튼 */}
                <button
                  className="icon-btn"
                >
                  로그아웃
                </button>
              </AlertDialogComp>
              
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
