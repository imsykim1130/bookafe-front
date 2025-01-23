import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CommentItem } from '../../../../api/item.ts';
import { getCommentListRequest, postCommentRequest } from '../../../../api';
import { PostCommentRequestDto } from '../../../../api/request.dto.ts';
import CommentComp from './CommentComp.tsx';

interface Props {
  bookLoading: boolean;
}

const CommentSection = ({ bookLoading }: Props) => {
  const [cookies, _] = useCookies();
  const navigate = useNavigate();
  const { isbn } = useParams();

  const [commentList, setCommentList] = useState<CommentItem[] | null>(null);
  const [content, setContent] = useState<string>('');

  const [emojiIndex, setEmojiIndex] = useState<number>(0);
  const emojiList = ['😀', '🥲', '🤯', '😱'];

  const getCommentList = () => {
    if (!isbn) return;
    getCommentListRequest(isbn).then((result) => {
      if (result === null) {
        window.alert('댓글 가져오기 실패');
      }
      setCommentList(result);
    });
  };

  const postComment = async (requestDto: PostCommentRequestDto) => {
    return await postCommentRequest(cookies.jwt, requestDto).then((res) => {
      if (!res) {
        window.alert('댓글 작성 실패. 다시 시도해주세요');
        return false;
      }
      return true;
    });
  };

  useEffect(() => {
    if (!bookLoading) return;
    getCommentList();
  }, [bookLoading]);

  return (
    <section className={'mt-[60px] mx-[5%] md:mx-[15%] lg:mx-[20%] text-[14px]'}>
      <div>
        <p className={'font-semibold text-[16px] my-[15px]'}>리뷰</p>
      </div>
      {/* 댓글 작성창 */}
      {cookies.jwt && (
        <div className={'flex flex-col gap-[15px]'}>
          <textarea
            className={
              'w-full min-h-[100px] p-[20px] pb-[40px] outline-none border-[1px] border-black border-opacity-15 rounded-[5px] resize-none'
            }
            value={content}
            placeholder={'책에 대한 감상을 남겨주세요 😃'}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className={'flex justify-between items-center'}>
            <div
              className={
                'border-[1px] border-black border-opacity-10 rounded-[20px] p-[10px] flex gap-[20px] items-center text-[20px]'
              }
            >
              {emojiList.map((emoji, index) => (
                <div
                  key={emoji}
                  className={`w-[30px] h-[30px] flex justify-center items-center rounded-full ${index === emojiIndex ? 'bg-black bg-opacity-10' : ''}`}
                >
                  <span
                    className={'cursor-pointer'}
                    onClick={() => {
                      setEmojiIndex(index);
                    }}
                  >
                    {emoji}
                  </span>
                </div>
              ))}
            </div>
            <button
              className={
                'border-[1px] border-black border-opacity-80 rounded-[5px] px-[10px] py-[5px] duration-200 hover:bg-black hover:bg-opacity-5'
              }
              onClick={() => {
                if (!isbn) return;
                const requestDto: PostCommentRequestDto = {
                  parentId: null,
                  isbn: isbn,
                  content: content,
                  emoji: emojiList[emojiIndex],
                };
                postComment(requestDto).then((isSuccess) => {
                  if (isSuccess) {
                    setContent('');
                    setEmojiIndex(0);
                    getCommentList();
                  }
                });
              }}
            >
              작성
            </button>
          </div>
        </div>
      )}
      {!cookies.jwt && (
        <p className={'p-[20px] bg-black bg-opacity-5'}>
          리뷰 작성은{' '}
          <span
            className={'font-semibold cursor-pointer'}
            onClick={() => {
              navigate('/auth/sign-in', { state: { pathname: '/book/detail/' + isbn } });
            }}
          >
            로그인
          </span>{' '}
          후 가능합니다
        </p>
      )}
      {/* 댓글 리스트 */}
      <div className={'mt-[60px]'}>
        {commentList &&
          commentList.map((item) => <CommentComp key={item.id} comment={item} getCommentList={getCommentList} />)}
      </div>
    </section>
  );
};

export default CommentSection;
