import { signInRequest, signUpRequest } from '@/api/api';
import { SignInRequestDto, SignUpRequestDto } from '@/api/request.dto';
import { ResponseDto, SignInResponseDto } from '@/api/response.dto';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { getRandomNickname } from '@/utils';
import moment from 'moment';
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const Auth = () => {
  // index: top
  const { authType } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const pathname = state ? state.pathname : null;
  const [,setCookie] = useCookies(['jwt']);
  
  // Ref
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const addressDetailRef = useRef<HTMLInputElement>(null);
  const phoneNumberRef = useRef<HTMLInputElement>(null);

  // RegExp
  const emailRegExp = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$');
  const passwordRegExp = new RegExp('^.{8,20}$');
  const nicknameRegExp = new RegExp('^.{8,20}$');
  const phoneNumberRegExp = new RegExp('^01[0-9]([0-9]{3,4})([0-9]{4})$');

  // Error state
  const [emailErr, setEmailErr] = useState<boolean>(false);
  const [passwordErr, setPasswordErr] = useState<boolean>(false);
  const [nicknameErr, setNicknameErr] = useState<boolean>(false);
  const [addressErr, setAddressErr] = useState<boolean>(false);
  const [phoneNumberErr, setPhoneNumberErr] = useState<boolean>(false);

  const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false);

  // function: 로그인 / 회원가입 페이지 이동
  function changeAuthType() {
    if (authType === 'sign-in') {
      navigate('/auth/sign-up');
    } else {
      navigate('/auth/sign-in');
    }
  }

  // function: 로그인
  const signIn = () => {
    if (!emailRef.current || !passwordRef.current || emailErr || passwordErr) return;
    const requestDto: SignInRequestDto = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    };

    signInRequest(requestDto).then((response) => {
      // 네트워크 에러
      if (!response) {
        window.alert('네트워크 에러. 관리자에게 문의하세요');
        return;
      }

      const { code, message } = response as ResponseDto;

      // 로그인 실패
      if (code !== 'SU') {
        window.alert(message);
        return;
      }

      // 로그인 성공
      const { jwt } = response as SignInResponseDto;
      const expire = moment().add(1, "hour").toDate(); // 유효시간 1시간
      setCookie("jwt", jwt, {path: "/", expires : expire});

      // 페이지 이동
      if (pathname) {
        navigate(pathname);
        return;
      }
      navigate("/");
    });
  };

  // function: 정규표현식 검증
  const validate = (regExp: RegExp, item: string) => {
    return regExp.test(item);
  };

  // function: 회원가입
  function signUp() {
    // ref 여부 검증
    if (
      !emailRef.current ||
      !passwordRef.current ||
      !nicknameRef.current ||
      !addressRef.current ||
      !addressDetailRef.current ||
      !phoneNumberRef.current
    ) {
      return;
    }

    // 에러가 하나라도 있으면 회원가입 불가
    if (addressRef.current.value === '') {
      setAddressErr(true);
    }

    if (emailRef.current.value === '') {
      setEmailErr(true);
    }

    if (passwordRef.current.value === '') {
      setPasswordErr(true);
    }
    if (nicknameRef.current.value === '') {
      setNicknameErr(true);
    }

    if (phoneNumberRef.current.value === '') {
      setPhoneNumberErr(true);
    }

    if (
      addressRef.current.value === '' ||
      emailRef.current.value === '' ||
      nicknameRef.current.value === '' ||
      phoneNumberRef.current.value === ''
    ) {
      return;
    }

    const requestDto: SignUpRequestDto = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      nickname: nicknameRef.current.value,
      address: addressRef.current.value,
      addressDetail: addressDetailRef.current.value,
      phoneNumber: phoneNumberRef.current.value,
      role: 'user',
    };
    signUpRequest(requestDto).then((response) => {
      if (!response) {
        window.alert('서버 에러');
      }
      const { code, message } = response as ResponseDto;
      if (code !== 'SU') {
        window.alert(message);
        return;
      }
      window.alert('회원가입 성공!');
      navigate('/auth/sign-in');
    });
  }

  // function: 값이 변경될 때 마다 정규표현식 검증을 통해 에러 여부 결정
  const inputChangeHandler = (
    event: ChangeEvent<HTMLInputElement>,
    regExp: RegExp,
    setErr: Dispatch<SetStateAction<boolean>>,
  ) => {
    const value = event.target.value;
    const isValid = validate(regExp, value);

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

  // 랜덤 닉네임 생성 버튼 클릭 핸들러
  const randomNicknameClickHandler = () => {
    getRandomNickname().then((res) => {
      if (!res) return;
      if (!nicknameRef.current) return;
      console.log(res);
      nicknameRef.current.value = res;

      // 생성된 닉네임 길이 검증
      const isValid = validate(nicknameRegExp, res);
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
            {/* 주소 */}
            <div className={'relative flex flex-col gap-5'}>
              <div>
                <i className="absolute flex items-center justify-center -translate-y-1/2 top-1/2 left-5 fi fi-rr-postal-address"></i>
                <Input
                  ref={addressRef}
                  type={'text'}
                  placeholder={'주소'}
                  className={'w-full pl-[3rem] pr-[1.25rem] py-6'}
                  onChange={() => {
                    setAddressErr(false);
                  }}
                />
              </div>
              {addressErr && <p className={'absolute left-0 top-14 text-red-600'}>주소는 필수 입력사항입니다</p>}
            </div>
            {/* 상세주소 */}
            <div className={'relative flex flex-col gap-5'}>
              <div>
                <i className="absolute flex items-center justify-center -translate-y-1/2 top-1/2 left-5 fi fi-rr-postal-address"></i>
                <Input
                  ref={addressDetailRef}
                  type={'text'}
                  placeholder={'상세주소'}
                  className={'w-full pl-[3rem] pr-[1.25rem] py-6'}
                />
              </div>
            </div>
            {/* 휴대폰번호 */}
            <div className={'relative flex flex-col gap-5'}>
              <div>
                <i className="absolute flex items-center justify-center -translate-y-1/2 top-1/2 left-5 fi fi-rr-mobile-notch"></i>
                <Input
                  ref={phoneNumberRef}
                  type={'text'}
                  placeholder={'휴대폰번호'}
                  className={'w-full pl-[3rem] pr-[1.25rem] py-6'}
                  onChange={(e) => {
                    inputChangeHandler(e, phoneNumberRegExp, setPhoneNumberErr);
                  }}
                />
              </div>
              {phoneNumberErr && <p className={'absolute left-0 top-14 text-red-600'}>정확한 번호를 입력해주세요</p>}
            </div>
          </div>
        )}

        {/*로그인,회원가입 버튼*/}
        <Button
          className={'w-full py-7 border-gray-400 flex items-center'}
          onClick={() => {
            if (authType === 'sign-in') {
              signIn();
            }
            if (authType === 'sign-up') {
              signUp();
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
