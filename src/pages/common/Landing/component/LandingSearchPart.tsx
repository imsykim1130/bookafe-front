import SearchBox from "@/components/SearchBox";
import { BookSearchItem } from '@/api/item.ts';
import BookPrev from "@/components/BookPrev";


interface Props {
    searchWord: string;
    setSearchWord:React.Dispatch<React.SetStateAction<string>>;
    searchBookList: BookSearchItem[]
}

const LandingSearchPart = ({searchWord, setSearchWord, searchBookList}:Props) => {
    return (
      <div className={'absolute flex flex-col w-full items-center top-[120px] px-[5%]'}>
        <div className={'w-full max-w-[25rem]'}>
          <SearchBox searchWord={searchWord} setSearchWord={setSearchWord} />
          {/* 검색 미리보기 */}
          {searchBookList.length ? (
            <div
              className={
                'mt-[1rem] z-50 w-full h-[400px] p-[5px] flex flex-col bg-white rounded-[10px] drop-shadow-md overflow-scroll scroll-smooth'
              }
            >
              {searchBookList.map((book) => (
                <div
                  key={book.isbn}
                  className={'rounded-[10px] p-[15px] hover:bg-black hover:bg-opacity-5 duration-200'}
                >
                  <div className={'w-[100px]'}>
                    <BookPrev
                      bookImg={book.bookImg}
                      author={book.author}
                      title={book.title}
                      isbn={book.isbn}
                      imgSize={3}
                    />
                  </div>
                </div>
              ))}
              <button className={'font-semibold py-[10px] hover:bg-black hover:bg-opacity-5 rounded-[10px]'}>
                검색결과 더보기
              </button>
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  export default LandingSearchPart;