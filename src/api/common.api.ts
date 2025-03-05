import { DOMAIN } from '@/utils/env.ts';
import axios, { AxiosError } from 'axios';
import moment from 'moment';
import { PostCommentRequestDto } from './comment.api.ts';
import {
  CartBookData,
  CommentItem,
  CouponData,
  OrderInfoData,
  PointLogItem,
  RecommendBookItem,
  TodayBookInterface,
  Top10BookItem,
  UserManagementItem,
} from './item.ts';
import { getSearchBookListRequestDto, PostOrderRequestDto, SignInRequestDto, SignUpRequestDto } from './request.dto.ts';
import {
  GetAllDeliveryInfoResponseDto,
  getCouponListResponseDto,
  GetDeliveryStatusListResponseDto,
  GetOrderDetailListResponseDto,
  GetSearchBookListResponseDto,
  ResponseDto,
  SignInResponseDto,
} from './response.dto.ts';

const signInUrl = `${DOMAIN}/auth/sign-in`;
const signUpUrl = `${DOMAIN}/auth/sign-up`;
const getUserUrl = `${DOMAIN}/user`;
const getSearchBookUrl = `${DOMAIN}/books/search`;

// 로그인
export const signInRequest = async (requestDto: SignInRequestDto) => {
  return await axios
    .post(signInUrl, requestDto)
    .then((res): SignInResponseDto => {
      return res.data;
    })
    .catch((err): ResponseDto | null => {
      if (!err.response) return null;
      return err.response.data;
    });
};

// 회원가입
export const signUpRequest = async (requestDto: SignUpRequestDto) => {
  return await axios
    .post(signUpUrl, requestDto)
    .then((res): ResponseDto => {
      return res.data;
    })
    .catch((err): ResponseDto | null => {
      if (!err.response) return null;
      return err.response.data;
    });
};

export const getUserRequest = async (jwt: string) => {
  return await axios.get(getUserUrl, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
};

export const getSearchBookRequest = async (requestParams: getSearchBookListRequestDto) => {
  return await axios.get(getSearchBookUrl, {
    params: requestParams,
  });
};

// 추천 키워드로 책 가져오기
export const getSearchBookListRequest = async (requestParams: getSearchBookListRequestDto) => {
  return await axios
    .get(getSearchBookUrl, {
      params: requestParams,
    })
    .then((res): GetSearchBookListResponseDto => {
      // 응답 데이터 반환
      return res.data;
    })
    .catch((err): ResponseDto | null => {
      // 응답이 없으면 null 반환
      if (!err.response) return null;
      // 에러 응답 데이터 반환
      return err.response.data;
    });
};

// 장바구니 책 리스트 가져오기
export const getCartBookListRequest = async (jwt: string) => {
  return axios
    .get('http://localhost:8080/api/v1/cart/list', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then((res): CartBookData[] => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.response.data);
      return null;
    });
};

// 장바구니 수량 변경
export const changeCartBookCountRequest = async (jwt: string, isbn: string, count: number) => {
  return await axios
    .patch(
      'http://localhost:8080/api/v1/cart/count',
      {
        isbn,
        count,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    )
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      return false;
    });
};

// 장바구니 책 삭제
export const deleteCartBookRequest = async (jwt: string, isbn: string) => {
  return await axios
    .delete(`http://localhost:8080/api/v1/cart/${isbn}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then(async (res) => {
      const { message } = res.data;
      console.log(message);
      return true;
    })
    .catch((err) => {
      const { message } = err.response.data;
      console.log(message);
      return false;
    });
};

// 주문하기
export const createOrderRequest = async (jwt: string, requestDto: PostOrderRequestDto) => {
  return await axios
    .post(`http://localhost:8080/api/v1/order`, requestDto, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      return false;
    });
};

// 보유 포인트 가져오기
export const getTotalPointRequest = async (token: string): Promise<number | null> => {
  return await axios
    .get('http://localhost:8080/api/v1/point/total', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.response.data);
      return null;
    });
};

