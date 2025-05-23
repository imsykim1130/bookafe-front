import { UserResponse } from '@/api/response.dto';
import { request } from '@/api/template';
import AlertDialogComp from '@/components/AlertDialogComp';
import ErrorComp from '@/components/ErrorComp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  reviewFavoriteUserListQueryKey,
  useReviweFavoriteUserListQuery,
  userReviewListQueryKey,
  useUserReviewListQuery,
} from '@/hook/comment.hooks';
import { useUserMutation, useUserQuery } from '@/hook/user.hook';
import { queryClient } from '@/main';
import { ErrorResponse } from '@/types/common.type';
import { MyReview, ReviewFavoriteUser } from '@/types/item';
import { DOMAIN } from '@/utils/env';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';

// 유저 페이지
const User = () => {
  const { userId } = useParams();
  const { user } = useUserQuery();

  // path query 로 넘어온 id 와 내 정보의 id 가 같으면 본인
  // 본인 여부를 통해 버튼이나 문구를 다르게 하기 위해 필요한 정보
  const isMe = userId && user ? parseInt(userId) === user.id : false;

  const [isNicknameListOpen, setIsNicknameListOpen] = useState<boolean>(false);
  const [isReviewListOpen, setIsReviewListOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsNicknameListOpen(false);
    setIsReviewListOpen(false);
  }, [userId]);

  return (
    <main className="py-[3rem] px-[2rem] min-h-[100vh]">
      <div className="max-w-[45rem] mx-auto">
        <UserSection isMe={isMe} />
        <div className="flex flex-col gap-[1rem] my-[3rem]">
          <StatBox
            title={isMe ? '내가 받은 좋아요' : '좋아요'}
            emoji={'❤️'}
            onClick={() => {
              if (isNicknameListOpen) {
                setIsNicknameListOpen(false);
                return;
              }
              setIsReviewListOpen(false);
              setIsNicknameListOpen(true);
            }}
            isClicked={isNicknameListOpen}
          />
          <StatBox
            title={isMe ? '내가 쓴 리뷰' : '리뷰'}
            emoji={'💬'}
            onClick={() => {
              if (isReviewListOpen) {
                setIsReviewListOpen(false);
                return;
              }
              setIsNicknameListOpen(false);
              setIsReviewListOpen(true);
            }}
            isClicked={isReviewListOpen}
          />
        </div>
        <h1 className="text-lg font-semibold mb-[0.6rem]">
          {isNicknameListOpen ? '좋아요 한 유저' : isReviewListOpen ? '리뷰' : ''}
        </h1>
        {isNicknameListOpen && <FavoriteUserList />}
        {isReviewListOpen && <MyReviewList />}
      </div>
    </main>
  );
};

// function: 유저 정보 가져오기
function getUser(userId: number | string) {
  return request
    .get<UserResponse>(DOMAIN + '/user?userId=' + userId)
    .then((user) => {
      return user;
    })
    .catch((err: ErrorResponse) => {
      console.log(err.message);
      window.alert('유저 정보 가져오기 실패');
      return null;
    });
}

