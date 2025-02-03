/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { PointLogItem } from '../api/item.ts';
import { getPointLogListRequest, getTotalPointRequest } from '../api/request.ts';
import Dropdown from './common/OrderDetailPage/component/Dropdown.tsx';

const Point = () => {
  const [totalPoint, setTotalPoint] = useState<number | null>(null);
  const [pointLog, setPointLog] = useState<PointLogItem[] | null>(null);

  const [cookies] = useCookies(['jwt']);
  const navigate = useNavigate();

  // state: 날짜 관련 state
  const start = new Date();
  start.setMonth(start.getMonth() - 3);

  const [startDate, setStartDate] = useState<Date>(start);
  const [endDate, setEndDate] = useState<Date>(new Date());

  // state: 종류 필터링 관련 state
  const filterList = ['전체', '적립', '사용'];
  const [filter, setFilter] = useState<string>('전체');

  const [page, setPage] = useState<number>(0);
  const [isFirst, setIsFirst] = useState<boolean>(false);
  const [isLast, setIsLast] = useState<boolean>(false);

  // function: 총 포인트 가져오기
  const getTotalPoint = () => {
    return getTotalPointRequest(cookies.jwt).then((res) => {
      setTotalPoint(res);
    });
  };

  // function: 포인트 변경 내역 리스트 가져오기
  const getPointLog = () => {
    getPointLogListRequest(cookies.jwt, startDate, endDate, page, filter).then((res) => {
      if (!res) return;
      setPointLog(res.pointLogList);
      setIsFirst(res.first);
      setIsLast(res.last);
    });
  };

  // function: 종류 필터링 변경 시 실행
  const changeSelected = (value: string) => {
    setFilter(value);
  };

  // effect: 첫 렌더링 시 실행
  useEffect(() => {
    // 인증 시간 만료 시 로그인 화면으로 이동
    if (!cookies.jwt) {
      navigate('/auth/sign-in', {
        state: { pathname: '/point' },
      });
    }
    // 보유 포인트 가져오기
    getTotalPoint();
    // 포인트 변경 내역 가져오기
    getPointLog();
  }, []);

  // effect: 날짜 또는 종류 필터링 시 실행
  useEffect(() => {
    getPointLog();
  }, [startDate, endDate, filter, page]);

  // render
  return (
    <main className={'flex flex-col items-center px-[5%] py-[3rem]'}>
      <div className="w-full max-w-[600px]">
        {/* 보유 포인트*/}
        <div>
          <h2 className={'font-semibold'}>보유 포인트</h2>
          <p className={'font-bold text-[32px]'}>{totalPoint + ' P'}</p>
        </div>
        {/* 필터링 */}
        <section className={'mt-[50px] text-md flex items-center justify-between cursor-pointer'}>
          {/* 종류 */}
          <Dropdown changeSelected={changeSelected} options={filterList} />
          {/* 날짜 */}
          <div className="flex items-center gap-[10px] ml-[10px]">
            {/* 시작 날짜 */}
            <input
              type="date"
              value={startDate.toISOString().split('T')[0]}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-[10px]"
              onChange={(e) => {
                const date = new Date(e.target.value);
                setStartDate(date);
              }}
            />
            {/* 끝 날짜 */}
            <span className="text-gray-400">~</span>
            <input
              type="date"
              value={endDate.toISOString().split('T')[0]}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-[10px]"
              onChange={(e) => {
                const date = new Date(e.target.value);
                setEndDate(date);
              }}
            />
          </div>
        </section>

        <section className={'mt-[30px]'}>
          <div>
            {pointLog && pointLog.length ? (
              pointLog.map((item, i) => (
                <div
                  key={i}
                  className={
                    'flex items-center justify-between font-bold text-md border-b-[0.5px] border-black border-opacity-10 py-[15px]'
                  }
                >
                  <p>{item.name}</p>
                  <p>{item.point} P</p>
                </div>
              ))
            ) : (
              <p className="text-[1.2rem] font-semibold">결과가 없습니다 🥲</p>
            )}
          </div>
          {/* pagination */}
          {pointLog && pointLog.length ? (
            <div className={'flex justify-center mt-[30px]'}>
              <div className={'relative text-[14px]'}>
                {isFirst ? null : (
                  <span
                    className={'cursor-pointer absolute top-0 left-[-60px]'}
                    onClick={() => {
                      setPage(page - 1);
                    }}
                  >
                    {'< 이전'}
                  </span>
                )}
                <span className={'font-bold'}>{page + 1}</span>
                {isLast ? null : (
                  <span
                    className={'cursor-pointer absolute top-0 right-[-60px]'}
                    onClick={() => {
                      setPage(page + 1);
                    }}
                  >
                    {'다음 >'}
                  </span>
                )}
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
};

export default Point;
