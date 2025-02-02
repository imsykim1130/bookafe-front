/* eslint-disable react-hooks/exhaustive-deps */
import { useDebounce } from '@/hook';
import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { deleteUserRequest, searchUserRequest } from '../../api';
import { UserManagementItem } from '../../api/item.ts';

// const userListMock: UserManagementItem[] = [
//   {
//     email: 'hi@hi.com',
//     datetime: '2024.12.12',
//     point: 1222,
//     commentCount: 29,
//   },
//   {
//     email: 'hi@hi2.com',
//     datetime: '2024.12.12',
//     point: 12,
//     commentCount: 2,
//   },
//   {
//     email: 'hi@hi3.com',
//     datetime: '2024.12.12',
//     point: 1222242224,
//     commentCount: 29009,
//   },
// ];

const UserManagement = () => {
  const [userList, setUserList] = useState<UserManagementItem[] | null>(null);
  const [cookies] = useCookies(['jwt']);
  const [reload, setReload] = useState<number>(0);

  // 유저 리스트 가져오기 요청
  const getUserList = (searchWord: string) => {
    if (searchWord.length === 0) {
      setUserList(null);
      return;
    }
    searchUserRequest(cookies.jwt, searchWord).then((res) => {
      if (!res) {
        setUserList(null);
        window.alert('유저 리스트를 불러오는 동안 오류가 발생했습니다. 다시 시도해주세요');
        return;
      }
      setUserList(res);
    });
  };

  // 유저 탈퇴 요청
  const deleteUser = async (id: number) => {
    console.log(id);
    // todo : 요청
    return await deleteUserRequest(cookies.jwt, id).then((res) => {
      return res;
    });
  };

  const searchReload = () => {
    setReload(reload + 1);
  };

  return (
    <main className={'flex flex-col items-center px-[5%] py-[5vh]'}>
      <SearchBox getUserList={getUserList} reload={reload} />
      <section className={'w-full max-w-[600px]'}>
        {/* 검색 전, 검색 오류 시*/}
        {userList === null && (
          <div className={'flex justify-center items-center h-[70vh]'}>
            <div className={'flex items-center gap-[10px] text-black text-opacity-40'}>
              <i className="fi fi-br-search"></i>
              <p>찾고자 하는 유저의 이메일을 입력해주세요</p>
            </div>
          </div>
        )}
        {/* 검색 결과가 없을 때 */}
        {userList && userList.length === 0 && (
          <div className={'flex justify-center items-center h-[70vh]'}>
            <p className={'text-black text-opacity-40'}>검색 결과가 없습니다</p>
          </div>
        )}
        {/* 검색 결과가 존재할 때*/}
        {userList && userList.length > 0 && (
          <div className={'mt-[30px]'}>
            {userList.map((user: UserManagementItem) => (
              <UserComp key={user.email} user={user} deleteUser={deleteUser} searchReload={searchReload} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

const SearchBox = ({ getUserList, reload }: { getUserList: (searchWord: string) => void; reload: number }) => {
  const [searchWord, setSearchWord] = useState<string>('');
  const debouncedSearchWord = useDebounce(searchWord, 500);

  useEffect(() => {
    getUserList(debouncedSearchWord);
  }, [debouncedSearchWord]);

  useEffect(() => {
    getUserList(debouncedSearchWord);
  }, [reload]);

  return (
    <div className={'flex justify-center'}>
      <div className={'relative'}>
        <i className="fi fi-br-search absolute top-1/2 -translate-y-1/2 left-[15px]"></i>
        <input
          type="text"
          placeholder={'유저의 이메일을 입력해주세요'}
          value={searchWord}
          className={
            'min-w-[300px] border-[1px] border-black border-opacity-20 rounded-[5px] py-[15px] px-[40px] outline-none'
          }
          onChange={(e) => setSearchWord(e.target.value)}
        />
      </div>
    </div>
  );
};

const UserComp = ({
  user,
  deleteUser,
  searchReload,
}: {
  user: UserManagementItem;
  deleteUser: (id: number) => Promise<boolean>;
  searchReload: () => void;
}) => {
  const { id, email, point, datetime, commentCount } = user;
  return (
    <div
      className={'text-[14px] flex justify-between items-start py-[20px] border-b-[1px] border-black border-opacity-10'}
    >
      <div className={'flex flex-col gap-[15px]'}>
        <div className={'flex items-center gap-[10px]'}>
          <p className={'font-bold'}>{email}</p>
          <p>{datetime}</p>
        </div>
        <div>
          <div className={'flex items-center gap-[10px]'}>
            <p className={'min-w-[100px]'}>보유 포인트</p>
            <p className={'text-black text-opacity-60'}>{point} P</p>
          </div>
          <div className={'flex items-center gap-[10px]'}>
            <p className={'min-w-[100px]'}>작성 댓글 개수</p>
            <p className={'text-black text-opacity-60'}>댓글 {commentCount} 개</p>
          </div>
        </div>
      </div>
      <button
        className={'border-[1px] border-black border-opacity-80 rounded-[5px] p-[5px]'}
        onClick={() => {
          deleteUser(id).then((res) => {
            if (!res) {
              window.alert('오류가 발생했습니다. 다시 시도해주세요');
              return;
            }
            window.alert('탈퇴 완료');
            searchReload();
          });
        }}
      >
        탈퇴
      </button>
    </div>
  );
};

export default UserManagement;
