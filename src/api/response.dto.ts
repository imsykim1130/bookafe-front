import { Alarm, FavoriteBook, FavoriteUser, MyReview, ReviewFavoriteUser, SearchBook } from '@/types/item.ts';

export type BookResponse = {
  isbn: string;
  bookImg: string;
  title: string;
  price: number;
  publisher: string;
  author: string;
  pubDate: string;
  description: string;
};

export type RecommendBookResponse = {
  id: number;
  title: string;
  publisher: string;
  author: string;
  bookImg: string;
  isbn: string;
};

export type SearchBookListResponse = {
  isEnd: boolean;
  pageableCount: number;
  totalCount: number;
  bookList: SearchBook[];
};

export type MyReviewListResponse = {
  reviewList: MyReview[];
  isEnd: boolean;
  totalCount: number;
};

export type ReviewFavoriteUserListResonse = {
  userList: ReviewFavoriteUser[];
  isEnd: boolean;
  totalCount: number;
};

export type FavoriteBookResponse = {
  favoriteBookList: FavoriteBook[];
  isEnd: boolean;
  totalPages: number;
};

export type UserResponse = {
  id: number;
  email: string;
  nickname: string;
  profileImg: string;
  createDate: string;
  role: string;
};

export type FavoriteUserListResponse = {
  favoriteUserList: FavoriteUser[];
  isEnd: boolean;
  totalPage: number;
};

export type AlarmResponse = {
  notifications: Alarm[];
  isEnd : boolean;
}