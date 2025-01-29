import { BookDetailData, BookPrevData, CommentItem, DeliveryStatus, Meta, OrderDetail, UserItem } from './item.ts';

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

export interface getSearchBookListResponseDto extends ResponseDto {
  meta: Meta;
  bookList: BookPrevData[];
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
