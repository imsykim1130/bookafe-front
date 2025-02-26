/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { deleteBookFromFavoriteRequest, getBookFavoriteInfoRequest, putBookToFavoriteRequest } from '@/api/api';
import { useQueryClient } from '@tanstack/react-query';
import { allFavoriteBookkey } from '@/api/query';
import { GetBookFavoriteInfoResponseDto } from '@/api/response.dto';

const Favorite = ({ isbn }: { isbn: string | undefined }) => {
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [favoriteCount, setFavoriteCount] = useState<number>(0);
  const [cookies] = useCookies(['jwt']);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // function: 책의 좋아요 관련 정보 가져오기
  const getBookFavoriteInfo= () => {
    if (!cookies.jwt) {
      return;
    }
    if (!isbn) return;
    getBookFavoriteInfoRequest(cookies.jwt, isbn).then((res) => {
      if(!res) {
        navigate("/error/500");
      }
      const {isFavorite, favoriteCount} = res as GetBookFavoriteInfoResponseDto;
      setIsFavorite(isFavorite);
      setFavoriteCount(favoriteCount);
    })
  };

  // function: 좋아요 누르기
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
    setIsFavorite(true);
    putBookToFavoriteRequest(cookies.jwt, isbn).then((res) => {
      if (!res) {
        window.alert('좋아요 추가 실패');
      }
      getBookFavoriteInfo();
      // 좋아요 책 모두 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [allFavoriteBookkey]
      })
    });
  };

  // function: 좋아요 해제
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
    setIsFavorite(false);
    deleteBookFromFavoriteRequest(cookies.jwt, isbn).then((res) => {
      if (!res) {
        window.alert('좋아요 삭제 실패');
      }
      getBookFavoriteInfo();
      // 좋아요 책 모두 쿼리 무효화
      queryClient.invalidateQueries({
        queryKey: [allFavoriteBookkey]
      })
    });
  };

  // effect
  useEffect(() => {
    getBookFavoriteInfo();
  }, []);

  return (
    <div className='flex flex-col items-center'>
      {isFavorite ? (
        <i className="fi fi-ss-heart cursor-pointer text-[1.2rem]" onClick={deleteBookFromFavorite}></i>
      ) : (
        <i className="fi fi-rs-heart cursor-pointer text-[1.2rem]" onClick={putBookToFavorite}></i>
      )}
      <p>{favoriteCount}</p>
    </div>
  );
};

export default Favorite;
