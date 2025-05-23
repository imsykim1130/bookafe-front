/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hook/hooks.ts';
import { searchUserListQueryKey, useSearchUserListQuery, useUserMutation } from '@/hook/user.hook.ts';
import { queryClient } from '@/main.tsx';
import { SearchUser, UserManagementItem } from '@/types/item';
import { useEffect, useState } from 'react';

const UserManagement = () => {
  const [searchWord, setSearchWord] = useState<string>('');
  const debouncedSearchWord = useDebounce(searchWord, 500);

  const { searchUserList, isSearchUserListError, isSearchUserListLoading, refetchSearchUserList } =
    useSearchUserListQuery({ searchWord });

  return (
    <main className={'flex flex-col items-center px-[5%] py-[5vh] min-h-screen'}>
      <SearchBox
        searchWord={searchWord}
        setSearchWord={setSearchWord}
        debouncedSearchWord={debouncedSearchWord}
        refetchSearchUserList={refetchSearchUserList}
      />
      <div className={'w-full max-w-[600px]'}>
        <SearchUserList
          searchUserList={searchUserList}
          isError={isSearchUserListError}
          isLoading={isSearchUserListLoading}
        />
      </div>
    </main>
  );
};

// 검색창
const SearchBox = ({
  searchWord,
  setSearchWord,
  debouncedSearchWord,
  refetchSearchUserList,
}: {
  searchWord: string;
  setSearchWord: (searchWord: string) => void;
  debouncedSearchWord: string;
  refetchSearchUserList: () => void;
}) => {
  useEffect(() => {
    // todo
    if (debouncedSearchWord === '') {
      queryClient.setQueryData([searchUserListQueryKey], []);
      return;
    }
    refetchSearchUserList();
  }, [debouncedSearchWord]);

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

// 유저 리스트
const SearchUserList = ({
  searchUserList,
  isError,
  isLoading,
}: {
  searchUserList: SearchUser[];
  isLoading: boolean;
  isError: boolean;
}) => {
  if (isLoading) {
    return <p>로딩중</p>;
  }
  if (isError) {
    return <p>오류로 인해 불러오지 못했습니다</p>;
  }

  return searchUserList.map((user: UserManagementItem) => <UserComp key={user.email} user={user} />);
};

// 유저
const UserComp = ({ user }: { user: UserManagementItem }) => {
  const { email, datetime, commentCount, id } = user;
  const { adminCancelUser } = useUserMutation();

  return (
    <div
      className={'text-[14px] flex justify-between items-start py-[20px] border-b-[1px] border-black border-opacity-10'}
    >
      <div className={'flex flex-col gap-[15px]'}>
        <div className={'flex items-center gap-[10px]'}>
          <p className={'font-bold'}>{email}</p>
        </div>
        <div>
          {/* 가입일 */}
          <div className={'flex items-center gap-[0.8rem]'}>
            <p className={'min-w-[100px]'}>가입일</p>
            <p className={'text-black text-opacity-60'}>{datetime}</p>
          </div>
          {/* 작성 댓글 개수 */}
          <div className={'flex items-center gap-[0.8rem]'}>
            <p className={'min-w-[100px]'}>작성 댓글 개수</p>
            <p className={'text-black text-opacity-60'}>댓글 {commentCount} 개</p>
          </div>
        </div>
      </div>
      <Button onClick={() => adminCancelUser(id)}>탈퇴</Button>
    </div>
  );
};

export default UserManagement;
