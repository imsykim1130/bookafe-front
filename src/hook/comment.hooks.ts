import { request } from '@/api/template';
import { ErrorResponse } from '@/types/common.type';
import { DOMAIN } from '@/utils/env';
import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
  useInfiniteQuery,
  useMutation,
  useQuery,
} from '@tanstack/react-query';

// 책의 리뷰 리스트 쿼리
export type Comment = {
  id: number;
  profileImg: string;
  nickname: string;
  writeDate: string;
  emoji: string;
  content: string;
  replyCount: number;
  isDeleted: boolean;
};

type UseReviewListQueryParams = {
  isbn: string | undefined;
  page?: number;
};

interface UseReviewListQueryReturn {
  reviewList: Comment[];
  isReviewListLoading: boolean;
  isReviewListError: boolean;
}

type UseReviewListQuery = (params: UseReviewListQueryParams) => UseReviewListQueryReturn;

export const reviewListQueryKey = 'reviewList';

export const useReviewListQuery: UseReviewListQuery = (params) => {
  const { isbn, page = 0 } = params;
  const {
    data: reviewList,
    isLoading: isReviewListLoading,
    isError: isReviewListError,
  } = useQuery({
    queryKey: [reviewListQueryKey, isbn, page],
    queryFn: () => {
      return request.get<Comment[]>(DOMAIN + '/comment/list/' + isbn);
    },
    enabled: !!isbn,
    initialData: [],
  });
  return { reviewList, isReviewListLoading, isReviewListError };
};

//// 리뷰의 리플 리스트 쿼리
export const replyListQueryKey = 'replyList';

interface UseReplyListQueryReturn {
  replyList: Comment[];
  isReplyListLoading: boolean;
  isReplyListError: boolean;
}

type UseReplyListQuery = (reviewId: number, replyOpen: boolean) => UseReplyListQueryReturn;

export const useReplyListQuery: UseReplyListQuery = (reviewId: number, replyOpen: boolean) => {
  const {
    data: replyList,
    isLoading: isReplyListLoading,
    isError: isReplyListError,
  } = useQuery({
    queryKey: [replyListQueryKey, reviewId],
    queryFn: () => {
      console.log('hi');
      return request.get<Comment[]>(DOMAIN + '/comment/reply/list/' + reviewId);
    },
    enabled: replyOpen,
    initialData: [],
  });

  console.log(replyList);

  return { replyList, isReplyListLoading, isReplyListError };
};

// 유저의 리뷰 리스트 쿼리
export type MyReview = {
  content: string;
  createdAt: string;
  title: string;
  author: string;
};

type UseUserReviewListQueryParams = {
  userId: number; // 유저 id
  size: number; // 한 번에 가져올 데이터 개수
};
interface UseUserReviewListQueryReturn {
  userReviewList: MyReview[][];
  isError: boolean;
  isLoading: boolean;
  fetchNextPage: (
    options?: FetchNextPageOptions,
  ) => Promise<InfiniteQueryObserverResult<InfiniteData<MyReview[], unknown>, Error>>;
}

