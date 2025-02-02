import { useNavigate } from 'react-router-dom';

interface Props {
  searchWord: string;
  setSearchWord: React.Dispatch<React.SetStateAction<string>>;
  onEnter?: () => void;
}

const SearchBox = (props: Props) => {
  const { searchWord, setSearchWord, onEnter } = props;
  const navigate = useNavigate();

  return (
    <div className={'relative'}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6 absolute left-[20px] top-1/2 -translate-y-1/2 text-default-black"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
        />
      </svg>
      <input
        type="text"
        placeholder={'검색하고 싶은 단어를 입력하세요...'}
        value={searchWord}
        className="w-full px-[60px] py-[15px] border-[1px] rounded-[10px] border-black border-opacity-10 outline-none"
        onChange={(e) => {
          setSearchWord(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if(onEnter !== undefined) {
              onEnter();
            }
            navigate(`/search/${searchWord}`);
          }
        }}
      />
    </div>
  );
};

export default SearchBox;
