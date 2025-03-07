import { request } from '@/api/template';
import { ErrorResponse } from '@/types/common.type';
import { DOMAIN } from '@/utils/env';
import { useMutation, useQuery } from '@tanstack/react-query';

// 리뷰 리스트 쿼리
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
      return request.get<Comment[]>(DOMAIN + '/comment/list/' + isbn, false);
    },
    enabled: !!isbn,
    initialData: [],
  });
  return { reviewList, isReviewListLoading, isReviewListError };
};

//// 리플 리스트 쿼리
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
      return request.get<Comment[]>(DOMAIN + '/comment/reply/list/' + reviewId, false);
    },
    enabled: replyOpen,
    initialData: [],
  });

  console.log(replyList);

  return { replyList, isReplyListLoading, isReplyListError };
};

// 리뷰, 댓글 mutation

export type CommentRequestVar = {
  parentId: number | null;
  isbn: string | undefined;
  content: string;
  emoji: string | null;
  reviewId: number;
};

export type PostCommentRequest = Pick<CommentRequestVar, 'parentId' | 'isbn' | 'content' | 'emoji'>;

export type PatchReviewRequest = Pick<CommentRequestVar, 'reviewId' | 'content'>;

export type UseCommentMutationParams = {
  isbn: string | undefined;

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
  createReview: (params: Pick<CommentRequestVar, 'content' | 'emoji'>) => void;
  isCreateReviewPending: boolean;

  fixReview: (requestBody: Pick<CommentRequestVar, 'reviewId' | 'content'>) => void;
  isFixReviewPending: boolean;

  deleteReview: (reviewId: number) => void;
  isDeleteReviewPending: boolean;

  createReply: (params: Pick<CommentRequestVar, 'parentId' | 'content'>) => void;
  isCreateReplyPending: boolean;

  deleteReply: (replyId: number) => void;
  isDeleteReplyPending: boolean;
}

type UseCommentMutation = (params: UseCommentMutationParams) => UseCommentMutationReturn;

export const useCommentMutation: UseCommentMutation = (params: UseCommentMutationParams) => {
  const {
    isbn,

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
    mutationFn: (params: Pick<PostCommentRequest, 'content' | 'emoji'>) => {
      return request.post<PostCommentRequest>(DOMAIN + '/comment', {
        ...params,
        parentId: null,
        isbn,
      });
    },
    onError: onCreateReviewError,
    onSuccess: onCreateReviewSuccess,
  });

  // 리뷰 수정하기
  const { mutate: fixReview, isPending: isFixReviewPending } = useMutation({
    mutationFn: (requestBody: Pick<CommentRequestVar, 'reviewId' | 'content'>) => {
      return request.patch<{ commentId: number; content: string }>(DOMAIN + '/comment', {
        content: requestBody.content,
        commentId: requestBody.reviewId,
      });
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
    mutationFn: (params: Pick<PostCommentRequest, 'parentId' | 'content'>) => {
      return request.post<PostCommentRequest>(DOMAIN + '/comment', {
        ...params,
        isbn,
        emoji: null,
      });
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
