import { Button } from '@/components/ui/button';
import { useUserMutation, useUserQuery } from '@/hook/user.hook';

// 유저 페이지
const User = () => {
  const { user, isUserLoading, isUserError } = useUserQuery();
  const {changeProfileImage} = useUserMutation();
  
  // Rendering
  if (isUserLoading) {
    return <p>로딩중</p>;
  }

  if (isUserError) {
    return <p>데이터를 가져오는 중 오류가 발생했습니다</p>;
  }

  return (
    <main className="py-[3rem]">
      {/* 개인정보 */}
      <section>
        {/* 프로필 */}
        <div className={'flex flex-col items-center gap-[1rem]'}>
          <div
            className={
              'flex justify-center items-center w-[80px] h-[80px] border-[0.0625rem] border-black/10 rounded-full overflow-hidden drop-shadow-[0_0_10px_rgba(0, 0, 0, 0.1)]'
            }
          >
            {/* 프로필 이미지 */}
            {user?.profileImg ? (
              <img src={user.profileImg + `?timestamp=${Date.now()}`} alt="profile image" />
            ) : (
              <div className={'w-full h-full bg-black bg-opacity-20'}></div>
            )}
          </div>
          <input
            id={'profile_image'}
            type="file"
            style={{ display: 'none' }} // 파일 선택 모달 여는데만 이용하는 것이라 disply none 으로 설정
            onChange={(e) => {
              const files = e.target.files;
              if (!files) return;
              changeProfileImage(files[0]);
            }}
          />
          <Button variant={'outline'}>
            <label htmlFor={'profile_image'}>변경하기</label>
          </Button>
        </div>
        <div className={'mt-[20px] flex flex-col items-center gap-[5px]'}>
          <p className={'text-md'}>
            {user && user.email ? user.email : '이메일 정보를 보기 위해서 로그인이 필요합니다'}
          </p>
          <p className={'text-md text-light-black'}>
            {user && user.createDate ? '가입일 ' + user.createDate : '가입일을 보기 위해서 로그인이 필요합니다'}
          </p>
        </div>
      </section>
    </main>
  );
};

export default User;
