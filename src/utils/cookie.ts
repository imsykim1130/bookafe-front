import { Cookies } from 'react-cookie';
const cookies = new Cookies();

// 쿠키에서 토큰 삭제
export const removeJwt = () => {
  cookies.remove('jwt', { path: '/' });
};

// 쿠키에서 토큰 가져오기
export const getJwt = () => {
  return cookies.get('jwt');
};
