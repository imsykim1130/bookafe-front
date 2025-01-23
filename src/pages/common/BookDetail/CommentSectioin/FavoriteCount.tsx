import { useEffect, useState } from 'react';
import {
  cancelCommentFavoriteRequest,
  getCommentFavoriteRequest,
  getIsCommentFavoriteRequest,
  putCommentFavoriteRequest,
} from '../../../../api';
import { useCookies } from 'react-cookie';

interface Props {
  commentId: number;
}

const FavoriteCount = ({ commentId }: Props) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [favoriteCount, setFavoriteCount] = useState<number>(0);
  const [cookies, _] = useCookies();

  // request
  // 댓글 좋아요 요청
  const putCommentFavorite = () => {
    if (!cookies.jwt) return;
    putCommentFavoriteRequest(cookies.jwt, commentId).then((res) => {
      if (!res) {
        return;
      }
      setIsFavorite(true);
      getCommentFavoriteCount();
    });
  };

  // 댓글 좋아요 취소 요청
  const cancelCommentFavorite = () => {
    if (!cookies.jwt) return;
    cancelCommentFavoriteRequest(cookies.jwt, commentId).then((res) => {
      if (!res) {
        return;
      }
      setIsFavorite(false);
      getCommentFavoriteCount();
    });
  };

  // 댓글 좋아요 개수 가져오기 요청
  const getCommentFavoriteCount = () => {
    getCommentFavoriteRequest(commentId).then((res) => {
      if (res === null) {
        return;
      }
      setFavoriteCount(res);
    });
  };

  // 댓글 좋아요 여부 가져오기
  const getIsCommentFavorite = () => {
    if (!cookies.jwt) return;
    getIsCommentFavoriteRequest(cookies.jwt, commentId).then((res) => {
      if (res === null) {
        return;
      }
      setIsFavorite(res);
    });
  };

  // effect
  useEffect(() => {
    getCommentFavoriteCount();
    getIsCommentFavorite();
  }, []);

  return (
    <div className={'flex gap-[5px] items-center cursor-pointer'}>
      <span>
        {isFavorite ? (
          <span onClick={cancelCommentFavorite}>❤️</span>
        ) : (
          <span onClick={putCommentFavorite} className={'opacity-40'}>
            ❤️
          </span>
        )}
      </span>
      <span>{favoriteCount}</span>
    </div>
  );
};

export default FavoriteCount;
