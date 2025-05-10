import AlertDialogComp from '@/components/AlertDialogComp';
import { useUserQuery } from '@/hook/user.hook';
import { useEffect, useState } from 'react';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alarm } from '@/types/item';
import { Button } from '@/components/ui/button';
import { useInitMessages, useIsEnd, useMessages, useSetIsEnd, useSetMoreMessages, useSubscribe, useUnsubscribe } from '@/store/alarm.store';
import { request } from '@/api/template';
import { DOMAIN } from '@/utils/env';
import { AlarmResponse } from '@/api/response.dto';

const Header = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  
  const [isNavOpened, setIsNavOpened] = useState<boolean>(false);
  const [isAlarmOpened, setIsAlarmOpened] = useState<boolean>(false);

  const { user } = useUserQuery();
  const subscribe = useSubscribe();
  const unsubscribe = useUnsubscribe();

  // 알림 수신
  // const [notifications, setNotifications] = useState<string[]>([]);

  // function: 로그인 버튼 클릭 핸들러
  // 로그인 성공 시 로그인 버튼을 누른 페이지로 다시 돌아가기 위해 state 에 돌아올 pathname 넣어서 보냄
  function signInClickHandler() {
    navigate('/auth/sign-in', { state: { pathname } });
  }

  // effect: 페이지 이동마다
  useEffect(() => {
    // 메뉴 네비게이션 드롭다운 닫기
    setIsNavOpened(false);
  }, [pathname]);

  useEffect(() => {
    if(!user) return;
    // 알림 수신
    subscribe();

    return () => {
      // 알림 수신 중지
      if(!user) return;
      console.log('헤더 언마운트');
      unsubscribe();
    }
  }, [user, subscribe, unsubscribe]);
  
  return (
    <header
      className={`sticky z-40 top-0 w-full flex justify-between items-center px-[5vw] md:px-[10vw] py-5 bg-white shadow-[0_0_4px_rgba(0,0,0,0.1)] text-xs`}
    >
      {/*로고*/}
      <Link to="/" className="w-[30px] h-[30px] flex justify-center items-center">
        <i className="fi fi-ss-book-alt text-[px]"></i>
      </Link>

      {/*네비게이션*/}
      <nav className="relative flex gap-[2rem] md:gap-[3rem] items-center">
        {/* 알림 버튼 */}
        <AlarmIcon isAlarmOpened={isAlarmOpened} setIsAlarmOpened={() => {
          setIsAlarmOpened(!isAlarmOpened);
        }}/>
        {/* 메뉴 버튼 */}
        <button className="md:hidden icon-btn" onClick={() => setIsNavOpened(!isNavOpened)}>
          <i className="flex items-center justify-center text-base fi fi-br-grid"></i>
        </button>

        {/* 드롭다운 */}
        <div className={`items-start gap-[1.875rem] nav ${isNavOpened ? 'flex' : 'hidden md:flex'}`}>
          {!user ? (
            <>
              {/* 로그인 안되어 있을 때 */}
              {/* 로그인, 로그아웃 */}
              <Link to={'/auth/sign-in'} className="text-nowrap icon-btn" onClick={signInClickHandler}>
                로그인
              </Link>
              <Link to={'/auth/sign-up'} className="text-nowrap icon-btn">
                회원가입
              </Link>
            </>
          ) : (
            <>
              {/* 로그인 되어 있을 때 */}
              {user.role === 'ROLE_USER' ? (
                <>
                  <Link to={'/favorite'} className="icon-btn ">
                    좋아요
                  </Link>
                  <Link to={'/user/' + user?.id} className="icon-btn ">
                    내 정보
                  </Link>
                  <Link to={'/favorite/user'} className="icon-btn ">
                    즐겨찾기
                  </Link>
                </>
              ) : (
                <>
                  <Link to={'/admin/user-management'} className="icon-btn ">
                    유저 관리
                  </Link>
                  <Link to={'/admin/recommend-book'} className="icon-btn ">
                    추천 도서 관리
                  </Link>
                </>
              )}

              <AlertDialogComp
                onConfirmClick={() => {
                  sessionStorage.removeItem('user');
                  window.location.href = '/auth/sign-in?logout=true';
                }}
                message="정말 로그아웃 하시겠습니까?"
              >
                {/* 로그아웃 팝업 띄울 트리거 버튼 */}
                <button className="icon-btn">로그아웃</button>
              </AlertDialogComp>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

const AlarmIcon = ({isAlarmOpened, setIsAlarmOpened}:{isAlarmOpened : boolean, setIsAlarmOpened: () => void}) => {
  const [page, setPage] = useState<number>(0);
  const size = 1;
  const [isAlarm, setIsAlarm] = useState<boolean>(false);
  const {user} = useUserQuery();
  const isEnd = useIsEnd();
  const setIsEnd = useSetIsEnd();
  const messages = useMessages();
  const setMoreMessages = useSetMoreMessages();
  const initMessages = useInitMessages();

  // function: 알림 리스트를 가져오는 함수
  async function getAlarmList() {
    await request.get<AlarmResponse>(DOMAIN + '/sse/notifications/unread?page=' + page + '&size=' + size)
    .then((res) => {
      const { notifications, isEnd } = res;
      setMoreMessages(notifications);
      setIsEnd(isEnd);
      setPage(page + 1);
    }
    ).catch((err) => {
      console.error(err);
    });
  }

  // function: 미확인 알림 여부를 가져오는 함수
  async function getUnreadAlarmExist() {
    await request.get<boolean>(DOMAIN + '/sse/notifications/unread-exists')
    .then((res) => {
      console.log(res);
      setIsAlarm(res);
    }
    ).catch((err) => {
      setIsAlarm(false);
      console.error(err);
    });
  }

  // function: 알림 읽음 표시하기
  async function setAlarmRead() {
    await request.patch(DOMAIN + '/sse/notifications/read', {ids: messages.map((alarm) => alarm.id)})
    .then(() => {
      console.log("알림 읽음 처리 완료");
      initMessages();
      setPage(0);
    }
    ).catch((err) => {
      console.error(err);
    });
  }

  useEffect(() => {
    if(isAlarmOpened) {
      setIsAlarm(false);
      getAlarmList();
      return;
    }

    // 알림 드롭다운이 닫힐 때 알림 읽음 처리
    if(messages.length && !isAlarmOpened) {
      setAlarmRead();
    }
  }, [isAlarmOpened]);

  useEffect(() => {
    if(!user) return;
    getUnreadAlarmExist();
  }, [user]);

  if(!user) return null;
  
  return (
    <div className='relative'>
      <button className="relative icon-btn">
          <i className="flex items-center justify-center text-base fi fi-ss-bell" onClick={() => {
      setIsAlarmOpened();
          }}></i>
          {isAlarm && (
            <span className="absolute block -translate-x-1/2 bg-red-500 rounded-full size-[0.3125rem] top-5 left-1/2"></span>
          )}
      </button>
      {/* 알림 드롭다운 */}
      {isAlarmOpened ? <AlarmList alarmList={messages || []} isEnd={isEnd} showMoreAlarm={() => {
        getAlarmList();
      }}/> : null}
    </div>
    
  )
}

// 알림 리스트
// 알림 리스트는 알림 아이콘을 클릭했을 때 나타나는 드롭다운
const AlarmList = ({showMoreAlarm}: {alarmList: Alarm[], isEnd: boolean, showMoreAlarm: () => void}) => {
  const messages = useMessages();
  const isEnd = useIsEnd();

  return <div className='min-w-[18rem] max-h-[50vh] overflow-y-hidden absolute right-0 top-[2rem] p-[1rem] rounded-[1rem] border-[1px] border-black/10 bg-white'>
    {messages.length ? messages.map((alarm) => (
    <div key={alarm.id} className="flex flex-col gap-[0.4rem] p-[1rem] rounded-md hover:bg-black/5 cursor-pointer" >
        <span className="text-sm text-nowrap">{alarm.message}</span>
        <span className="text-xs text-gray-400 text-nowrap">{alarm.createdAt.split("T")[0]}</span>
    </div>
    )) : <p className='text-nowrap text-black/40'>알림 없음</p>}

    {!isEnd && <div className='flex justify-center mt-4'>
      <Button variant={'outline'} onClick={showMoreAlarm}>알림 더보기</Button>
    </div>}
  </div>
}


export default Header;
