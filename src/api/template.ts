import { ErrorResponse } from '@/types/common.type';
import axios, { AxiosError, AxiosResponse } from 'axios';

// ✅ 응답 데이터 추출
export const responseBody = <D>(response: AxiosResponse<D>) => response.data;

// ✅ 에러 발생 시 ResponseDto 타입으로 던지기
// 에러 타입 변경을 대비하여 제네릭으로 설정
export const responseError = <E = ErrorResponse>(error: AxiosError<E>) => {
  throw error.response?.data ?? { code: 'UNE', message: '알 수 없는 에러 발생' };
};

export const request = {
  /**
   * ✅ GET 요청
   * @param url
   * @param withCredentials default true, 헤더에 jwt 정보 필요 여부에 따라 결정
   * @returns D
   */
  get: <D>(url: string, withCredentials: boolean = true) =>
    axios.get<D>(url, { withCredentials }).then(responseBody).catch(responseError),

  /*
   * ✅ GET 요청 (params 포함)
   * @param url
   * @param params
   * @param withCredentials default true, 헤더에 jwt 정보 필요 여부에 따라 결정
   * @returns D
   */
  getWithParams: <D, P>(url: string, params: P, withCredentials: boolean = true) =>
    axios.get<D>(url, { withCredentials, params }).then(responseBody).catch(responseError),

  /**
   * ✅ 일반적인 POST 요청 (JSON 전송)
   * @param url
   * @param body
   * @param withCredentials default true, 헤더에 jwt 정보 필요 여부에 따라 결정
   * @returns D (default void)
   */
  post: <B, D = void>(url: string, body: B, withCredentials: boolean = true) =>
    axios.post<D>(url, body, { withCredentials }).then(responseBody).catch(responseError),

  /**
   * ✅ PUT 요청
   * @param url
   * @param withCredentials
   * @returns
   */
  put: <B, D = void>(url: string, data: B | null, withCredentials: boolean = true) =>
    axios.put<D>(url, data, { withCredentials: withCredentials }).then(responseBody).catch(responseError),

  /**
   * ✅ POST 요청 (FormData 전송)
   * @param url
   * @param formData
   * @param withCredentials default true, 헤더에 jwt 정보 필요 여부에 따라 결정
   * @returns D (default void)
   */
  postFormData: <D = void>(url: string, formData: FormData, withCredentials: boolean = true) =>
    axios
      .post<D>(url, formData, {
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
  patch: <B, D = void>(url: string, body: B, withCredentials: boolean = true) =>
    axios.patch<D>(url, body, { withCredentials }).then(responseBody).catch(responseError),

  /**
   * ✅ DELETE 요청
   * @param url
   * @param withCredentials default true, 헤더에 jwt 정보 필요 여부에 따라 결정
   * @returns D (defualt void)
   */
  delete: <D = void>(url: string, withCredentials: boolean = true) =>
    axios.delete<D>(url, { withCredentials }).then(responseBody).catch(responseError),
};