type UseUserReviewListQuery = (params: UseUserReviewListQueryParams) => UseUserReviewListQueryReturn;
export const userReviewListQueryKey = 'userReviewList';
export const useUserReviewListQuery: UseUserReviewListQuery = (params) => {
  const { userId, size } = params;
  const { data, isError, isLoading, fetchNextPage } = useInfiniteQuery({
    queryKey: [userReviewListQueryKey, userId],
    queryFn: ({ pageParam }: { pageParam: number }) => {
      return request.getWithParams<MyReview[], { userId: number; size: number; page: number }>(
        DOMAIN + '/comment/my/list',
        {
          userId,
          size,
          page: pageParam,
        },
      );
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => (lastPage.length > 0 ? pages.length + 1 : undefined), // 가져온 데이터의 길이가 0 이면 더 이상 가져올 데이터가 없기 때문에 pageParam 을 undefined 반환
    maxPages: 5,
  });

  const userReviewList = data ? data.pages : [];

  return { userReviewList, isError, isLoading, fetchNextPage };
};

// 내 리뷰의 좋아요 유저 리스트 쿼리
export const reviewFavoriteUserListQueryKey = 'reviewFavoriteUserList';

export type ReviewFavoriteUser = {
  userId: number;
  nickname: string;
};

type ReviewFavoriteUserListResonse = {
  userList: ReviewFavoriteUser[];
  isEnd: boolean;
  totalCount: number;
};

type UseReviewFavoriteUserListQueryParams = {
  userId: string | undefined;
  page: number;
  size: number;
};
interface UseReviewFavoriteUserListQueryReturn {
  userList: ReviewFavoriteUser[] | undefined;
  isEnd: boolean;
  totalCount: number;
  isNicknameListLoading: boolean;
  isNicknameListError: boolean;
}

type UseReviewFavoriteUserListQuery = (
  params: UseReviewFavoriteUserListQueryParams,
) => UseReviewFavoriteUserListQueryReturn;

export const useReviweFavoriteUserListQuery: UseReviewFavoriteUserListQuery = (params) => {
  const {
    data,
    isError: isNicknameListError,
    isLoading: isNicknameListLoading,
  } = useQuery({
    queryKey: [reviewFavoriteUserListQueryKey],
    queryFn: () => {
      return params.userId
        ? request.getWithParams<ReviewFavoriteUserListResonse, { userId: string; page: number; size: number }>(
            DOMAIN + '/comment/favorite/user-list',
            {
              userId: params.userId,
              page: params.page,
              size: params.size,
            },
          )
        : undefined;
    },
  });

  const userList = data?.userList;
  const isEnd = data?.isEnd ?? false;
  const totalCount = data?.totalCount ?? 0;

  return { userList, isEnd, totalCount, isNicknameListError, isNicknameListLoading };
};

// 리뷰, 댓글 mutation
export type CommentRequestVar = {
  parentId: number | null;
  isbn: string | undefined;
  content: string;
  emoji: string | null;
  commentId: number;
  reviewId: number;
  replyId: number;
};

export type PostCommentRequest = Pick<CommentRequestVar, 'parentId' | 'isbn' | 'content' | 'emoji'>;
export type PatchCommentRequest = Pick<CommentRequestVar, 'commentId' | 'content'>;

export type UseCommentMutationParams = {
  // 리뷰 핸들러
  onCreateReviewSuccess?: () => void;
  onCreateReviewError?: (error: ErrorResponse) => void;

  onFixReviewSuccess?: () => void;
  onFixReviewError?: (error: ErrorResponse) => void;

  onDeleteReviewSuccess?: () => void;
  onDeleteReviewError?: (error: ErrorResponse) => void;

  // 리뷰 댓글 핸들러
  onCreateReplySuccess?: () => void;
  onCreateReplyError?: (error: ErrorResponse) => void;

  onDeleteReplySuccess?: () => void;
  onDeleteReplyError?: (error: ErrorResponse) => void;
};

export interface UseCommentMutationReturn {
  createReview: (params: { content: string; emoji: string; isbn: string }) => void;
  isCreateReviewPending: boolean;

  deleteReview: (reviewId: number) => void;
  isDeleteReviewPending: boolean;

  fixReview: (requestBody: { commentId: number; content: string }) => void;
  isFixReviewPending: boolean;

  createReply: (params: { parentId: number; content: string; isbn: string }) => void;
  isCreateReplyPending: boolean;

  deleteReply: (replyId: number) => void;
  isDeleteReplyPending: boolean;
}

type UseCommentMutation = (params: UseCommentMutationParams) => UseCommentMutationReturn;

export const useCommentMutation: UseCommentMutation = (params: UseCommentMutationParams) => {
  const {
    onCreateReviewSuccess,
    onCreateReviewError,

    onFixReviewSuccess,
    onFixReviewError,

    onDeleteReviewError,
    onDeleteReviewSuccess,

    onCreateReplySuccess,
    onCreateReplyError,

    onDeleteReplySuccess,
    onDeleteReplyError,
  } = params;

  // 리뷰 작성하기
  const { mutate: createReview, isPending: isCreateReviewPending } = useMutation({
    mutationFn: (params: { content: string; emoji: string; isbn: string }) => {
      return request.post<PostCommentRequest>(DOMAIN + '/comment', {
        ...params,
        parentId: null,
      });
    },
    onError: onCreateReviewError,
    onSuccess: onCreateReviewSuccess,
  });

  // 리뷰 수정하기
  const { mutate: fixReview, isPending: isFixReviewPending } = useMutation({
    mutationFn: (requestBody: { commentId: number; content: string }) => {
      return request.patch<PatchCommentRequest, PatchCommentRequest>(DOMAIN + '/comment', requestBody);
    },
    onSuccess: onFixReviewSuccess,
    onError: onFixReviewError,
  });

  // 리뷰 삭제하기
  const { mutate: deleteReview, isPending: isDeleteReviewPending } = useMutation({
    mutationFn: (reviewId: number) => {
      return request.delete(DOMAIN + '/comment/' + reviewId);
    },
    onError: onDeleteReviewError,
    onSuccess: onDeleteReviewSuccess,
  });

  // 댓글 작성하기
  const { mutate: createReply, isPending: isCreateReplyPending } = useMutation({
    mutationFn: (params: { parentId: number; content: string; isbn: string }) => {
      return request.post<PostCommentRequest, PostCommentRequest>(DOMAIN + '/comment', { ...params, emoji: null });
    },
    onError: onCreateReplyError,
    onSuccess: onCreateReplySuccess,
  });

  // 댓글 삭제하기
  const { mutate: deleteReply, isPending: isDeleteReplyPending } = useMutation({
    mutationFn: (replyId: number) => {
      return request.delete(DOMAIN + '/comment/' + replyId);
    },
    onError: onDeleteReplyError,
    onSuccess: onDeleteReplySuccess,
  });

  return {
    createReview,
    isCreateReviewPending,
    fixReview,
    isFixReviewPending,
    createReply,
    isCreateReplyPending,
    deleteReview,
    isDeleteReviewPending,
    deleteReply,
    isDeleteReplyPending,
  };
};
