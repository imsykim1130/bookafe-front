/* eslint-disable react-hooks/exhaustive-deps */
import { getJwt, removeJwt } from '@/utils/index.ts';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { changeProfileImgRequest } from '../api/api.ts';
import { updateProfileImage, userState } from '../redux/userSlice.ts';

function orderDetailClickHandler(navigate: (path: string) => void) {
  navigate('/order/detail');
}

function pointClickHandler(navigate: (path: string) => void) {
  navigate('/point');
}

function logoutClickHandler(navigate: (path: string) => void) {
  removeJwt();
  navigate('/auth/sign-in');
}

const User = () => {
  const { email, profileImg, createDate } = useSelector((state: { user: userState }) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  const changeProfileImageUrl = (changeImage: string) => {
    if (!changeImage) {
      setProfileImageUrl(null);
      return;
    }
    setProfileImageUrl(`http://localhost:8080/image/${changeImage}`);
  };

  // Effect
  useEffect(() => {
    changeProfileImageUrl(profileImg);
  }, [profileImg]);

  const changeProfileImage = (file: File) => {
    changeProfileImgRequest(getJwt(), file).then((result) => {
      if (!result) {
        window.alert('프로필 이미지 변경 실패! 다시 시도해주세요');
        return;
      }
      dispatch(updateProfileImage(result));
    });
  };

  useEffect(() => {
    if (!getJwt()) {
      navigate('/auth/sign-in');
    }
  }, []);

  // Rendering
  return (
    <main className="py-[3rem]">
      {/* 개인정보 */}
      <section>
        {/* 프로필 */}
        <div className={'flex flex-col items-center'}>
          <div className={'flex justify-center items-center w-[80px] h-[80px] rounded-full overflow-hidden '}>
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="profile image" />
            ) : (
              <div className={'w-full h-full bg-black bg-opacity-20'}></div>
            )}
          </div>
          <input
            id={'profile_image'}
            type="file"
            style={{ display: 'none' }}
            onChange={(e) => {
              const files = e.target.files;
              if (!files) return;
              changeProfileImage(files[0]);
            }}
          />
          <label
            htmlFor={'profile_image'}
            className={
              'mt-[10px] border-[0.5px] border-black border-opacity-80 rounded-[5px] text-md px-[5px] py-[3px] cursor-pointer'
            }
          >
            변경하기
          </label>
        </div>
        <div className={'mt-[20px] flex flex-col items-center gap-[5px]'}>
          <p className={'text-md'}>{email ? email : '이메일 정보를 보기 위해서 로그인이 필요합니다'}</p>
          <p className={'text-md text-light-black'}>
            {createDate ? '가입일 ' + createDate : '가입일을 보기 위해서 로그인이 필요합니다'}
          </p>
        </div>
      </section>
      {/* 다른 페이지로 가는 버튼 */}
      <section className={'mt-[60px] flex flex-col gap-[15px] items-center text-md mx-[5%] md:mx-[10%] lg:mx-[15%]'}>
        <button
          className={
            'min-w-[300px] border-[1px] border-black border-opacity-40 rounded-[5px] py-[15px] duration-300 hover:bg-black hover:bg-opacity-10'
          }
          onClick={() => orderDetailClickHandler(navigate)}
        >
          {'주문내역 보러가기'}
        </button>
        <button
          className={
            'min-w-[300px] border-[1px] border-black border-opacity-40 rounded-[5px] py-[15px] duration-300 hover:bg-black hover:bg-opacity-10'
          }
          onClick={() => pointClickHandler(navigate)}
        >
          {'포인트 적립내역 보러가기'}
        </button>
        <button
          className={'min-w-[300px] bg-black text-white rounded-[5px] py-[15px] duration-300 hover:bg-opacity-60'}
          onClick={() => logoutClickHandler(navigate)}
        >
          로그아웃
        </button>
      </section>
    </main>
  );
};

export default User;
