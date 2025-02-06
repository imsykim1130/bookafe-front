import moment from 'moment/moment';
import { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  deleteCommentRequest,
  getReplyListRequest,
  modifyCommentRequest,
  postCommentRequest,
} from '../../../../api/api.ts';
import { CommentItem, UserItem } from '../../../../api/item.ts';
import { PostCommentRequestDto } from '../../../../api/request.dto.ts';
import FavoriteCount from './FavoriteCount.tsx';

interface CommentCompProp {
  comment: CommentItem;
  getCommentList: () => void;
}

const CommentComp = ({ comment, getCommentList }: CommentCompProp) => {
  const { nickname } = useSelector((state: { user: UserItem }) => state.user);
  const [cookies, _] = useCookies();
  const { isbn } = useParams();

  const [content, setContent] = useState<string>('');
  const [isModify, setIsModify] = useState<boolean>(false);
  const originalContent = useRef<string>('');

  const [isReplyOpen, setIsReplyOpen] = useState<boolean>(false);
  const [replyList, setReplyList] = useState<CommentItem[] | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');
  const [replyCount, setReplyCount] = useState<number>(0);

  // effect
  useEffect(() => {
    setContent(comment.content);
    setReplyCount(comment.replyCount);
  }, []);

  useEffect(() => {
    if (!replyList) {
      return;
    }
    setReplyCount(replyList.length);
  }, [replyList]);

  // request
  /* 댓글 수정 요청 */
  const modifyComment = () => {
    modifyCommentRequest(cookies.jwt, comment.id, content).then((res) => {
      if (!res) {
        window.alert('수정 실패. 다시 시도해주세요');
        return;
      }
      setIsModify(false);
      setContent(res);
    });
  };

  /* 댓글 삭제 요청 */
  const deleteComment = () => {
    deleteCommentRequest(cookies.jwt, comment.id).then((res) => {
      if (!res) {
        window.alert('댓글 삭제 실패! 다시 시도해주세요');
        return;
      }
      getCommentList();
    });
  };

  /* 리플 가져오기 요청 */
  const getReplyList = () => {
    getReplyListRequest(comment.id).then((res) => {
      if (!res) {
        window.alert('리플 가져오기 실패! 다시 시도해주세요');
        return;
      }
      setReplyList(res);
    });
  };

  // handler
  const commentModifyCancelBtnClickHandler = () => {
    setIsModify(false);
    setContent(originalContent.current);
  };

  const commentModifyBtnClickHandler = () => {
    setIsModify(true);
    originalContent.current = content;
  };

  // function
  const getProfileImageUrl = (fileName: string) => {
    return `http://localhost:8080/image/${fileName}`;
  };

  // render 함수
  const commentInfoRender = () => (
    <div className={'flex gap-[10px] items-center'}>
      <div className={'w-[30px] h-[30px] rounded-full overflow-hidden flex justify-center items-center'}>
        {comment.profileImg ? (
          <img src={getProfileImageUrl(comment.profileImg)} alt="profile image" />
        ) : (
          <div className={'flex justify-center items-center w-full h-full bg-black bg-opacity-5'}>
            <i className="fi fi-br-user text-black text-opacity-20"></i>
          </div>
        )}
      </div>
      <span className={'font-semibold'}>{comment.nickname}</span>
      <span className={'text-black text-opacity-60'}>{moment(comment.writeDate).format('YYYY.MM.DD')}</span>
      <span>{comment.emoji ? comment.emoji : ''}</span>
    </div>
  );

  const modifyButtonRender = () =>
    isModify ? (
      <div className={'flex gap-[15px] font-semibold'}>
        <button onClick={modifyComment}>완료</button>
        <span className={'w-[1px] bg-black bg-opacity-60'}></span>
        <button onClick={commentModifyCancelBtnClickHandler}>취소</button>
      </div>
    ) : (
      <div className={'flex gap-[15px] text-black text-opacity-60'}>
        <button onClick={commentModifyBtnClickHandler}>수정</button>
        <span className={'w-[1px] bg-black bg-opacity-60'}></span>
        <button onClick={deleteComment}>삭제</button>
      </div>
    );

  const replyContentRender = () => (
    <div className={'flex flex-col items-end mb-[20px]'}>
      <textarea
        className={
          'resize-none w-full min-h-[100px] outline-none border-[1px] border-black border-opacity-10 rounded-[5px] p-[15px] box-border'
        }
        placeholder={'리뷰에 대한 의견을 남겨주세요'}
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
      />
      <button
        className={'border-[1px] border-black border-opacity-80 rounded-[5px] mt-[15px] px-[10px] py-[5px]'}
        onClick={() => {
          const requestDto: PostCommentRequestDto = {
            parentId: comment.id,
            isbn: isbn as string,
            content: replyContent,
            emoji: null,
          };
          postCommentRequest(cookies.jwt, requestDto).then((res) => {
            if (!res) {
              window.alert('리플 작성 실패! 다시 시도해주세요');
              return;
            }
            setReplyContent('');
            getReplyList();
          });
        }}
      >
        작성
      </button>
    </div>
  );

  const replyListRender = () =>
    replyList && (
      <div className={'flex flex-col gap-[20px]'}>
        {replyList.map((item) => (
          // 리플
          <div key={item.id} className={'flex flex-col gap-[10px] p-[20px] rounded-[5px] bg-black bg-opacity-10'}>
            <div className={'flex items-center gap-[10px]'}>
              <span>{`re : ${item.nickname}`}</span>
              <span className={'text-black text-opacity-60'}>{moment(item.writeDate).format('YYYY.MM.DD')}</span>
            </div>
            <div>{item.content}</div>
          </div>
        ))}
      </div>
    );

  // render //
  return (
    // 리뷰
    <article className={'flex flex-col pt-[20px] border-b-[1px] border-black border-opacity-20'}>
      <div>
        <div className={'flex justify-between items-center'}>
          {/* 리뷰 관련 정보 */}
          {commentInfoRender()}
          {/* 리뷰 수정, 삭제 버튼 */}
          {nickname === comment.nickname && !comment.isDeleted && modifyButtonRender()}
        </div>
        {/* 리뷰 내용 */}
        <div className={'pl-[40px] mt-[10px]'}>
          {isModify ? (
            <textarea
              value={content}
              className={'outline-none resize-none w-full'}
              onChange={(e) => setContent(e.target.value)}
            />
          ) : (
            <p>{content ? content : '삭제된 댓글입니다'}</p>
          )}
        </div>
      </div>
      <div className={'mb-[30px] flex gap-[20px] justify-end'}>
        {/* 리플 개수 표시 */}
        <div
          className={'flex gap-[5px] items-center cursor-pointer'}
          onClick={() => {
            setIsReplyOpen(!isReplyOpen);
            if (!isReplyOpen) {
              getReplyList();
            }
          }}
        >
          <span>💬</span>
          <span>{replyCount}</span>
        </div>
        {/* 좋아요 개수 표시 */}
        <FavoriteCount commentId={comment.id} />
      </div>
      {/* 리플 리스트 */}
      {isReplyOpen && (
        <div className={'pl-[30px] flex flex-col gap-[30px]'}>
          {/* 리플 리스트 */}
          {replyList && replyList.length ? replyListRender() : null}
          {/* 리플 작성창 */}
          {cookies.jwt && !comment.isDeleted && replyContentRender()}
        </div>
      )}
    </article>
  );
};

export default CommentComp;
