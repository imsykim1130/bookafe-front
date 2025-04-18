import { MyReviewListResponse, ReviewFavoriteUserListResonse } from '@/api/response.dto';
import { request } from '@/api/template';
import { ErrorResponse } from '@/types/common.type';
import { Comment, MyReview, ReviewFavoriteUser } from '@/types/item';
import { DOMAIN } from '@/utils/env';
import { useMutation, useQuery } from '@tanstack/react-query';

// 책의 리뷰 리스트 쿼리
type UseReviewListQueryParams = {
  isbn: string | undefined;
  page?: number;
};

interface UseReviewListQueryReturn {
  reviewList: Comment[] | undefined;
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
      return request.get<Comment[]>(DOMAIN + '/comments/review?isbn=' + isbn, false);
    },
    enabled: !!isbn,
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
      return request.get<Comment[]>(DOMAIN + '/comments/reply?reviewId=' + reviewId, false);
    },
    enabled: replyOpen,
    initialData: [],
  });

  console.log(replyList);

  return { replyList, isReplyListLoading, isReplyListError };
};

// 유저의 리뷰 리스트 쿼리
type UseUserReviewListQueryParams = {
  userId: string | undefined; // 유저 id
  page: number; // 가져올 페이지
  size: number; // 한 번에 가져올 데이터 개수
};
interface UseUserReviewListQueryReturn {
  reviewList: MyReview[] | undefined;
  isEnd: boolean;
  totalCount: number;
  isError: boolean;
  isLoading: boolean;
}

type UseUserReviewListQuery = (params: UseUserReviewListQueryParams) => UseUserReviewListQueryReturn;
export const userReviewListQueryKey = 'userReviewList';
export const useUserReviewListQuery: UseUserReviewListQuery = (params) => {
  const { userId, page, size } = params;
  const { data, isError, isLoading } = useQuery({
    queryKey: [userReviewListQueryKey, userId],
    queryFn: () => {
      return userId
        ? request.getWithParams<MyReviewListResponse, { userId: string; size: number; page: number }>(
            DOMAIN + '/comments',
            {
              userId,
              page,
              size,
            },
          )
        : undefined;
    },
  });

  // response 분해하여 따로 반환
  const reviewList = data?.reviewList; // 실제 데이터는 초기값 지정하지 않고 undefined 반환 유지
  const isEnd = data?.isEnd ?? false;
  const totalCount = data?.totalCount ?? 0;

  return { reviewList, isEnd, totalCount, isError, isLoading };
};

// 내 리뷰의 좋아요 유저 리스트 쿼리
export const reviewFavoriteUserListQueryKey = 'reviewFavoriteUserList';

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
    queryKey: [reviewFavoriteUserListQueryKey, params.userId],
    queryFn: () => {
      return params.userId
        ? request.getWithParams<ReviewFavoriteUserListResonse, { userId: string; page: number; size: number }>(
            DOMAIN + '/comment/like/users',
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
    mutationFn: (requestBody: { content: string; emoji: string; isbn: string }) => {
      return request.post<PostCommentRequest>(DOMAIN + '/comment', {
        ...requestBody,
        parentId: null,
      });
    },
    onError: (err: ErrorResponse) => {
      window.alert(err.message);
    },
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
      return request.delete(DOMAIN + '/comment?commentId=' + reviewId);
    },
    onError: onDeleteReviewError,
    onSuccess: onDeleteReviewSuccess,
  });

  // 댓글 작성하기
  const { mutate: createReply, isPending: isCreateReplyPending } = useMutation({
    mutationFn: (requestBody: { parentId: number; content: string; isbn: string }) => {
      return request.post<PostCommentRequest, PostCommentRequest>(DOMAIN + '/comment', { ...requestBody, emoji: null });
    },
    onError: onCreateReplyError,
    onSuccess: onCreateReplySuccess,
  });

  // 댓글 삭제하기
  const { mutate: deleteReply, isPending: isDeleteReplyPending } = useMutation({
    mutationFn: (replyId: number) => {
      return request.delete(DOMAIN + '/comment?commentId=' + replyId);
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
