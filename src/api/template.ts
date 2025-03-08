import { ErrorResponse } from '@/types/common.type';
import axios, { AxiosError, AxiosResponse } from 'axios';

// axios 인터셉터
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 에러가 401 이면 jwt 만료로 인식
      // 로그인 페이지로 이동
      window.alert('로그인이 필요합니다. 다시 로그인 해주세요.');
      window.location.href = '/auth/sign-in?logout=true';
    }
    return error;
  },
);

// ✅ 응답 데이터 추출
export const responseBody = <Data>(response: AxiosResponse<Data>) => response.data;

// ✅ 에러 발생 시 ResponseDto 타입으로 던지기
// 에러 타입 변경을 대비하여 제네릭으로 설정
export const responseError = <Error = ErrorResponse>(error: AxiosError<Error>) => {
  throw error.response?.data ?? { code: 'UNE', message: '알 수 없는 에러 발생' };
};

export const request = {
  /**
   * ✅ GET 요청
   * @param url
   * @param withCredentials default true, 헤더에 jwt 정보 필요 여부에 따라 결정
   * @returns D
   */
  get: <Data>(url: string, withCredentials: boolean = true) =>
    axios.get<Data>(url, { withCredentials }).then(responseBody).catch(responseError),

  /*
   * ✅ GET 요청 (params 포함)
   * @param url
   * @param params
   * @param withCredentials default true, 헤더에 jwt 정보 필요 여부에 따라 결정
   * @returns D
   */
  getWithParams: <Data, Params>(url: string, params: Params, withCredentials: boolean = true) =>
    axios.get<Data>(url, { withCredentials, params }).then(responseBody).catch(responseError),

  /**
   * ✅ 일반적인 POST 요청 (JSON 전송)
   * @param url
   * @param body
   * @param withCredentials default true, 헤더에 jwt 정보 필요 여부에 따라 결정
   * @returns D (default void)
   */
  post: <Body, Data = void>(url: string, body: Body, withCredentials: boolean = true) =>
    axios.post<Data>(url, body, { withCredentials }).then(responseBody).catch(responseError),

  /**
   * ✅ PUT 요청
   * @param url
   * @param withCredentials
   * @returns
   */
  put: <Body, Data = void>(url: string, data: Body | null, withCredentials: boolean = true) =>
    axios.put<Data>(url, data, { withCredentials: withCredentials }).then(responseBody).catch(responseError),

  /**
   * ✅ POST 요청 (FormData 전송)
   * @param url
   * @param formData
   * @param withCredentials default true, 헤더에 jwt 정보 필요 여부에 따라 결정
   * @returns D (default void)
   */
  postFormData: <Data = void>(url: string, formData: FormData, withCredentials: boolean = true) =>
    axios
      .post<Data>(url, formData, {
        withCredentials,
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then(responseBody)
      .catch(responseError),

  /**
   * ✅ PATCH 요청
   * @param url
   * @param body
   * @param withCredentials default true, 헤더에 jwt 정보 필요 여부에 따라 결정
   * @returns D (default void)
   */
  patch: <Body, Data = void>(url: string, body: Body, withCredentials: boolean = true) =>
    axios.patch<Data>(url, body, { withCredentials }).then(responseBody).catch(responseError),

  /**
   * ✅ DELETE 요청
   * @param url
   * @param withCredentials default true, 헤더에 jwt 정보 필요 여부에 따라 결정
   * @returns D (defualt void)
   */
  delete: <Data = void>(url: string, withCredentials: boolean = true) =>
    axios.delete<Data>(url, { withCredentials }).then(responseBody).catch(responseError),

  /**
   * ✅ DELETE 요청(body 포함)
   * @param url
   * @param body
   * @param withCredentials
   * @returns
   */
  deleteWithBody: <Body, Data = void>(url: string, body: Body, withCredentials: boolean = true) =>
    axios.delete<Data>(url, { withCredentials, data: body }).then(responseBody).catch(responseError),
};
