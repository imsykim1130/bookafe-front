import { BookDetailData, BookPrevData, CommentItem } from '../api/item.ts';
import { Reducer } from 'react';

export interface BookDataState {
  book: BookDetailData;
  favoriteUserIdList: string[];
  cartUserIdList: string[];
  commentList: CommentItem[];
  loading: boolean;
  error: boolean;
}

export interface BookDataAction {
  type: string;
  payload?: BookDetailData | string[] | CommentItem[];
}

export interface ReplyState {
  replyList: CommentItem[];
  loading: boolean;
  error: boolean;
}

export interface ReplyAction {
  type: string;
  payload?: CommentItem[];
}

// BookPrev
export interface BookPrevState {
  items: BookPrevData[];
  loading: boolean;
  error: boolean;
}

export interface BookPrevAction {
  type: string;
  payload?: BookPrevData[];
}

export const bookPrevReducer: Reducer<any, any> = (prevState, action) => {
  if (action.type === 'loading') {
    return { ...prevState, loading: true, error: false };
  }
  if (action.type === 'success') {
    return { ...prevState, items: action.payload, loading: false, error: false };
  }
  if (action.type === 'error') {
    return { ...prevState, loading: false, error: true };
  }

  return prevState;
};
