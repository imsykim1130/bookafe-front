import {
  deleteCommentRequest,
  patchCommentRequest,
  postCommentRequest,
  PostCommentRequestDto,
} from '@/api/comment.api';
import { ResponseDto } from '@/api/response.dto';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useJwt } from './hooks';

// 뎃글 작성하기
export const useCreateComment = (opt?: { onSuccess?: () => void; onError?: (error: AxiosError) => void }) => {
  const { jwt } = useJwt();
  const { isbn } = useParams();
  const navigate = useNavigate();

  const { mutate: createComment, error: createReplyError } = useMutation({
    mutationFn: (input: { content: string; parentId?: number; emoji?: string }) => {
      const requestDto: PostCommentRequestDto = {
        parentId: input.parentId ? input.parentId : null,
        isbn: isbn as string,
        content: input.content,
        emoji: input.emoji ? input.emoji : null,
      };

      return postCommentRequest(jwt, requestDto);
    },
    onError: opt?.onError // 실패
      ? opt.onError
      : (error: AxiosError) => {
          // 실패
          if (!error.response) {
            navigate('/error/500');
            return;
          }
          const { message } = error.response.data as ResponseDto;
          console.log(message);
        },
    onSuccess: opt?.onSuccess, // 성공
  });

  return { createComment, createReplyError };
};

// 댓글 삭제하기
export const useDeleteComment = (opt?: { onSuccess?: () => void; onError?: (error: AxiosError) => void }) => {
  const { jwt } = useJwt();
  const navigate = useNavigate();

  const { mutate: deleteComment } = useMutation({
    mutationFn: (commentId: number) => {
      return deleteCommentRequest(jwt, commentId);
    },
    onError: opt?.onError // 실패
      ? opt.onError
      : (error: AxiosError) => {
          // 실패
          if (!error.response) {
            navigate('/error/500');
            return;
          }
          const { message } = error.response.data as ResponseDto;
          console.log(message);
        },
    onSuccess: opt?.onSuccess, // 성공
  });

  return { deleteComment };
};

// 댓글 수정하기
export const useUpdateComment = (opt?: { onSuccess?: () => void; onError?: (error: AxiosError) => void })=> {
  const { jwt } = useJwt();
  const navigate = useNavigate();
  
  const { mutate: updateComment } = useMutation({
    mutationFn: (variables: { commentId: number; content: string }) => {
      return patchCommentRequest(jwt, variables.commentId, variables.content);
    },
    onError: opt?.onError // 실패
      ? opt.onError
      : (error: AxiosError) => {
          // 실패
          if (!error) {
            navigate('/error/500');
            return;
          }
          const { message } = error.response?.data as ResponseDto;
          console.log(message);
        },
    onSuccess: opt?.onSuccess, // 성공
  });

  return {updateComment};
};
