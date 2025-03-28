import PaginationComp from '@/components/PaginationComp';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FavoriteUser, useFavoriteUserListQuery, useUserMutation } from '@/hook/user.hook';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FavoriteUserPage = () => {
  const [checkedUserIdList, setCheckedUserIdList] = useState<number[]>([]);
  const { unlikeUsers } = useUserMutation();

  // 즐겨찾기 유저 선택
  const checkUser = (userId: number) => {
    const index = checkedUserIdList.indexOf(userId);

    // 체크 해제
    if (index >= 0) {
      const fixed = [...checkedUserIdList];
      fixed.splice(index, 1);
      setCheckedUserIdList(fixed);
      return;
    }
    // 체크
    setCheckedUserIdList([...checkedUserIdList, userId]);
  };

  // 즐겨찾기 유저 전체선택
  const checkAllUser = (allFavoriteUserIdList: number[]) => {
    // 전체선택 취소
    if (allFavoriteUserIdList.length === checkedUserIdList.length) {
      setCheckedUserIdList([]);
      return;
    }
    // 전체선택 누름
    setCheckedUserIdList(allFavoriteUserIdList);
  };

  return (
    <main className={'flex flex-col mt-[40px] min-h-[100vh] px-[5%]'}>
      <div className="w-full max-w-[600px] flex flex-col gap-[1.2rem] mx-auto">
        <FavoriteUserList checkedUserIdList={checkedUserIdList} checkUser={checkUser} checkAllUser={checkAllUser} />
        {checkedUserIdList.length > 0 && (
          <Button
            onClick={() => {
              unlikeUsers(checkedUserIdList);
              setCheckedUserIdList([]);
            }}
          >
            선택 유저 즐겨찾기 취소
          </Button>
        )}
      </div>
    </main>
  );
};

const FavoriteUserList = ({
  checkedUserIdList,
  checkUser,
  checkAllUser,
}: {
  checkedUserIdList: number[];
  checkUser: (userId: number) => void;
  checkAllUser: (allFavoriteUserIdList: number[]) => void;
}) => {
  const [page, setPage] = useState<number>(0);
  const size = 10;
  const { favoriteUserList, totalPage, isFavoriteUserListError, isFavoriteUserListLoading } = useFavoriteUserListQuery({
    page,
    size,
  });

  if (isFavoriteUserListLoading || favoriteUserList === undefined) return <p>로딩중</p>;
  if (isFavoriteUserListError) return <p>에러</p>;

  if (favoriteUserList.length === 0) {
    return (
      <div className="absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center">
        <p className="text-black/60">즐겨찾기 한 유저가 없습니다</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-[1rem]">
      <div className="flex justify-end">
        <p
          className="text-sm transition duration-300 cursor-pointer hover:opacity-60"
          onClick={() => {
            if (!favoriteUserList) return;
            checkAllUser(favoriteUserList.map((user) => user.userId));
          }}
        >
          전체선택
        </p>
      </div>
      {favoriteUserList.map((user: FavoriteUser) => (
        <FavoriteUserComp
          key={user.userId}
          user={user}
          checkedUserIdList={checkedUserIdList}
          checkUser={checkUser}
          checkAllUser={checkAllUser}
        />
      ))}
      <PaginationComp currentPage={page} pageCount={size} setCurrentPage={setPage} totalPages={totalPage} />
    </div>
  );
};

const FavoriteUserComp = ({
  user,
  checkedUserIdList,
  checkUser,
}: {
  user: FavoriteUser;
  checkedUserIdList: number[];
  checkUser: (userId: number) => void;
  checkAllUser: (allFavoriteUserIdList: number[]) => void;
}) => {
  const navigate = useNavigate();
  const { unlikeUser } = useUserMutation();

  return (
    <article className="flex justify-between pb-[1.5rem] border-b-[0.0625rem]">
      <Checkbox
        className="mr-[1rem] mt-[0.3rem]"
        onClick={() => {
          checkUser(user.userId);
        }}
        checked={checkedUserIdList.indexOf(user.userId) >= 0}
      />
      <div className="flex-1 flex flex-col gap-[1rem]">
        <div className="flex gap-[1rem] items-center">
          <p
            className="font-semibold cursor-pointer"
            onClick={() => {
              navigate('/user/' + user.userId);
            }}
          >
            {user.nickname}
          </p>
          <p>{user.createdAt.split('T')[0]} 가입</p>
        </div>
        <div>
          <div className="flex gap-[1rem]">
            <p>받은 좋아요</p>
            <p>{user.favoriteCount} 개</p>
          </div>
          <div className="flex gap-[1rem]">
            <p>작성한 리뷰</p>
            <p>{user.reviewCount} 개</p>
          </div>
        </div>
      </div>
      <Button
        variant={'outline'}
        onClick={() => {
          unlikeUser(user.userId);
        }}
      >
        취소
      </Button>
    </article>
  );
};

export default FavoriteUserPage;