// 유저 정보 섹션
const UserSection = ({ isMe }: { isMe: boolean }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
  const [isUserError, setIsUserError] = useState<boolean>(false);
  const { likeUser, unlikeUser } = useUserMutation({ afterLikeUserSuccess: fetchFavoriteUserIdList });
  const [favoriteUserIdList, setFavoriteUserIdList] = useState<number[] | null>(null);
  // 현재 로그인 되어있는 유저가 현재 페이지의 유저를 즐겨찾기 했는지 여부
  const isFavoriteUser = () => {
    if (!favoriteUserIdList || !user) return false;
    return favoriteUserIdList.length > 0;
  };

  const { userId } = useParams();

  // handler: 수정/닫기 버튼 클릭 핸들러
  function onModifyBtnClick() {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }
  }

  function fetchFavoriteUserIdList() {
    request
      .get<number[]>(DOMAIN + '/users/like/id')
      .then((result: number[]) => {
        console.log(result);
        setFavoriteUserIdList(result);
      })
      .catch((err: ErrorResponse) => {
        console.log(err.message);
      });
  }

  useEffect(() => {
    // 유저 정보 가져오기 메서드
    const fetchUser = async (userId: string) => {
      setIsUserLoading(true);
      setIsUserError(false);

      const user = await getUser(userId);

      if (!user) {
        setIsUserError(true);
      }

      setIsUserLoading(false);

      setUser(user);
    };

    // userId 가 없다면 아무것도 하지 않음
    if (!userId) return;
    // 유저 정보 가져오기 메서드 호출
    fetchUser(userId);
    // 현재 로그인된 유저의 즐겨찾기 유저 id 리스트 가져오기
    fetchFavoriteUserIdList();
  }, [userId]);

  return (
    <div className="relative flex justify-between">
      <div className="flex items-center gap-[1.5rem]">
        <ProfileImage user={user} isLoading={isUserLoading} isError={isUserError} />
        <UserInfo user={user} isLoading={isUserLoading} isError={isUserError} />
      </div>
      {isMe && <Button onClick={onModifyBtnClick}>{isOpen ? '닫기' : '수정'}</Button>}
      {!isMe && !isFavoriteUser() && (
        <Button
          onClick={() => {
            // 즐겨찾기 추가 요청
            if (!user) return;
            likeUser(user.id);
          }}
        >
          즐겨찾기
        </Button>
      )}
      {!isMe && isFavoriteUser() && (
        <Button
          onClick={() => {
            // 즐겨찾기 취소 요청
            if (!user) return;
            unlikeUser(user.id);
          }}
        >
          즐겨찾기 취소
        </Button>
      )}
      <ModifyModal isOpen={isOpen} />
    </div>
  );
};

// 프로필 이미지
type ProfileImageProps = {
  user: UserResponse | null;
  isLoading: boolean;
  isError: boolean;
};

const ProfileImage = (props: ProfileImageProps) => {
  const { user, isError, isLoading } = props;

  if (!user || isLoading || isError) return <div className="size-[80px] bg-black/10"></div>;

  return (
    <div className={'flex flex-col items-center'}>
      <div className={'size-[7rem] border-[0.0625rem] border-black/10 rounded-full overflow-hidden'}>
        {/* 프로필 이미지 */}
        {user.profileImg ? (
          <img src={user.profileImg + `?timestamp=${Date.now()}`} alt="profile image" />
        ) : (
          <div className={'w-full h-full bg-black bg-opacity-20'}></div>
        )}
      </div>
    </div>
  );
};

type UserInfoProps = {
  user: UserResponse | null;
  isLoading: boolean;
  isError: boolean;
};

const UserInfo = (props: UserInfoProps) => {
  const { user, isError, isLoading } = props;

  if (!user || isLoading) return <p>로딩중입니다</p>;

  if (isError) return <p>정보를 불러오지 못했습니다.</p>;

  return (
    <div className={'flex flex-col gap-[5px] text-md'}>
      <p className="font-bold">{user.nickname}</p>
      <p>{user.email}</p>
      <p className={'text-light-black'}>
        <span>가입일 </span> {user.createDate.split('T')[0]}
      </p>
    </div>
  );
};

const ModifyModal = ({ isOpen }: { isOpen: boolean }) => {
  const [isProfileImgModifyModalOpen, setIsProfileImgModifyModalOpen] = useState<boolean>(false);
  const [isNicknameModalOpen, setIsNicknameModalOpen] = useState<boolean>(false);
  const { cancelUser } = useUserMutation();

  if (!isOpen) return null;

  return (
    <div className="absolute top-[3rem] right-0 p-[1.5rem] bg-white border-[0.0625rem] rounded-[1rem] flex flex-col gap-[1rem]">
      <p className="font-semibold">내 정보 수정하기</p>
      <div className="flex flex-col gap-[1rem] text-sm items-start">
        <button
          onClick={() => {
            setIsProfileImgModifyModalOpen(true);
          }}
        >
          프로필 이미지 변경하기
        </button>

        <button
          onClick={() => {
            setIsNicknameModalOpen(true);
          }}
        >
          닉네임 변경
        </button>
        <NicknameModal
          isOpen={isNicknameModalOpen}
          closeModal={() => {
            setIsNicknameModalOpen(false);
          }}
        />

        <AlertDialogComp onConfirmClick={cancelUser} message="정말 탈퇴 하시겠습니까?">
          {/* 로그아웃 팝업 띄울 트리거 버튼 */}
          <button>탈퇴하기</button>
        </AlertDialogComp>
      </div>
      <ProfileImgModifyModal isOpen={isProfileImgModifyModalOpen} setIsOpen={setIsProfileImgModifyModalOpen} />
    </div>
  );
};

