import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate, useParams } from 'react-router-dom';
import { getCommentListRequest, postCommentRequest } from '../../../../api/api.ts';
import { CommentItem } from '../../../../api/item.ts';
import { PostCommentRequestDto } from '../../../../api/request.dto.ts';
import CommentComp from './CommentComp.tsx';

interface Props {
  // 책이 db 에 있지 않아 카카오 api 에서 받아와야 할 때가 있다.
  // api 에서 데이터를 받고난 뒤 리뷰를 불러오기 위한 prop
  bookLoading: boolean;
}

const CommentSection = ({ bookLoading }: Props) => {
  const [cookies] = useCookies(['jwt']);
  const navigate = useNavigate();
  const { isbn } = useParams();

  const [commentList, setCommentList] = useState<CommentItem[] | null>(null);
  const [content, setContent] = useState<string>('');

  const [emojiIndex, setEmojiIndex] = useState<number>(0);
  const emojiList = ['😀', '🥲', '🤯', '😱'];


  // function: 리뷰 가져오기
  const getCommentList = () => {
    if (!isbn) return;
    getCommentListRequest(isbn).then((result) => {
      if (result === null) {
        window.alert('댓글 가져오기 실패');
      }
      setCommentList(result);
    });
  };

  // function: 리뷰 작성
  const postComment = async (requestDto: PostCommentRequestDto) => {
    return await postCommentRequest(cookies.jwt, requestDto).then((res) => {
      if (!res) {
        window.alert('댓글 작성 실패. 다시 시도해주세요');
        return false;
      }
      return true;
    });
  };

  // effect: 화면 로딩 시 리뷰 불러오기
  useEffect(() => {
    if (!bookLoading) return;
    getCommentList();
  }, [bookLoading]);

  // render
  return (
    <section className={'flex justify-center mt-[60px] mx-[5%] text-[14px]'}>
      <div className={'w-full max-w-[700px]'}>
        <div>
          <p className={'font-semibold text-[16px] my-[15px]'}>리뷰</p>
        </div>
        {/* 댓글 작성창 */}
        {/* 로그인 되어 있을 때 */}
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
        {/* 로그인 안 되어 있을 때 */}
        {!cookies.jwt && (
          <p className={'p-[30px] bg-black bg-opacity-5 rounded-[10px]'}>
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
      </div>
    </section>
  );
};

export default CommentSection;
