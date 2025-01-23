import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { deleteBookFromCartRequest, getIsCartRequest, putBookToCartRequest } from '../../../../api';

const Cart = ({ isbn }: { isbn: string | undefined }) => {
  const [isCart, setIsCart] = useState<boolean>(false);
  const [cookies, _] = useCookies();
  const navigate = useNavigate();

  // 장바구니 여부
  const getIsCart = () => {
    if (!cookies.jwt) {
      return;
    }
    if (!isbn) return;
    getIsCartRequest(cookies.jwt, isbn).then((res) => {
      if (res === null) {
        window.alert('오류');
        return;
      }
      setIsCart(res);
    });
  };

  // 장바구니에 담기
  const putBookToCart = async () => {
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
    putBookToCartRequest(cookies.jwt, isbn).then((res) => {
      if (!res) {
        window.alert('장바구니 담기 실패. 다시 시도해주세요');
        return;
      }
      getIsCart();
    });
  };

  // 장바구니에서 삭제
  const deleteBookFromCart = async () => {
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
    deleteBookFromCartRequest(cookies.jwt, isbn).then((res) => {
      if (!res) {
        window.alert('장바구니 삭제 실패');
        return;
      }
      getIsCart();
    });
  };

  useEffect(() => {
    getIsCart();
  }, []);

  return (
    <div>
      {isCart ? (
        <i
          className="fi fi-sr-shopping-cart cursor-pointer"
          onClick={() => {
            deleteBookFromCart();
          }}
        ></i>
      ) : (
        <i
          className="fi fi-rr-shopping-cart cursor-pointer"
          onClick={() => {
            putBookToCart();
          }}
        ></i>
      )}
    </div>
  );
};

export default Cart;