// 보유 쿠폰 가져오기
export const getCouponListRequest = async (token: string) => {
  return await axios
    .get('http://localhost:8080/api/v1/coupon/all', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res): CouponData[] => {
      const { userCouponViewList } = res.data as getCouponListResponseDto;
      return userCouponViewList;
    })
    .catch((err) => {
      console.log(err.response.data);
      return null;
    });
};

// 주문 완료 장바구니 책 리스트 삭제
export const deleteOrderSuccessCartBookListRequest = async (jwt: string, cartBookIdList: number[]) => {
  return await axios
    .delete(`http://localhost:8080/api/v1/cart/list`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      data: {
        cartBookIdList,
      },
    })
    .then(() => true)
    .catch((err) => {
      console.log(err.response.data);
      return false;
    });
};

// 주문 내역 불러오기
export const getOrderDetailListRequest = async (
  jwt: string,
  start: Date,
  end: Date,
  orderStatus: string,
  page: number,
) => {
  return await axios
    .get(`http://localhost:8080/api/v1/order/details`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      params: {
        start: moment(start).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(end).format('YYYY-MM-DD HH:mm:ss'),
        orderStatus,
        page,
      },
    })
    .then((res): GetOrderDetailListResponseDto => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.response.data);
      return null;
    });
};

// 주문 취소하기
export const cancelOrderRequest = async (jwt: string, orderId: number) => {
  return await axios
    .delete(`http://localhost:8080/api/v1/order/${orderId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      return false;
    });
};

// 배송정보 리스트 가져오기
export const getDeliveryStatusListRequest = async (orderStatus: string, datetime: Date, jwt: string, page: number) => {
  return await axios
    .get('http://localhost:8080/api/v1/order/delivery-status-list', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      params: {
        orderStatus,
        datetime: moment(datetime).format('YYYY-MM-DD HH:mm:ss'),
        page,
      },
    })
    .then((res): GetDeliveryStatusListResponseDto => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.response.data);
      return null;
    });
};

// 배송상태 변경하기
export const changeDeliveryStatusRequest = async (orderId: number, orderStatus: string, jwt: string) => {
  return await axios
    .patch(
      `http://localhost:8080/api/v1/order/delivery-status`,
      {
        orderId,
        orderStatus,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    )
    .then((res): string => res.data)
    .catch((err) => {
      console.log(err.response.data);
      return null;
    });
};

// 배송 완료 시 포인트 적립하기
export const earnPointRequest = async (jwt: string, orderId: number) => {
  return await axios
    .post(`http://localhost:8080/api/v1/order/earn-point/${orderId}`, null, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then((res) => {
      console.log('saved point: ' + res.data);
    })
    .catch((err) => {
      console.log(err.response.data);
    });
};

// 좋아요 책 장바구니 담기
export const moveFavoriteBookToCartRequest = async (jwt: string, isbn: string) => {
  return await axios
    .put(`http://localhost:8080/api/v1/cart/${isbn}`, null, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      return false;
    });
};

// 포인트 로그 가져오기
export const getPointLogListRequest = async (
  token: string,
  start: Date,
  end: Date,
  pageNumber: number,
  type: string,
) => {
  return await axios
    .get('http://localhost:8080/api/v1/point/history', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        start: moment(start).format('YYYY-MM-DD HH:mm:ss'),
        end: moment(end).format('YYYY-MM-DD HH:mm:ss'),
        pageNumber,
        type,
      },
    })
    .then(
      (
        res,
      ): {
        first: boolean;
        last: boolean;
        pointLogList: PointLogItem[];
      } => {
        console.log(res.data);
        return res.data;
      },
    )
    .catch((err) => {
      console.log(err.response.data);
      return null;
    });
};

