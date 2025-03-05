import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';

export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState<string>(value);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

// 쿠키의 jwt
export const useJwt = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
  const jwt = cookies.jwt;

  return {jwt, setCookie, removeCookie}
}