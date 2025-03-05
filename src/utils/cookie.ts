import { Cookies } from 'react-cookie';

const cookies = new Cookies();

/**
 * @description isAuth 쿠키 삭제
 */
export const removeIsAuthCookie = () => {
  cookies.remove('isAuth', { path: '/' });
};

/**
 * @param expires - new Date(Date.now() + 1000 * 60 * 60) - 1시간
 * @description 로그인 여부를 판단할 isAuth 쿠키 생성
 */
export const addIsAuthCookie = (expires: Date) => {
  cookies.set('isAuth', true, { expires });
};

/**
 * @returns isAuth 쿠키 여부
 */
export const getIsAuthCookie = () => {
  return !!cookies.get('isAuth');
};
