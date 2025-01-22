import InputBox from '../components/inputBox.tsx';
import { useRef, useState } from 'react';
import Button from '../components/Button.tsx';
import { SignInRequestDto } from '../api/request.dto.ts';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { signInRequest, signUpRequest } from '../api';
import { ResponseDto, SignInResponseDto } from '../api/response.dto.ts';
import { useCookies } from 'react-cookie';
import { InputErrorType } from '../utils/item.ts';

const Auth = () => {
  const { authType } = useParams();
  const navigate = useNavigate();
  const [_, setCookies, deleteCookies] = useCookies();
  const { state } = useLocation();
  const pathname = state ? state.pathname : null;

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
  const [emailErr, setEmailErr] = useState<InputErrorType>({ error: false, message: '' });
  const [passwordErr, setPasswordErr] = useState<InputErrorType>({ error: false, message: '' });
  const [nicknameErr, setNicknameErr] = useState<InputErrorType>({ error: false, message: '' });
  const [addressErr, setAddressErr] = useState<InputErrorType>({ error: false, message: '' });
  const [phoneNumberErr, setPhoneNumberErr] = useState<InputErrorType>({ error: false, message: '' });

  // Functions
  function changeAuthType() {
    if (authType === 'sign-in') {
      navigate('/auth/sign-up');
    } else {
      navigate('/auth/sign-in');
    }
  }

  // Response
  // 로그인 요청
  const signInResponse = async (result: SignInResponseDto | ResponseDto | null) => {
    // 로그인 응답
    if (!result) {
      console.log('네트워크 오류입니다. 관리자에게 문의하세요.');
      return;
    }
    const { code, message } = result as ResponseDto;
    if (code === 'SE' || code === 'NU') {
      console.log(message);
    }
    if (code !== 'SU') {
      // 로그인 실패 시 jwt 쿠키에서 지우기
      deleteCookies('jwt');
      return;
    }

    // jwt 쿠키에 넣기
    const { jwt } = result as SignInResponseDto;
    const now = new Date().getTime();
    const expires = new Date(now + 60 * 60 * 1000); // 1시간
    setCookies('jwt', jwt, { expires, path: '/' });
    console.log(pathname);
    if (pathname) {
      navigate(pathname);
      return;
    }
    navigate('/');
  };

  // Handler
  // 로그인, 회원가입 버튼 클릭 핸들러
  const signInUpButtonClickHandler = async () => {
    // 로그인
    if (!emailRef.current || !passwordRef.current) return;

    if (authType === 'sign-in') {
      if (emailRef.current.value.length === 0) {
        setEmailErr({ error: true, message: '이메일은 필수 입력값입니다.' });
      }
      if (passwordRef.current.value.length === 0) {
        setPasswordErr({ error: true, message: '비밀번호는 필수 입력값입니다.' });
      }

      const isAllInputValid = emailRef.current.value.length && passwordRef.current.value.length;

      const signInRequestDto: SignInRequestDto = {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      };

      if (isAllInputValid) {
        await signInRequest(signInRequestDto).then((result) => signInResponse(result));
      }
    }

    // 회원가입
    if (
      !nicknameRef.current ||
      !passwordRef.current ||
      !addressRef.current ||
      !addressDetailRef.current ||
      !phoneNumberRef.current
    )
      return;

    if (authType === 'sign-up') {
      if (emailRef.current.value.length === 0) {
        setEmailErr({ error: true, message: '이메일은 필수 입력값입니다.' });
      }
      if (passwordRef.current.value.length === 0) {
        setPasswordErr({ error: true, message: '비밀번호는 필수 입력값입니다.' });
      }
      if (nicknameRef.current.value.length === 0) {
        setNicknameErr({ error: true, message: '닉네임은 필수 입력값입니다.' });
      }
      if (addressRef.current.value.length === 0) {
        setAddressErr({ error: true, message: '주소는 필수 입력값입니다.' });
      }
      if (phoneNumberRef.current.value.length === 0) {
        setPhoneNumberErr({ error: true, message: '휴대폰 번호는 필수 입력값입니다.' });
      }

      const isAllInputValid =
        emailRef.current.value.length &&
        passwordRef.current.value.length &&
        nicknameRef.current.value.length &&
        addressRef.current.value.length &&
        phoneNumberRef.current.value.length;

      if (isAllInputValid) {
        console.log('회원가입 요청');
        await signUpRequest({
          email: emailRef.current.value,
          password: passwordRef.current.value,
          nickname: nicknameRef.current.value,
          address: nicknameRef.current.value,
          addressDetail: addressRef.current.value,
          phoneNumber: nicknameRef.current.value,
          role: 'user',
        }).then((result) => {
          if (!result) {
            window.alert('네트워크 오류. 다시 시도해주세요.');
            return;
          }
          const { code } = result;

          if (code === 'EU') {
            window.alert('이미 존재하는 계정입니다.');
          }
          if (code === 'EN') {
            window.alert('이미 존재하는 닉네임입니다.');
          }
          if (code === 'SE' || code === 'DBE') {
            window.alert('서버 에러입니다. 관리자에게 문의하세요.');
          }
          if (code !== 'SU') {
            return;
          }
          navigate('/auth/sign-in');
        });
      } else {
        return;
      }
    }
  };

  // Render
  return (
    <div className="flex flex-col items-center gap-10">
      <span className={'text-xl font-bold'}>{authType === 'sign-in' ? '로그인' : '회원가입'}</span>
      <div className="w-full max-w-[330px] mb-[30px] flex flex-col gap-[20px]">
        <InputBox
          ref={emailRef}
          type={'email'}
          placeholder={'이메일을 입력해 주세요.'}
          name={'이메일'}
          error={emailErr}
          setError={setEmailErr}
          regExg={emailRegExp}
        />
        <InputBox
          ref={passwordRef}
          type={'password'}
          placeholder={'비밀번호를 입력해 주세요.'}
          name={'비밀번호'}
          error={passwordErr}
          setError={setPasswordErr}
          regExg={passwordRegExp}
        />
        {authType === 'sign-up' && (
          <>
            <InputBox
              ref={nicknameRef}
              type={'text'}
              placeholder={'닉네임을 입력해 주세요.'}
              name={'닉네임'}
              error={nicknameErr}
              setError={setNicknameErr}
              regExg={nicknameRegExp}
            />

            <InputBox
              ref={addressRef}
              type={'text'}
              placeholder={'주소를 입력해 주세요.'}
              name={'주소'}
              error={addressErr}
              setError={setAddressErr}
            />

            <InputBox
              ref={addressDetailRef}
              type={'text'}
              placeholder={'상세주소를 입력해 주세요.'}
              name={'상세주소'}
            />

            <InputBox
              ref={phoneNumberRef}
              type={'text'}
              placeholder={'휴대폰 번호 숫자만 입력해 주세요.'}
              name={'휴대폰 번호'}
              error={phoneNumberErr}
              setError={setPhoneNumberErr}
              regExg={phoneNumberRegExp}
            />
          </>
        )}
      </div>
      {/*로그인,회원가입 버튼*/}
      <div className="w-full max-w-[330px] mb-[20px]" onClick={signInUpButtonClickHandler}>
        <Button
          name={authType === 'sign-in' ? '로그인' : '회원가입'}
          bgColor="bg-black"
          bgOpacity={60}
          bgHoverOpacity={80}
          textColor="text-white"
          textSize="md"
        />
      </div>
      <div className="flex flex-col gap-[20px] text-sm items-center">
        <div className="flex gap-[10px]">
          <p className="text-default-black">
            {authType === 'sign-in' ? '아직 계정이 없으신가요?' : '이미 계정이 있으신가요?'}
          </p>
          <button className="text-dark-black font-semibold" onClick={changeAuthType}>
            {`${authType === 'sign-in' ? '회원가입' : '로그인'} 하러 가기 >`}
          </button>
        </div>
        <p className="text-light-black">or</p>
        <button className="flex gap-[5px] rounded-[5px] border-[0.5px] border-black border-opacity-40 px-[10px] py-[5px] hover:bg-black hover:bg-opacity-10 transition duration-100">
          <i className="fi fi-brands-google"></i>
          <p>구글 계정으로 인증하기</p>
        </button>
      </div>
    </div>
  );
};

export default Auth;
