import { Dispatch, forwardRef, SetStateAction, useEffect, useState } from 'react';
import { Address, useDaumPostcodePopup } from 'react-daum-postcode';
import { InputErrorType } from '../utils/item.ts';
import { useLocation } from 'react-router-dom';

interface InputBoxProps {
  type: 'text' | 'password' | 'email';
  name: string;
  placeholder: string;
  error?: InputErrorType;
  setError?: Dispatch<SetStateAction<InputErrorType>>;
  regExg?: RegExp;
  receivedValue?: string | null;
}

const InputBox = forwardRef<HTMLInputElement, InputBoxProps>((props, ref) => {
  const { type, name, placeholder, error, setError, regExg, receivedValue } = props;
  const [value, setValue] = useState<string>('');
  const { pathname } = useLocation();

  const messages = {
    email: '이메일 형식이 잘못되었습니다.',
    password: '비밀번호는 8 ~ 20 자 이내로 작성해주세요.',
    nickname: '닉네임은 8 ~ 20 자 이내로 작성해주세요.',
    phoneNumber: '휴대폰 번호를 다시 확인해주세요.',
  };

  const errorReset = () => {
    if (!error || !setError) return;
    if (name === '이메일') {
      setError({ ...error, error: false, message: messages.email });
    }
    if (name === '비밀번호') {
      setError({ ...error, error: false, message: messages.password });
    }
    if (name === '닉네임') {
      setError({ ...error, error: false, message: messages.nickname });
    }
    if (name === '휴대폰 번호') {
      setError({ ...error, error: false, message: messages.phoneNumber });
    }
  };

  useEffect(() => {
    errorReset();
  }, [pathname]);

  useEffect(() => {
    if (receivedValue) {
      setValue(receivedValue);
    }
  }, [receivedValue]);

  // 다음 주소 검색 팝업
  const daumPostcodePopup = useDaumPostcodePopup();

  // 다음 주소 검색 완료
  const onComplete = (data: Address) => {
    const { address } = data;
    setValue(address);
  };

  return (
    <div className="flex flex-col gap-[5px] text-md text-dark-black w-full">
      <label htmlFor={name}>{name}</label>
      <input
        ref={ref}
        id={name}
        type={type}
        value={value}
        className="px-[20px] py-[15px] rounded-[5px] border-[1px] border-black border-opacity-[15%] focus:outline-black"
        placeholder={placeholder}
        onChange={(event) => {
          const currentValue = event.target.value;
          setValue(currentValue);

          if (!regExg || setError === undefined || error === undefined) return;
          const isValid = regExg.test(currentValue);
          if (isValid || !currentValue.length) {
            setError({ ...error, error: false });
          } else {
            setError({ ...error, error: true });
          }
        }}
        onClick={() => {
          errorReset();
          if (name !== '주소') return;
          daumPostcodePopup({ onComplete });
          if (!error || !setError) return;
          setError({ ...error, error: false });
        }}
      />
      {error && error.error ? <p className="text-red-500">{error.message}</p> : ''}
    </div>
  );
});

export default InputBox;
