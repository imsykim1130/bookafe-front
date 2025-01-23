import { CommentItem } from '../api/item.ts';

interface Props {
  reply: CommentItem;
}

const Reply = ({ reply }: Props) => {
  return (
    <div className={'mt-[10px] px-[20px] py-[20px] rounded-[5px] bg-extra-light-black flex flex-col gap-[15px]'}>
      {/* 위 */}
      <div className="flex gap-[20px] text-md">
        <p className={'text-default-black text-md'}>{reply.nickname}</p>
        <p className={'text-light-black text-md'}>{reply.writeDate}</p>
      </div>
      {/* 아래 */}
      <div className={'text-default-black text-md'}>{reply.content}</div>
    </div>
  );
};

export default Reply;
