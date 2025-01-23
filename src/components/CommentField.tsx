import { Dispatch, forwardRef, useState } from 'react';
import axios from 'axios';
import { ResponseDto } from '../api/response.dto.ts';
import { commentRequest, replyRequest } from '../api';
import { useCookies } from 'react-cookie';

interface Props {
  isbn: string;
  dispatch: Dispatch<any>;
  commentId?: number;
  placeholder: string;
}

const CommentField = forwardRef<HTMLTextAreaElement, Props>((props, ref) => {
  const [comment, setComment] = useState<string>('');
  const { dispatch, isbn, commentId, placeholder } = props;
  const [cookies, _] = useCookies();
  const emojiList = ['😀', '🥲', '😍', '🤯', '😱'];
  const [emojiIndex, setEmojiIndex] = useState<number>(0);

  const putCommentRequest = async (parentId: number | null, isbn: string, comment: string, emoji: string) => {
    const requestBody = {
      parentId: parentId,
      isbn: isbn,
      content: comment,
      emoji: emoji,
    };
    await axios
      .post('http://localhost:8080/api/v1/comment', requestBody, {
        headers: {
          Authorization: `Bearer ${cookies.jwt}`,
        },
      })
      .then((res) => {
        const { message } = res.data as ResponseDto;
        console.log(message);
        // 댓글 필드 초기화
        setComment('');
        // 이모티콘 초기화
        setEmojiIndex(0);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="relative pb-[60px]">
      {/* 댓글 작성창*/}
      <textarea
        ref={ref}
        className="text-md text-default-black w-full resize-none border-[1px] rounded-[5px] min-h-[100px] outline-none pt-[15px] px-[15px]"
        placeholder={cookies.jwt ? placeholder : '로그인이 필요합니다'}
        value={comment}
        disabled={!cookies.jwt}
        onChange={(e) => {
          setComment(e.target.value);
        }}
      />
      <div className={'absolute bottom-[18px] right-[10px] flex gap-[15px] items-center'}>
        <div className={'flex gap-[15px] border-[1px] border-opacity-20 border-black rounded-full px-[10px] py-[5px]'}>
          {emojiList.map((emoji, index) => (
            <span
              key={index}
              className={`w-[24px] aspect-[1/1] leading-none flex justify-center items-center cursor-pointer ${emojiIndex === index ? 'bg-black bg-opacity-10 rounded-full px-[4px] py-[4px]' : ''}`}
              onClick={() => {
                setEmojiIndex(index);
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
        {/* 댓글 작성 버튼*/}
        <button
          className="text-default-black text-md rounded-[5px] border-[1px] border-black border-opacity-[60%] px-[8px] py-[3px] bg-white"
          onClick={async () => {
            if (commentId) {
              console.log('comment id exist');
              await putCommentRequest(commentId, isbn, comment, emojiList[emojiIndex]);
              await replyRequest(dispatch, commentId);
            } else {
              console.log('comment id no exist');
              await putCommentRequest(null, isbn, comment, emojiList[emojiIndex]);
              await commentRequest(dispatch, isbn, null);
            }
          }}
        >
          작성
        </button>
      </div>
    </div>
  );
});

export default CommentField;
