export interface UserItem {
  id: number;
  email: string;
  nickname: string;
  profileImg: string;
  createDate: string;
  role: string;
}

export interface Meta {
  pageable_count: number;
  total_count: number;
  is_end: boolean;
}

export interface BookPrevData {
  isbn: string;
  bookImg: string;
  title: string;
  author: string;
  price: number;
  discountPercent: number;
}

export interface BookSearchItem {
  isbn: string;
  bookImg: string;
  title: string;
  author: string;
  price: string;
}

export interface FavoriteBookItem {
  id: number;
  isbn: string;
  bookImg: string;
  title: string;
  author: string;
  price: number;
  discountPercent: number;
  isCart: boolean;
}

export interface BookDetailData {
  isbn: string;
  bookImg: string;
  title: string;
  price: number;
  publisher: string;
  author: string;
  pubDate: string;
  description: string;
}

export interface orderBookItem {
  isbn: string;
  count: number;
}

export interface UserBookInfo {
  isFavorite: boolean;
  isCart: boolean;
}

export interface CommentItem {
  id: number;
  profileImg: string;
  nickname: string;
  writeDate: string;
  emoji: string;
  content: string;
  replyCount: number;
  isDeleted: boolean;
}

export interface OrderInfoData {
  address: string;
  addressDetail: string;
  phoneNumber: string;
}

export interface CouponData {
  id: number;
  name: string;
  discountPercent: number;
}

export interface CartBookData {
  id: number;
  count: number;
  discountPercent: number;
  title: string;
  price: number;
  author: string;
  isbn: string;
  bookImg: string;
}

export interface OrderBookView {
  title: string;
  count: number;
  price: number;
}

export interface OrderDetail {
  orderId: number;
  orderDatetime: string;
  orderStatus: '배송준비중' | '배송중' | '배송완료';
  orderBookViewsList: OrderBookView[];
}

export interface DeliveryStatus {
  orderId: number;
  email: string;
  orderDate: string;
  orderStatus: string;
}

export interface PointLogItem {
  name: string;
  point: number;
}

export interface RecommendBookItem {
  id: number;
  title: string;
  publisher: string;
  author: string;
  bookImg: string;
  isbn: string;
}

export interface UserManagementItem {
  id: number;
  email: string;
  datetime: string;
  point: number;
  commentCount: number;
}

export interface TodayBookInterface {
  title: string;
  author: string;
  isbn: string;
  bookImg: string;
  favoriteComment: string;
}

export interface Top10BookItem {
  isbn: string;
  bookImg: string;
  title: string;
  author: string;
  favoriteCount: number;
}

export interface DeliveryInfoItem {
  name: string;
  isDefault: boolean;
  receiver: string;
  receiverPhoneNumber: string;
  address: string;
  addressDetail: string;
}
