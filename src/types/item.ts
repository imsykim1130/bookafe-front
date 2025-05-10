export type BookSearchItem = {
  isbn: string;
  bookImg: string;
  title: string;
  author: string;
  price: string;
};

export type RecommendBookItem = {
  id: number;
  title: string;
  publisher: string;
  author: string;
  bookImg: string;
  isbn: string;
};

export type UserManagementItem = {
  id: number;
  email: string;
  datetime: string;
  point: number;
  commentCount: number;
};

export type SearchBook = {
  isbn: string;
  bookImg: string;
  title: string;
  author: string;
  price: string;
};

export type Comment = {
  id: number;
  userId: number;
  profileImg: string;
  nickname: string;
  writeDate: string;
  emoji: string;
  content: string;
  replyCount: number;
  isDeleted: boolean;
};

export type MyReview = {
  content: string;
  createdAt: string;
  title: string;
  author: string;
};

export type ReviewFavoriteUser = {
  userId: number;
  nickname: string;
};

export type Top10Book = {
  isbn: string;
  bookImg: string;
  title: string;
  author: string;
  favoriteCount: number;
};

export type BookFavoriteInfo = {
  isFavorite: boolean;
  favoriteCount: number;
};

export type FavoriteBook = {
  isbn: string;
  bookImg: string;
  title: string;
  author: string;
  price: number;
};

export type RecommendBook = {
  id: number;
  title: string;
  publisher: string;
  author: string;
  bookImg: string;
  isbn: string;
};

export type SearchUser = {
  id: number;
  email: string;
  datetime: string;
  point: number;
  commentCount: number;
};

export type FavoriteUser = {
  userId: number;
  nickname: string;
  createdAt: string;
  favoriteCount: number;
  reviewCount: number;
};
export type Alarm = {
  id: number;
  userId: number;
  message: string;
  createdAt: string;
};
