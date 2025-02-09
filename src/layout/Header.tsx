/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useUserStore } from '../zustand/userStore';
import { useCookies } from 'react-cookie';

const Header = () => {
  const { pathname } = useLocation();
  const isAuthPage = pathname.includes('/auth/');
  const { authType } = useParams();
  const { user } = useUserStore();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [,,removeCookie] = useCookies(['jwt']);

  // function: 이미지 url 생성
  const changeProfileImage = (changeImage: string) => {
    if (!changeImage) {
      setProfileImageUrl(null);
      return;
    }
    setProfileImageUrl(`http://localhost:8080/image/${changeImage}`);
  };

  // function: 로그아웃 버튼 클릭 핸들러
  function logoutClickHandler() {
    removeCookie("jwt", {path: "/"});
  }

  // function: 로그인 버튼 클릭 핸들러
  // 로그인 성공 시 로그인 버튼을 누른 페이지로 다시 돌아가기 위해 state 에 돌아올 pathname 넣어서 보냄
  function signInClickHandler() {
    navigate('/auth/sign-in', { state: { pathname: pathname } });
  }

  // effect: 프로필 이미지 변경 시 새로 받아오기
  useEffect(() => {
    if (!user) return;
    changeProfileImage(user.profileImg);
  }, [user?.profileImg]);

  // effect: user 변경 사항으로 로그인 여부 확인
  useEffect(() => {
    if (!user) {
      setIsLoggedIn(false);
      return;
    }
    setIsLoggedIn(true);
  }, [user]);

  // todo: 테스트용 삭제 필요
  useEffect(() => {
    if (!user) return;
    console.log(user.email);
  }, []);

  return (
    <header
      className={`sticky z-40 top-0 w-full flex justify-between items-center px-[5%] md:px-[10%] lg:px-[15%] py-5 bg-white shadow-[0_0_4px_rgba(0,0,0,0.1)]`}
    >
      {/*로고*/}
      <Link to="/" className="w-[30px] h-[30px] flex justify-center items-center">
        <i className="fi fi-ss-book-alt text-[px]"></i>
      </Link>
      {/*네비게이션*/}
      <nav className="relative flex gap-[2rem] md:gap-[3rem] items-center">
        {/*장바구니*/}
        {!isAuthPage && user && user.role !== 'ROLE_ADMIN' ? (
          <Link to="/cart" className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer">
            <i className="fi fi-rr-shopping-cart text-[15px] md:hidden"></i>
            <p className="hidden md:block text-nowrap">장바구니</p>
          </Link>
        ) : (
          ''
        )}
        {/*좋아요*/}
        {!isAuthPage && user && user.role !== 'ROLE_ADMIN' ? (
          <Link to={'/favorite'} className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer">
            <i className="fi fi-rs-heart text-[15px]  md:hidden"></i>
            <p className="hidden md:block text-nowrap">좋아요</p>
          </Link>
        ) : (
          ''
        )}
        {/*유저*/}
        {isLoggedIn && user && user.role !== 'ROLE_ADMIN' ? (
          <Link
            to={'/user'}
            className="w-[30px] h-[30px] rounded-full flex items-center justify-center overflow-hidden"
          >
            <div className={'w-[20px] h-[20px] rounded-full flex items-center justify-center overflow-hidden'}>
              {profileImageUrl ? (
                <img src={profileImageUrl} alt="profile img" />
              ) : (
                <i className="fi fi-rr-user text-[15px] flex items-center justify-center"></i>
              )}
            </div>
          </Link>
        ) : (
          ''
        )}

        {/* 로그인 */}
        {(!isAuthPage && !user) || (isAuthPage && authType === 'sign-up') ? (
          <div
            className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer"
            onClick={signInClickHandler}
          >
            <i className="fi fi-rr-insert-alt text-[15px] flex items-center justify-center md:hidden"></i>
            <p className="hidden md:block text-nowrap">로그인</p>
          </div>
        ) : (
          ''
        )}
        {/* 회원가입 */}
        {isAuthPage && !user && authType === 'sign-in' ? (
          <Link to={'/auth/sign-up'} className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer">
            <i className="fi fi-rr-user-add text-[15px] flex items-center justify-center md:hidden"></i>
            <p className="hidden md:block text-nowrap">회원가입</p>
          </Link>
        ) : (
          ''
        )}

        {user && user.role === 'ROLE_ADMIN' ? (
          <button
            className="flex items-center justify-center cursor-pointer"
            onClick={() => {
              logoutClickHandler();
            }}
          >
            <p className="text-nowrap">로그아웃</p>
          </button>
        ) : (
          ''
        )}
      </nav>
    </header>
  );
};

export default Header;
