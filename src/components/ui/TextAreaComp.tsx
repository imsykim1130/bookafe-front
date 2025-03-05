import { useJwt } from "@/hook/hooks";

//// 리뷰 인풋창
type ReviewTextAreaProps = {
  content: string;
  setContent: (content: string) => void;
  loggedInPlaceholder: string;
  loggedOutPlaceholder: string
};

const TextAreaComp = (props: ReviewTextAreaProps) => {
  const { content, setContent, loggedInPlaceholder, loggedOutPlaceholder } = props;
  const { jwt } = useJwt();
  return (
    <textarea
      className={
        'w-full min-h-[100px] p-[20px] pb-[40px] outline-none border-[1px] border-black border-opacity-15 rounded-[10px] resize-none'
      }
      disabled={!jwt}
      value={content}
      placeholder={jwt ? loggedInPlaceholder : loggedOutPlaceholder}
      onChange={(e) => setContent(e.target.value)}
    />
  );
};

export default TextAreaComp;