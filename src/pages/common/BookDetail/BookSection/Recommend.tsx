import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { deleteRecommendBookRequest, getRecommendedRequest, registerRecommendBookRequest } from '../../../../api';

const Recommend = ({ isbn }: { isbn: string | undefined }) => {
  const [isRecommended, setIsRecommended] = useState<boolean>(false);
  const [cookies, _] = useCookies();
  const navigate = useNavigate();

  // 추천 책 여부 가져오기
  const getRecommended = async () => {
    if (!cookies.jwt) {
      return;
    }
    if (!isbn) return;
    getRecommendedRequest(cookies.jwt, isbn).then((res) => {
      if (res === null) {
        window.alert('오류가 발생했습니다 다시 시도해주세요');
        return;
      }
      setIsRecommended(res);
    });
  };

  // 추천 책 추가
  const registerRecommendBook = () => {
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
    registerRecommendBookRequest(cookies.jwt, isbn).then((res) => {
      if (res !== true) {
        window.alert(res);
        return;
      }
      getRecommended();
    });
  };

  // 추천 책 삭제
  const deleteRecommendBook = () => {
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
    deleteRecommendBookRequest(cookies.jwt, isbn).then((res) => {
      if (res === null) {
        window.alert('오류가 발생했습니다 다시 시도해주세요');
        return;
      }
      getRecommended();
    });
  };

  useEffect(() => {
    getRecommended();
  }, []);

  return (
    <div>
      {isRecommended ? (
        <i className="fi fi-sr-star cursor-pointer text-[16px]" onClick={deleteRecommendBook}></i>
      ) : (
        <i className="fi fi-rr-star cursor-pointer text-[16px]" onClick={registerRecommendBook}></i>
      )}
    </div>
  );
};

export default Recommend;