// 추천 책 여부
export const getRecommendedRequest = async (jwt: string, isbn: string) => {
  return await axios
    .get('http://localhost:8080/api/v1/recommend-book/is-recommended', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      params: {
        isbn,
      },
    })
    .then((res): boolean => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.response.data);
      return null;
    });
};

// 추천 책 등록하기
export const registerRecommendBookRequest = async (jwt: string, isbn: string) => {
  console.log('추천 책 등록하기 쿼리');
  return await axios
    .post('http://localhost:8080/api/v1/recommend-book/' + isbn, null, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then((): true => {
      return true;
    })
    .catch((err): false => {
      console.log(err.response.data);
      return false;
    });
};

// 추천 책 삭제하기
export const deleteRecommendBookRequest = async (jwt: string, isbn: string) => {
  return await axios
    .delete(`http://localhost:8080/api/v1/recommend-book/${isbn}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then((): true => {
      return true;
    })
    .catch((err): false => {
      console.log(err.response.data);
      return false;
    });
};

// 추천 책 가져오기
export const getAllRecommendBookRequest = async (jwt: string) => {
  return await axios
    .get('http://localhost:8080/api/v1/recommend-book/all', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then((res): RecommendBookItem[] => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.response.data);
      return null;
    });
};

// 유저 검색
export const searchUserRequest = async (jwt: string, searchWord: string) => {
  return await axios
    .get('http://localhost:8080/api/v1/user/search', {
      params: {
        searchWord: searchWord,
      },
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then((res): UserManagementItem[] => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.response.data);
      return null;
    });
};

// 유저 탈퇴
export const deleteUserRequest = async (jwt: string, id: number) => {
  return await axios
    .delete(`http://localhost:8080/api/v1/user/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then(() => {
      return true;
    })
    .catch((err) => {
      console.log(err.response.data);
      return false;
    });
};

