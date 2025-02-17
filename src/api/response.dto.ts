import { DeliveryInfoItem } from '@/api/item.ts';
import {
  BookDetailData,
  BookSearchItem,
  CommentItem,
  CouponData,
  DeliveryStatus,
  OrderDetail,
  UserItem,
} from './item.ts';

export interface ResponseDto {
  code: string;
  message: string;
}

export interface SignInResponseDto extends Response {
  jwt: string;
  userItem: UserItem;
}

export interface GetUserResponseDto extends ResponseDto {
  user: UserItem;
  totalPoint: number;
}

export interface GetSearchBookListResponseDto extends ResponseDto {
  isEnd: boolean;
  pageableCount: number;
  totalCount: number;
  bookList: BookSearchItem[];
}

export interface GetBookResponseDto extends ResponseDto {
  book: BookDetailData;
}

export interface GetBookFavoriteUserIdListResponseDto extends ResponseDto {
  userIdList: string[];
}

export interface GetBookCartUserIdListResponseDto extends ResponseDto {
  userIdList: string[];
}

export interface GetCommentListResponse extends ResponseDto {
  commentItemList: CommentItem[];
}

export interface GetOrderDetailListResponseDto {
  isStart: boolean;
  isEnd: boolean;
  orderDetailList: OrderDetail[];
}

export interface GetDeliveryStatusListResponseDto {
  isFirst: boolean;
  isLast: boolean;
  deliveryStatusViewList: DeliveryStatus[];
}

export interface getCouponListResponseDto extends ResponseDto {
  userCouponViewList: CouponData[];
}

export interface GetDeliveryInfoResponseDto extends ResponseDto {
  userDeliveryInfo: DeliveryInfoItem | null;
}
export interface GetAllDeliveryInfoResponseDto extends ResponseDto {
  userDeliveryInfoList: DeliveryInfoItem[];
}
