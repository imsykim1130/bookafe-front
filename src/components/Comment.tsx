import React, { Reducer, useEffect, useReducer, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { CommentItem } from '../api/item';
import { replyRequest } from '../api/request.ts';
import { ReplyAction, ReplyState } from '../reducer';
import CommentField from './CommentField.tsx';
import Reply from './Reply.tsx';

interface Prop {
  comment: CommentItem;
}

const replyReducer: Reducer<ReplyState, ReplyAction | any> = (prevState, action) => {
  if (action.type === 'loading') {
    return { ...prevState, loading: true };
  }
  if (action.type === 'success') {
    return { ...prevState, loading: false, error: false, replyList: action.payload };
  }
  if (action.type === 'error') {
    return { ...prevState, loading: false, error: true };
  }
  return prevState;
};

const initialState: ReplyState = {
  replyList: [],
  loading: false,
  error: false,
};

const Comment = React.memo((prop: Prop) => {
  const [replyOpen, setReplyOpen] = useState<boolean>(false);
  const { comment } = prop;
  const [reply, replyDispatch] = useReducer<Reducer<ReplyState, ReplyAction>>(replyReducer, initialState);
  const [cookies, _] = useCookies();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { isbn } = useParams();

  useEffect(() => {
    if (!reply.loading) replyRequest(replyDispatch, comment.id);
  }, []);

  return (
    <div className="flex flex-col gap-[20px] mt-[30px] mx-[5%] md:mx-[10%] lg:mx-[15%]">
      {/* 댓글*/}
      <div className="flex flex-col gap-[10px] mx-[20px]">
        {/* 위 */}
        <div className="flex gap-[10px] items-center">
          {/* 프로필 이미지*/}
          <div className={'w-[20px] h-[20px] flex justify-center items-center'}>
            {comment.profileImg ? (
              <img src={comment.profileImg} alt="" />
            ) : (
              <i className="fi fi-rr-circle-user text-default-black text-[20px]"></i>
            )}
          </div>
          {/* 닉네임 */}
          <p className="text-default-black text-md">{comment.nickname}</p>
          {/* 작성 날짜*/}
          <p className="text-light-black text-md">{comment.writeDate}</p>
          {/* 이모티콘*/}
          <span>{comment.emoji}</span>
          {/* 구매자 뱃지*/}
          <div className="border-[1px] rounded-[20px] border-orange-500 text-orange-500 text-sm px-[4px]">구매자</div>
        </div>
        {/* 중간 */}
        <div>
          <p className="text-md text-default-black">{comment.content}</p>
        </div>
        {/* 아래 */}
        <div className="flex justify-end gap-[30px] text-md">
          <div className={'flex gap-[15px] items-center'}>
            {/* 댓글 수*/}
            <div className="flex gap-[5px] items-center">
              {/* 댓글 수 아이콘*/}
              <i
                className="fi fi-rs-comment cursor-pointer"
                onClick={async () => {
                  if (replyOpen) {
                    setReplyOpen(false);
                    return;
                  }
                  await replyRequest(replyDispatch, comment.id);
                  setReplyOpen(true);
                }}
              ></i>
              <span className="text-default-black text-md">{reply.replyList.length}</span>
            </div>
            {/* 좋아요 수*/}
            <div className="flex gap-[5px] items-center">
              {/* 좋아요 수 아이콘*/}
              <i className="fi fi-rs-heart cursor-pointer"></i>
              {/*<i className="fi fi-ss-heart"></i>*/}
              <span className="text-default-black text-md">{0}</span>
            </div>
          </div>
        </div>
      </div>
      {/* 구분선 */}
      <span className="w-full h-[1px] bg-extra-light-black block"></span>
      {/* 대댓글 리스트 컨테이너*/}
      {replyOpen ? (
        <div className="w-full">
          {/* 대댓글 작성창*/}
          <div>
            {cookies.jwt ? (
              <div className="relative">
                {/* 리플 작성창*/}
                <CommentField
                  isbn={isbn as string}
                  dispatch={replyDispatch}
                  commentId={comment.id}
                  placeholder="댓글에 대한 의견을 남겨주세요"
                />
              </div>
            ) : (
              // 미로그인 시 리플 작성창
              <div
                className="w-full bg-extra-light-black rounded-[5px] text-md text-light-black text-center py-[15px] cursor-pointer"
                onClick={() => {
                  navigate('/auth/sign-in', { state: { pathname: pathname } });
                }}
              >
                답글 작성은 로그인 이후 가능합니다.
              </div>
            )}
          </div>
          {/* 대댓글*/}
          {reply.replyList.map((reply, index) => (
            <Reply key={index} reply={reply} />
          ))}
        </div>
      ) : (
        ''
      )}
    </div>
  );
});

export default Comment;
