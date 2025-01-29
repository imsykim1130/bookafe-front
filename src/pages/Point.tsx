import moment from 'moment/moment';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import { getPointLogListRequest, getTotalPointRequest } from '../api';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { PointLogItem } from '../api/item.ts';
import PageTitle from '../components/PageTitle.tsx';
import Dropdown from './common/OrderDetailPage/component/Dropdown.tsx';

const Point = () => {
  const [totalPoint, setTotalPoint] = useState<number | null>(null);
  const [pointLog, setPointLog] = useState<PointLogItem[] | null>(null);

  const [cookies] = useCookies(['jwt']);
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);

  const [isStart, setIsStart] = useState<boolean>(false);
  const [isEnd, setIsEnd] = useState<boolean>(false);

  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - 3);

  const [start, setStart] = useState<Date>(startDate);
  const [end, setEnd] = useState<Date>(new Date());

  const filterList = ['전체', '적립', '사용'];
  const [filter, setFilter] = useState<string>('전체');

  const [page, setPage] = useState<number>(0);
  const [isFirst, setIsFirst] = useState<boolean>(false);
  const [isLast, setIsLast] = useState<boolean>(false);

  const getTotalPoint = () => {
    return getTotalPointRequest(cookies.jwt).then((res) => {
      setTotalPoint(res);
    });
  };

  const getPointLog = () => {
    getPointLogListRequest(cookies.jwt, start, end, page, filter).then((res) => {
      if (!res) return;
      setPointLog(res.pointLogList);
      setIsFirst(res.first);
      setIsLast(res.last);
    });
  };

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

  useEffect(() => {
    getPointLog();
  }, [start, end, filter, page]);

  const changeSelected = (value: string) => {
    setFilter(value);
  };

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
          {/* 달력 */}
          <div className={'flex items-center gap-[10px]'}>
            <i className="fi fi-br-calendar-day"></i>
            <div className={'flex items-center gap-[5px] text-[14px]'}>
              <div className={'relative'}>
                <span
                  className={'cursor-pointer'}
                  onClick={() => {
                    if (!isStart) {
                      setIsStart(true);
                      setIsEnd(false);
                    } else {
                      setIsStart(false);
                    }
                  }}
                >
                  {moment(start).format('YYYY-MM-DD')}
                </span>
                {isStart ? (
                  <div className={'w-[230px] absolute right-0 top-[30px]'}>
                    <Calendar
                      formatDay={(_, date) => moment(date).format('DD')}
                      onClickDay={(value) => {
                        setStart(value);
                        setIsStart(false);
                      }}
                    />
                  </div>
                ) : null}
              </div>
              <span>~</span>
              <div className={'relative'}>
                <span
                  className={'cursor-pointer'}
                  onClick={() => {
                    if (!isEnd) {
                      setIsEnd(true);
                      setIsStart(false);
                    } else {
                      setIsEnd(false);
                    }
                  }}
                >
                  {moment(end).format('YYYY-MM-DD')}
                </span>
                {isEnd ? (
                  <div className={'w-[230px] absolute right-0 top-[30px]'}>
                    <Calendar
                      formatDay={(_, date) => moment(date).format('DD')}
                      onClickDay={(value) => {
                        setEnd(value);
                        setIsEnd(false);
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </div>
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
        </section>
      </div>
    </main>
  );
};

export default Point;
