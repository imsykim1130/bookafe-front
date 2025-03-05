import { SignInRequestDto, SignUpRequestDto } from '@/api/request.dto';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { useAuthMutation } from '@/hook/auth.hooks';
import { ErrorResponse } from '@/types/common.type';
import { addIsAuthCookie } from '@/utils/cookie';
import { getRandomNickname } from '@/utils/openai';
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const Auth = () => {
  // index: top
  const { authType } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const pathname = state ? state.pathname : null;

  // Ref
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);

  // RegExp
  const emailRegExp = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
  const passwordRegExp = new RegExp('^.{8,20}$');
  const nicknameRegExp = new RegExp('^.{5,20}$');

  // Error state
  const [emailErr, setEmailErr] = useState<boolean>(false);
  const [passwordErr, setPasswordErr] = useState<boolean>(false);
  const [nicknameErr, setNicknameErr] = useState<boolean>(false);

  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);

  const { signIn, signUp } = useAuthMutation({
    onSignInSuccess,
    onSignInError,
    onSignUpSuccess,
    onSignUpError,
  });

  // function: 로그인 / 회원가입 페이지 이동
  function changeAuthType() {
    if (authType === 'sign-in') {
      navigate('/auth/sign-up');
    } else {
      navigate('/auth/sign-in');
    }
  }

  // handler: 로그인 성공 핸들러
  /**
   * @param expire (초 단위)
   */
  function onSignInSuccess(expire: number) {
    // 유저 정보 가져오기
    // refetchUser();

    // 로그인 여부를 확인할 isAuth 쿠키 생성
    const expires = new Date(Date.now() + 1000 * expire);
    addIsAuthCookie(expires);
    
    // 페이지 이동
    if (pathname) {
      navigate(pathname);
    } else {
      navigate('/');
    }
  }

  // handler: 로그인 실패 핸들러
  function onSignInError(error: ErrorResponse) {
    // 알 수 없는 에러
    if (error.code === 'UNE') {
      window.alert('네트워크 에러. 관리자에게 문의하세요');
      navigate('/error/500');
      return;
    }
    // 로그
    const { message } = error;
    console.log(message);

    // 로그인 실패
    window.alert('로그인 실패. 잠시후 다시 시도해주세요');
  }

  // handler: 로그인 버튼 클릭 핸들러
  const signInBtnClickHandler = () => {
    // 입력값 검증
    if (!emailRef.current || !passwordRef.current || emailErr || passwordErr) return;

    const requestDto: SignInRequestDto = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    // 로그인 요청
    signIn(requestDto);
  };

  // function: 회원가입 전 데이터 검증
  function signUpValidation() {
    let isError = false;

    // ref 여부 검증
    if (!emailRef.current || !passwordRef.current || !nicknameRef.current) {
      return;
    }

    // 에러가 하나라도 있으면 회원가입 불가
    if (emailRef.current.value === '') {
      setEmailErr(true);
      isError = true;
    }

    if (passwordRef.current.value === '') {
      setPasswordErr(true);
      isError = true;
    }
    if (nicknameRef.current.value === '') {
      setNicknameErr(true);
      isError = true;
    }
    return isError;
  }

  // handler: 회원가입 성공 핸들러
  function onSignUpSuccess() {
    window.alert('회원가입 성공!');
    navigate('/auth/sign-in');
  }
  // handler: 회원가입 실패 핸들러
  function onSignUpError(error: ErrorResponse) {
    // 알 수 없는 에러 발생 시 에러 페이지로 이동
    if (error.code === 'UNE') {
      window.alert('네트워크 에러. 관리자에게 문의하세요');
      navigate('/error/500');
      return;
    }

    // 어떤 에러인지 팝업으로 띄움
    window.alert(error.message);
  }

  // handler: 회원가입 버튼 클릭 핸들러
  function signUpBtnClickHandler() {
    // 입력값 검증
    const isError = signUpValidation();

    if (isError) {
      return;
    }

    const requestDto: SignUpRequestDto = {
      email: emailRef.current?.value as string,
      password: passwordRef.current?.value as string,
      nickname: nicknameRef.current?.value as string,
      role: 'user',
    };

    // 회원가입 요청
    signUp(requestDto);
  }

  // function: 값이 변경될 때 마다 정규표현식 검증을 통해 에러 여부 결정
  const inputChangeHandler = (
    event: ChangeEvent<HTMLInputElement>,
    regExp: RegExp,
    setErr: Dispatch<SetStateAction<boolean>>,
  ) => {
    const value = event.target.value;
    const isValid = regExp.test(value);

    if (value === '') {
      setErr(false);
      return;
    }
    if (isValid) {
      setErr(false);
    } else {
      setErr(true);
    }
  };

  // handler: 랜덤 닉네임 생성 버튼 클릭 핸들러
  const randomNicknameClickHandler = () => {
    getRandomNickname().then((res) => {
      if (!res) return;
      if (!nicknameRef.current) return;
      console.log(res);
      nicknameRef.current.value = res;

      // 생성된 닉네임 길이 검증
      const isValid = nicknameRegExp.test(res);
      if (isValid) {
        setNicknameErr(false);
      } else {
        setNicknameErr(true);
      }
    });
  };

  // Render
  return (
    <main className={'flex flex-col items-center py-[10vh] px-[10%]'}>
      {/* 페이지 이름 */}
      <h1 className={'text-[1.1rem] font-black'}>{authType === 'sign-in' ? 'LogIn' : 'SignUp'}</h1>

      <div className="flex items-center flex-col w-full max-w-[350px]">
        {/* 로그인 관련 버튼 */}
        {authType === 'sign-in' && (
          <div className="w-full my-[40px] flex flex-col gap-9">
            {/* 이메일 */}
            <div className={'relative flex flex-col gap-5'}>
              <div>
                <i className="absolute flex items-center justify-center -translate-y-1/2 top-1/2 left-5 fi fi-rr-envelope"></i>
                <Input
                  ref={emailRef}
                  type={'email'}
                  placeholder={'이메일'}
                  className={'pl-[3rem] pr-[1.25rem] py-6'}
                  onChange={(e) => {
                    inputChangeHandler(e, emailRegExp, setEmailErr);
                  }}
                />
              </div>
              {emailErr && <p className={'absolute left-0 top-14 text-red-600'}>이메일 형식이 맞지 않습니다</p>}
            </div>
            {/* 비밀번호 */}
            <div className={'relative flex flex-col gap-5'}>
              <div>
                <i className="absolute flex items-center justify-center -translate-y-1/2 top-1/2 left-5 fi fi-rr-lock"></i>
                <Input
                  ref={passwordRef}
                  type={'password'}
                  placeholder={'비밀번호'}
                  className={'pl-[3rem] pr-[1.25rem] py-6'}
                  onChange={(e) => {
                    inputChangeHandler(e, passwordRegExp, setPasswordErr);
                  }}
                />
              </div>
              {passwordErr && <p className={'absolute left-0 top-14 text-red-600'}>비밀번호는 8자 이상입니다</p>}
            </div>
          </div>
        )}

        {/* 회원가입 관련 */}
        {authType === 'sign-up' && (
          <div className="w-full my-[40px] flex flex-col gap-9">
            {/* 이메일 */}
            <div className={'relative flex flex-col gap-5'}>
              <div>
                <i className="absolute flex items-center justify-center -translate-y-1/2 top-1/2 left-5 fi fi-rr-envelope"></i>
                <Input
                  ref={emailRef}
                  type={'email'}
                  placeholder={'이메일'}
                  className={'w-full pl-[3rem] pr-[1.25rem] py-6'}
                  onChange={(e) => {
                    inputChangeHandler(e, emailRegExp, setEmailErr);
                  }}
                />
              </div>
              {emailErr && <p className={'absolute left-0 top-14 text-red-600'}>이메일 형식이 맞지 않습니다</p>}
            </div>
            {/* 비밀번호 */}
            <div className={'relative flex flex-col gap-5'}>
              <div>
                <i className="absolute flex items-center justify-center -translate-y-1/2 top-1/2 left-5 fi fi-rr-lock"></i>
                <Input
                  ref={passwordRef}
                  type={'password'}
                  placeholder={'비밀번호'}
                  className={'w-full pl-[3rem] pr-[1.25rem] py-6'}
                  onChange={(e) => {
                    inputChangeHandler(e, passwordRegExp, setPasswordErr);
                  }}
                />
              </div>
              {passwordErr && <p className={'absolute left-0 top-14 text-red-600'}>비밀번호는 8자 이상이어야 합니다</p>}
            </div>
            {/* 닉네임 */}
            <div className={'relative flex flex-col gap-5'}>
              <div>
                <i className="absolute flex items-center justify-center -translate-y-1/2 top-1/2 left-5 fi fi-rr-id-card-clip-alt"></i>
                <Input
                  ref={nicknameRef}
                  type={'text'}
                  placeholder={'닉네임'}
                  className={'w-full pl-[3rem] pr-[1.25rem] py-6'}
                  onChange={(e) => {
                    inputChangeHandler(e, nicknameRegExp, setNicknameErr);
                  }}
                />
              </div>
              {nicknameErr && <p className={'absolute left-0 top-14 text-red-600'}>닉네입은 8자 이상이어야 합니다</p>}
              {/* 랜덤 닉네임 생성 버튼 */}
              <button
                onClick={randomNicknameClickHandler}
                onMouseEnter={() => setIsTooltipOpen(true)}
                onMouseLeave={() => setIsTooltipOpen(false)}
                className="absolute transition-all duration-300 -translate-y-1/2 bg-gray-200 rounded-full w-7 h-7 top-1/2 right-4 hover:bg-gray-300"
              >
                <i className="flex items-start justify-center fi fi-rr-shuffle"></i>
                {/* 툴팁 */}
                <span
                  className={`absolute left-0 p-3 text-xs text-white bg-gray-800 rounded-md -top-[3rem] whitespace-nowrap transition-opacity duration-300 ${isTooltipOpen ? 'opacity-100' : 'opacity-0'}`}
                >
                  랜덤 닉네임을 추천해드려요
                </span>
              </button>
            </div>
          </div>
        )}

        {/*로그인,회원가입 버튼*/}
        <Button
          className={'w-full py-7 border-gray-400 flex items-center'}
          onClick={() => {
            if (authType === 'sign-in') {
              signInBtnClickHandler();
            }
            if (authType === 'sign-up') {
              signUpBtnClickHandler();
            }
          }}
        >
          {authType === 'sign-in' ? '로그인' : '회원가입'}
        </Button>

        <div className="flex flex-col gap-[20px] items-center mt-[30px]">
          <div className="flex gap-[10px]">
            <p className="text-default-black">
              {authType === 'sign-in' ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}
            </p>
            <button className="font-semibold text-dark-black" onClick={changeAuthType}>
              {`${authType === 'sign-in' ? '회원가입' : '로그인'} 하러 가기 >`}
            </button>
          </div>
          <p className="text-light-black">or</p>
          {/* 구글 계정으로 인증하기 */}
          <Button variant={'outline'} className={'border-gray-400 flex items-center'}>
            <i className="flex items-center justify-center fi fi-brands-google"></i>
            구글 계정으로 인증하기
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Auth;
