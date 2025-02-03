/* eslint-disable react-hooks/exhaustive-deps */
import SearchBox from '@/components/SearchBox.tsx';
import { Dispatch, Reducer, useEffect, useReducer, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BookPrevData } from '../api/item.ts';
import { getSearchBookListRequestDto } from '../api/request.dto.ts';
import { getSearchBookRequest } from '../api/request.ts';
import { getSearchBookListResponseDto } from '../api/response.dto.ts';
import BookPrev from '../components/BookPrev.tsx';

// index: interface
// reducer state 타입
interface BooksStateType {
  items: BookPrevData[];
  loading: boolean;
  error: boolean;
  isLast: boolean;
  total: number;
  currentPage: number;
}

// reducer action 타입
interface BooksActionType {
  type: string;
  payload?: BookPrevData[];
  total?: number;
  targetPage?: number;
}

// index: reducer
// action
// - 초기화 : state 초기화
// - 데이터 받는 중 : loading false -> true, error false
// - 데이터 받기 성공 : loading true -> false, error false, 데이터 추가
// - 데이터 받기 실패 : loading false, error true
// - 마지막 데이터 : loading true -> false, error false, isLast true, 데이터 추가
const bookReducer: Reducer<BooksStateType, BooksActionType> = (state, action) => {
  if (action.type === 'init') {
    return {
      items: [],
      loading: false,
      error: false,
      isLast: false,
      total: 0,
      currentPage: 0,
    };
  }
  if (action.type === 'searching') {
    return { ...state, loading: true, error: false };
  }
  if (action.type === 'success') {
    console.log(state.currentPage);
    return {
      ...state,
      items: [...state.items, ...(action.payload as BookPrevData[])], // 기존의 값에 추가로 불러온 값 합치기
      loading: false,
      error: false,
      total: action.total,
      currentPage: state.currentPage + 1,
    } as BooksStateType;
  }

  if (action.type === 'error') {
    return { ...state, loading: false, error: true };
  }

  if (action.type === 'last') {
    return {
      ...state,
      isLast: true,
      total: action.total,
      items: [...state.items, ...(action.payload as BookPrevData[])],
    } as BooksStateType;
  }

  return state;
};

const getSearchBooks = async (params: getSearchBookListRequestDto, dispatch: Dispatch<BooksActionType>) => {
  await getSearchBookRequest(params)
    .then((response) => {
      // 책 데이터 받아오기 성공
      const { bookList, meta } = response.data as getSearchBookListResponseDto;
      const { is_end, total_count } = meta;

      if (is_end) {
        dispatch({ type: 'last', payload: bookList, total: total_count });
      } else {
        dispatch({ type: 'success', payload: bookList, total: total_count });
      }
    })
    .catch((error) => {
      // 책 데이터 받아오기 실패
      dispatch({ type: 'error' });
      console.log(error.response.data);
    });
};

// index: search component
const Search = () => {
  const { searchWord } = useParams();
  const observeRef = useRef(null);
  const [newSearchWord, setNewSearchWord] = useState<string>('');

  const [books, dispatch] = useReducer<Reducer<BooksStateType, BooksActionType>>(bookReducer, {
    items: [],
    loading: false,
    error: false,
    isLast: false,
    total: 0,
    currentPage: 0,
  });

  const size = 50;

  useEffect(() => {
    if (!books.loading || !searchWord) return;

    getSearchBooks(
      {
        query: searchWord,
        sort: 'accuracy',
        page: books.currentPage + 1,
        size: size,
        target: 'title',
      },
      dispatch,
    );
  }, [books.loading]); // 옵저버가 감지되면 loading 을 true 로 변경시켜서 책 데이터를 추가로 가지고 오게된다.


  useEffect(() => {
    if (!searchWord) return;

    // 검색어가 바뀌면 state 를 초기화 한다.
    dispatch({ type: 'init' });
    
    // 초기 데이터 가져오기
    getSearchBooks(
      {
        query: searchWord,
        sort: 'accuracy',
        page: books.currentPage + 1,
        size: size,
        target: 'title',
      },
      dispatch,
    );
    
    // 옵저버
    const observer = new IntersectionObserver(
      (entries) => {
        // 옵저버의 관찰 대상이 하나이기 때문에 첫번째 엔트리만 확인하면 된다.
        if (entries[0].isIntersecting) {
          console.log('intersecting');
          // 데이터를 가져오는 중이거나 더이상 가져올 데이터가 없을 때 옵저버 무시
          if (books.loading || books.isLast || books.items.length <= size) return;
          dispatch({ type: 'searching' }); // books.loading 을 true 로 변경
        }
      },
      {
        threshold: 1, // 요소가 다 보이면 콜백 함수 호출. [0.2, 0.5] 이런 식으로 가시성 여러개 설정 가능
      },
    );

    // 옵저버 설정
    if (observeRef.current) {
      observer.observe(observeRef.current);
    }
    // 검색어
    setNewSearchWord(searchWord);

    // 옵저버 해제
    return () => {
      if (observeRef.current) {
        observer.unobserve(observeRef.current);
      }
    };
  }, [searchWord]);

  return (
    <section className="margin-sm md:margin-md mt-[60px] flex flex-col items-center">
      <div className="max-w-[850px] flex flex-col gap-[20px]">
        <SearchBox searchWord={newSearchWord} setSearchWord={setNewSearchWord} />
        {/* 총 검색결과 개수*/}
        <div className="w-full">
          <p className="text-default-black text-md">
            검색결과 총 <span>{books.total}</span>개
          </p>
        </div>
        {/* 검색 결과 리스트 */}
        {/* 최소 높이를 스크린 높이로 하여 데이터가 없을 때 옵저버 인식 요소가 인식되지 않게 하여 추가 데이터 요청이 들어오지 않도록 함 */}
        <div className="grid grid-cols-3 min-[800px]:grid-cols-4 min-[1100px]:grid-cols-5 gap-[30px] mb-[100px] text-md min-h-screen">
          {books.items.map((item, index) => (
            <BookPrev
              key={index}
              bookImg={item.bookImg}
              author={item.author}
              title={item.title}
              isbn={item.isbn}
              imgSize={140}
            />
          ))}
          {books.loading ? <p>loading...</p> : ''}
        </div>
        {/* 옵저버 인식을 위한 요소 */}
        <div ref={observeRef}></div>
      </div>
    </section>
  );
};

export default Search;
