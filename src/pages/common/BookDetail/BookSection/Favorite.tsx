import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { deleteBookFromFavoriteRequest, getIsFavoriteRequest, putBookToFavoriteRequest } from '../../../../api';

const Favorite = ({ isbn }: { isbn: string | undefined }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [cookies, _] = useCookies();
  const navigate = useNavigate();

  // 좋아요 여부
  const getIsFavorite = () => {
    if (!cookies.jwt) {
      return;
    }
    if (!isbn) return;
    getIsFavoriteRequest(cookies.jwt, isbn).then((res) => {
      if (res === null) {
        window.alert('좋아요 여부 가져오기 실패. 다시 시도해주세요');
        return;
      }
      setIsFavorite(res);
    });
  };

  // 좋아요 누르기
  const putBookToFavorite = () => {
    if (!cookies.jwt) {
      window.alert('로그인이 필요합니다.');
      navigate('/auth/sign-in', {
        state: {
          pathname: '/book/detail/' + isbn,
        },
      });
      return;
    }
    if (!isbn) return;
    putBookToFavoriteRequest(cookies.jwt, isbn).then((res) => {
      if (!res) {
        window.alert('좋아요 추가 실패');
      }
      getIsFavorite();
    });
  };

  // 좋아요 해제
  const deleteBookFromFavorite = () => {
    if (!cookies.jwt) {
      window.alert('로그인이 필요합니다.');
      navigate('/auth/sign-in', {
        state: {
          pathname: '/book/detail/' + isbn,
        },
      });
      return;
    }

    if (!isbn) return;
    deleteBookFromFavoriteRequest(cookies.jwt, isbn).then((res) => {
      if (!res) {
        window.alert('좋아요 삭제 실패');
      }
      getIsFavorite();
    });
  };

  useEffect(() => {
    getIsFavorite();
  }, []);

  return (
    <div>
      {isFavorite ? (
        <i className="fi fi-ss-heart cursor-pointer text-[16px]" onClick={deleteBookFromFavorite}></i>
      ) : (
        <i className="fi fi-rs-heart cursor-pointer text-[16px]" onClick={putBookToFavorite}></i>
      )}
    </div>
  );
};

export default Favorite;