// 프로필 이미지 수정 모달
const ProfileImgModifyModal = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) => {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { changeProfileImage, isChangeProfileImagePending, initProfileImg } = useUserMutation();
  const { user } = useUserQuery();

  if (!isOpen) return;

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-black/5">
      <div className="bg-white rounded-[1rem] p-[1.5rem] min-w-[20rem] flex flex-col gap-[1rem] items-center">
        <div className="flex items-center justify-between w-full">
          <p className="font-semibold">프로필 이미지 수정</p>
          <button
            className="text-sm"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            닫기
          </button>
        </div>

        <NewProfileImgPreview previewUrl={previewUrl} />

        <div className="flex flex-col gap-[1rem] w-full">
          <Button
            variant={'outline'}
            onClick={() => {
              if (!user?.profileImg) return;
              initProfileImg();
            }}
          >
            프로필 이미지 제거
          </Button>
          <ImgSelectBtn setFile={setFile} setPreviewUrl={setPreviewUrl} />

          <Button
            onClick={() => {
              if (!file) return;
              changeProfileImage(file);
            }}
          >
            <ClipLoader color="#ffffff" loading={isChangeProfileImagePending} size={12} />
            변경하기
          </Button>
        </div>
      </div>
    </div>
  );
};

// 변경할 프로필 이미지 미리보기
const NewProfileImgPreview = ({ previewUrl }: { previewUrl: string | null }) => {
  return (
    <div className="size-[7rem] bg-black/10 rounded-full overflow-hidden border-[0.0625rem]">
      {previewUrl && <img src={previewUrl ? previewUrl : undefined} alt="profile image preview" />}
    </div>
  );
};

// 변경할 이미지 파일 선택하기 버튼
const ImgSelectBtn = ({
  setFile,
  setPreviewUrl,
}: {
  setFile: (file: File) => void;
  setPreviewUrl: (url: string) => void;
}) => {
  return (
    <div>
      <input
        id={'profile_image'}
        type="file"
        style={{ display: 'none' }} // 파일 선택 모달 여는데만 이용하는 것이라 disply none 으로 설정
        onChange={(e) => {
          const files = e.target.files;
          if (!files) return;

          // 변경할 사진 파일 저장
          setFile(files[0]);

          // 변경할 사진의 미리보기 url 생성
          const reader = new FileReader();
          reader.readAsDataURL(files[0]);
          reader.onload = (e) => {
            const url = e.target ? e.target.result : '';
            setPreviewUrl(url as string);
          };
        }}
      />

      <Button variant={'outline'} asChild={true} className={'w-full cursor-pointer'}>
        <label htmlFor={'profile_image'}>파일 선택하기</label>
      </Button>
    </div>
  );
};

// 닉네임 변경 모달
const NicknameModal = ({ isOpen, closeModal }: { isOpen: boolean; closeModal: () => void }) => {
  const { user } = useUserQuery();
  const { changeNickname } = useUserMutation();
  const [newNickname, setNewNickname] = useState<string>('');
  const [error, setError] = useState<boolean>(true);
  const [errMsg, setErrMsg] = useState<string>('');
  const sameNicknameErrMsg = '기존 닉네임과 동일합니다';
  const notValidNicknameErrMsg = '닉네임은 5자 이상 15자 이하여야 합니다';
  const nicknameRegex = RegExp('^(?=.*[A-Za-z])[A-Za-z\\d]{5,15}$');

  // effect: 변경할 닉네임 에러 설정
  useEffect(() => {
    if (!nicknameRegex.test(newNickname) && newNickname === user?.nickname) {
      setError(true);
    } else {
      setError(false);
    }

    if (!nicknameRegex.test(newNickname)) {
      setErrMsg(notValidNicknameErrMsg);
    }

    if (newNickname === user?.nickname) {
      setErrMsg(sameNicknameErrMsg);
    }
  }, [newNickname, user?.nickname, nicknameRegex]);

  if (!isOpen) return;

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-black/10">
      <div className="w-[20rem] bg-white rounded-[1rem] p-[1.5rem] flex flex-col">
        <h1 className="text-lg font-semibold">닉네임 변경</h1>
        <div className="relative my-[1rem]">
          <Input
            placeholder="변경할 닉네임을 입력해주세요"
            value={newNickname}
            onChange={(e) => setNewNickname(e.target.value)}
          />
          {error && <p className="absolute w-full top-[2.2rem] text-sm text-red-500 my-[0.2rem]">{errMsg}</p>}
        </div>
        <div className="flex flex-col gap-[1rem] mt-[2rem]">
          <Button
            className="w-full"
            onClick={() => {
              if (error) return;
              changeNickname(newNickname);
            }}
          >
            변경
          </Button>
          <Button className="w-full" variant={'outline'} onClick={closeModal}>
            취소
          </Button>
        </div>
      </div>
    </div>
  );
};

