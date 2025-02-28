import { useCookies } from "react-cookie"

// 쿠키의 jwt
export const useJwt = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['jwt']);
    const jwt = cookies.jwt;

    return {jwt, setCookie, removeCookie}
}