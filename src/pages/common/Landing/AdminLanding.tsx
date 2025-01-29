import { Link } from 'react-router-dom';

function AdminLanding() {
  return (
    <main className="flex flex-col items-center mt-[2rem] px-[5%]">
      <div className="w-full max-w-[600px]">
        {/* 메뉴 목록 */}
        <div className="flex flex-col">
          <h1 className="font-semibold text-[1.5rem] py-[1rem]">관리 메뉴</h1>
          <Link
            to="/admin/user-management"
            className="py-6 px-2 border-b-[1px] border-black border-opacity-20 transition-colors duration-300 hover:bg-gray-100"
          >
            유저 관리
          </Link>
          <Link
            to="/admin/recommend-book"
            className="py-6 px-2 border-b-[1px] border-black border-opacity-20 transiton-colors hover:bg-gray-100 duration-300"
          >
            추천 도서 관리
          </Link>

          <Link
            to="/admin/order-status"
            className="py-6 px-2 border-b-[1px] border-black border-opacity-20 transiton-colors hover:bg-gray-100 duration-300"
          >
            주문 상태 관리
          </Link>
        </div>
      </div>
    </main>
  );
}

export default AdminLanding;