// 장바구니 여부 가져오기
export const getIsCartRequest = async (jwt: string, isbn: string) => {
  return await axios
    .get(`http://localhost:8080/api/v1/cart/${isbn}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.response.data);
      return null;
    });
};

// 장바구니 담기
export const putBookToCartRequest = async (jwt: string, isbn: string) => {
  return await axios
    .put(`http://localhost:8080/api/v1/cart/${isbn}`, null, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then(() => true)
    .catch((err) => {
      console.log(err.response.data);
      return false;
    });
};

// 장바구니 빼기
export const deleteBookFromCartRequest = async (jwt: string, isbn: string) => {
  return await axios
    .delete(`http://localhost:8080/api/v1/cart/${isbn}`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then(() => true)
    .catch((err) => {
      console.log(err.response.data);
      return false;
    });
};

// 주소, 상세주소, 휴대폰번호 가져오기
export const getOrderInfoRequest = async (jwt: string) => {
  return await axios
    .get('http://localhost:8080/api/v1/user/order-info', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then((res): OrderInfoData => {
      return res.data;
    })
    .catch((err) => {
      console.log(err.response.data);
      return null;
    });
};

// 댓글 달기
export const postCommentRequest = async (jwt: string, requestDto: PostCommentRequestDto) => {
  return await axios
    .post(`http://localhost:8080/api/v1/comment`, requestDto, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then(() => true)
    .catch((error) => {
      console.log(error.response.data);
      throw error;
    });
};

// 댓글 가져오기
export const getCommentListRequest = async (isbn: string) => {
  console.log('리뷰 가져오기');
  return await axios
    .get('http://localhost:8080/api/v1/comment/list/' + isbn)
    .then((res): CommentItem[] => res.data)
    .catch((err) => {
      console.log(err.response.data);
      throw err;
    });
};

// 리플 가져오기
export const getReplyListRequest = async (parentCommentId: number) => {
  console.log('리플 가져오기');
  return await axios
    .get('http://localhost:8080/api/v1/comment/reply/list/' + parentCommentId)
    .then((res): CommentItem[] => res.data)
    .catch((err) => {
      console.log(err.response.data);
      return null;
    });
};

// 댓글 수정하기
export const modifyCommentRequest = async (jwt: string, commentId: number, content: string) => {
  return await axios
    .patch(
      `http://localhost:8080/api/v1/comment`,
      {
        content,
        commentId,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    )
    .then((res): string => res.data)
    .catch((err) => {
      console.log(err.response.data);
      return null;
    });
};

// 댓글 삭제하기
export const deleteCommentRequest = async (jwt: string, commentId: number) => {
  return await axios
    .delete('http://localhost:8080/api/v1/comment/' + commentId, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then(() => true)
    .catch((err) => {
      console.log(err.response.data);
      return false;
    });
};

// 프로필 이미지 변경
export const changeProfileImgRequest = async (jwt: string, imageFile: File) => {
  const form = new FormData();
  form.append('file', imageFile);

  return await axios
    .post('http://localhost:8080/api/v1/user/profile-image', form, {
      headers: {
        Authorization: `Bearer ${jwt}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((res): string => res.data)
    .catch((err) => {
      console.log(err.response.data);
      return null;
    });
};

export interface GetRecommendBookResponseDto extends ResponseDto {
  todayBook: TodayBookInterface;
}

// 오늘의 책 가져오기
export const getRecommendBookRequest = async (): Promise<GetRecommendBookResponseDto | ResponseDto | null> => {
  return await axios
    .get(DOMAIN + '/book/today')
    .then((res): GetRecommendBookResponseDto => res.data)
    .catch((err: AxiosError): ResponseDto | null => {
      console.log(err.response);
      if (!err.response) {
        return null;
      }
      return err.response.data as ResponseDto;
    });
};

// 댓글 좋아요 누르기
export const putCommentFavoriteRequest = async (jwt: string, commentId: number) => {
  return await axios
    .post(DOMAIN + '/comment/favorite/' + commentId, null, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then(() => true)
    .catch((err) => {
      console.log(err.response.data);
      return false;
    });
};

// 댓글 좋아요 취소
export const cancelCommentFavoriteRequest = async (jwt: string, commentId: number) => {
  return await axios
    .delete(DOMAIN + '/comment/favorite/' + commentId, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then(() => true)
    .catch((err) => {
      console.log(err.response.data);
      return false;
    });
};

// 댓글 좋아요 여부
export const getIsCommentFavoriteRequest = async (jwt: string, commentId: number) => {
  return await axios
    .get('http://localhost:8080/api/v1/comment/is-favorite/' + commentId, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then((res): boolean => res.data)
    .catch((err) => {
      console.log(err.response.data);
      return null;
    });
};

// 댓글 좋아요 개수
export const getCommentFavoriteRequest = async (commentId: number) => {
  return await axios
    .get('http://localhost:8080/api/v1/comment/favorite/count/' + commentId)
    .then((res): number => res.data)
    .catch((err) => {
      console.log(err.response.data);
      return null;
    });
};

// top10 가져오기
export const getTop10BookListRequest = async () => {
  return await axios
    .get(DOMAIN + '/favorite/top10')
    .then((res): Top10BookItem[] => res.data)
    .catch((err) => {
      console.log(err.response.data);
      return null;
    });
};

// 유저 기본 배송정보 가져오기
export const getDeliveryInfoRequest = async (jwt: string) => {
  return await axios.get('http://localhost:8080/api/v1/user/delivery-info', {
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  });
};

// 유저 배송정보 모두 가져오기
export const getAllDeliveryInfoRequest = async (jwt: string) => {
  return await axios
    .get('http://localhost:8080/api/v1/user/delivery-info/all', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then((res) => {
      const { userDeliveryInfoList } = res.data as GetAllDeliveryInfoResponseDto;
      return userDeliveryInfoList;
    })
    .catch((err) => {
      console.log(err.response.data.message);
      return null;
    });
};