const StatBox = ({
  title,
  emoji,
  onClick,
  isClicked,
}: {
  title: string;
  emoji: string;
  onClick?: () => void;
  isClicked?: boolean;
}) => {
  return (
    <button
      className={`flex items-center justify-between text-lg font-semibold w-full border-[0.0625rem] rounded-[1rem] p-[1rem] ${isClicked ? 'border-black/50' : ''}`}
      onClick={onClick}
    >
      <p>{title}</p>
      <p>{emoji}</p>
    </button>
  );
};

const FavoriteUserList = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(0);
  const [totalUserList, setTotalUserList] = useState<ReviewFavoriteUser[]>([]);
  const { userList, isEnd, isNicknameListError } = useReviweFavoriteUserListQuery({
    userId,
    page,
    size: 1,
  });

  useEffect(() => {
    if (!userList || !userList.length) return;
    // 데이터 받아오기 성공 시 페이지 수 증가
    setPage(page + 1);
    // 받아온 데이터 기존 데이터에 합치기
    setTotalUserList([...totalUserList, ...userList]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userList]);

  if (isNicknameListError) return <ErrorComp />;

  if (totalUserList.length === 0) {
    return <p className="text-black/60">아직 받은 좋아요가 없습니다</p>;
  }

  return (
    <div>
      {totalUserList.map((user: ReviewFavoriteUser, index: number) => (
        <p key={index} className="py-[1rem] border-b-[0.0625rem]">
          <span
            className="font-semibold cursor-pointer"
            onClick={() => {
              // 닉네임 클릭하면 해당 유저의 페이지로 이동
              navigate('/user/' + user.userId);
            }}
          >
            {user.nickname}
          </span>{' '}
          님이 좋아요를 눌렀습니다.
        </p>
      ))}
      {!isEnd && (
        <button
          className="w-full my-[1rem]"
          onClick={() => {
            queryClient.resetQueries({
              queryKey: [reviewFavoriteUserListQueryKey],
            });
          }}
        >
          더보기
        </button>
      )}
    </div>
  );
};

const MyReviewList = () => {
  const { userId } = useParams();
  const [page, setPage] = useState<number>(0);
  const [totalReviewList, setTotalReviewList] = useState<MyReview[]>([]);
  const { reviewList, isEnd, isError } = useUserReviewListQuery({
    userId,
    page,
    size: 2,
  });

  useEffect(() => {
    if (!reviewList || !reviewList.length) return;
    // 데이터 받아오기 성공 시 페이지 수 증가
    setPage(page + 1);
    // 받아온 데이터 기존 데이터에 합치기
    setTotalReviewList([...totalReviewList, ...reviewList]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewList]);

  if (isError) return <ErrorComp />;

  if (totalReviewList.length === 0) {
    return <p className="text-black/60">아직 리뷰를 남기지 않았습니다</p>;
  }

  return (
    <div>
      {totalReviewList.map((review: MyReview) => (
        <div key={review.title} className="flex flex-col gap-[1.5rem] py-[1.5rem] border-b-[0.0625rem]">
          <p>{review.content}</p>
          <div className="flex items-center gap-[1rem]">
            <p className="font-semibold">{review.title}</p>
            <p className="text-black/40">{review.author}</p>
          </div>
        </div>
      ))}

      {!isEnd && (
        <button
          className="w-full my-[1rem]"
          onClick={() => {
            queryClient.resetQueries({
              queryKey: [userReviewListQueryKey],
            });
          }}
        >
          더보기
        </button>
      )}
    </div>
  );
};

export default User;
