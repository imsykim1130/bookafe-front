import { DOMAIN } from '@/utils/env';
import axios from 'axios';
import { BookDetailData } from './item';
import { GetAllFavoriteBookResponseDto, GetBookFavoriteInfoResponseDto } from './response.dto';

// 책 상세정보 가져오기
export const getBookDetailRequest = async (isbn: string) => {
  console.log('책 상세정보 가져오기 쿼리');
  return await axios
    .get(DOMAIN + '/book/detail/' + isbn)
    .then((res) => {
      return res.data.book as BookDetailData;
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

// 좋아요 책 가져오기, 페이지네이션 적용
export const getFavoriteBookListRequest = async (jwt: string, page: number) => {
  console.log('좋아요 책 가져오기 쿼리');
  return await axios
    .get(DOMAIN + '/favorite/list', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      params: {
        page,
      },
    })
    .then((res) => {
      return res.data as GetAllFavoriteBookResponseDto;
    })
    .catch((err) => {
      throw err;
    });
};

// 책의 좋아요 관련 정보
export const getBookFavoriteInfoRequest = async (jwt: string, isbn: string) => {
  console.log('책 좋아요 정보 가져오기 쿼리');
  return await axios
    .get(DOMAIN + '/favorite/' + isbn, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then((res): GetBookFavoriteInfoResponseDto => {
      return res.data as GetBookFavoriteInfoResponseDto;
    })
    .catch((err) => {
      console.log(err.response.data);
      throw err;
    });
};

// 책 좋아요 누르기
export const putBookToFavoriteRequest = async (jwt: string, isbn: string) => {
  console.log('책 좋아요 누르기 쿼리');
  return await axios
    .put(
      DOMAIN + `/favorite/${isbn}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    )
    .then(() => true)
    .catch((err) => {
      console.log(err.response.data);
      return false;
    });
};

// 책 좋아요 취소
export const cancelFavoriteBookRequest = async (jwt: string, isbn: string) => {
  console.log('책 좋아요 취소 쿼리');
  return await axios
    .delete(DOMAIN + `/favorite/${isbn}`, {
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

// 좋아요 일괄 취소
export const cancelFavoriteBookBatchRequest = async (jwt: string, isbnList: string[]) => {
  console.log('좋아요 일괄 취소 쿼리');
  console.log('좋아요 일괄 취소 요청');
  return await axios
    .delete(DOMAIN + '/favorite/list', {
      data: {
        isbnList,
      },
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })
    .then(() => true)
    .catch((err) => {
      console.log(err.response.data.message);
      return false;
    });
};
