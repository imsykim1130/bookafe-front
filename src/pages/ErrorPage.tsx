import { useLocation, useNavigate, useParams } from 'react-router-dom';

function ErrorPage() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { state } = useLocation();
  // 에러가 생긴 페이지 경로. 새로고침 시 이동할 페이지
  const pathname = state ? state.pathname : null;

  const errors = {
    '404': '페이지를 찾을 수 없습니다.',
    '500': '서버 오류가 발생했습니다. 관리자에게 문의해주세요.',
  };

  const toHome = () => {
    navigate('/');
  };

  const refresh = () => {
    navigate(pathname);
  };

  return (
    <div className="flex flex-col items-center justify-center px-[5%]">
      <div className="py-[20vh] flex flex-col gap-[3rem] items-center">
        <div className="flex flex-col gap-[0.4rem] items-center">
          <h1 className="text-[8rem] font-black">{code}</h1>
          <p className="text-[1rem] font-semibold">{errors[code as keyof typeof errors]}</p>
        </div>
        {code === '404' ? (
          <button onClick={toHome}>
            <i className="fi fi-ss-house-chimney text-[2rem]"></i>
          </button>
        ) : null}
        {code === '500' ? (
          <button onClick={refresh}>
            <i className="fi fi-ss-refresh text-[2rem]"></i>
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default ErrorPage;
