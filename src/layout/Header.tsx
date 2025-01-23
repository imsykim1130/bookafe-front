import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { userState } from '../redux/userSlice.ts';

const Header = () => {
  const { pathname } = useLocation();
  const isAuthPage = pathname.includes('/auth/');

  const { authType } = useParams();
  const { profileImg } = useSelector((state: { user: userState }) => state.user);
  const [cookies, _] = useCookies();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const navigate = useNavigate();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  // 토큰 여부 검증
  useEffect(() => {
    if (!cookies.jwt) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [cookies.jwt]);

  const changeProfileImage = (changeImage: string) => {
    if (!changeImage) {
      setProfileImageUrl(null);
      return;
    }
    setProfileImageUrl(`http://localhost:8080/image/${changeImage}`);
  };

  // 프로필 이미지 받아오기
  useEffect(() => {
    changeProfileImage(profileImg);
  }, [profileImg]);

  return (
    <header
      className={`sticky z-40 top-0 w-full flex justify-between items-center px-[5%] md:px-[10%] lg:px-[15%] py-5 bg-white`}
    >
      {/*로고*/}
      <Link to="/" className="w-[30px] h-[30px] flex justify-center items-center">
        <i className="fi fi-ss-book-alt"></i>
      </Link>
      {/*네비게이션*/}
      <nav className="relative flex gap-[20px] items-center">
        {/*장바구니*/}
        {!isAuthPage ? (
          <Link to="/cart" className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer">
            <i className="fi fi-rr-shopping-cart"></i>
          </Link>
        ) : (
          ''
        )}
        {/*좋아요*/}
        {!isAuthPage ? (
          <Link to={'/favorite'} className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer">
            <i className="fi fi-rs-heart"></i>
          </Link>
        ) : (
          ''
        )}
        {/*유저*/}
        {isLoggedIn ? (
          <Link
            to={'/user'}
            className="w-[30px] h-[30px] rounded-full flex items-center justify-center overflow-hidden"
          >
            <div className={'w-[20px] h-[20px] rounded-full flex items-center justify-center overflow-hidden'}>
              {profileImageUrl ? <img src={profileImageUrl} alt="profile img" /> : <i className="fi fi-rr-user"></i>}
            </div>
          </Link>
        ) : (
          ''
        )}

        {/* 로그인 */}
        {(!isAuthPage && !cookies.jwt) || (isAuthPage && authType === 'sign-up') ? (
          <div
            className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer"
            onClick={() => {
              navigate('/auth/sign-in', { state: { pathname: pathname } });
            }}
          >
            <i className="fi fi-rr-insert-alt"></i>
          </div>
        ) : (
          ''
        )}
        {/* 회원가입 */}
        {isAuthPage && authType === 'sign-in' ? (
          <Link to={'/auth/sign-up'} className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer">
            <i className="fi fi-rr-user-add"></i>
          </Link>
        ) : (
          ''
        )}
      </nav>
    </header>
  );
};

export default Header;
