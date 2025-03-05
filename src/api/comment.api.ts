import { DOMAIN } from '@/utils/env';
import axios from 'axios';

// 댓글 삭제
export const deleteCommentRequest = async (jwt: string, commentId: number) => {
  return axios.delete(DOMAIN + '/comment/' + commentId, {
    headers: {
      Authorization: 'Bearer ' + jwt,
    },
  });
};

// 댓글 작성
export interface PostCommentRequestDto {
  parentId: number | null;
  isbn: string;
  content: string;
  emoji: string | null;
}

export const postCommentRequest = async (jwt: string, requestDto: PostCommentRequestDto) => {
  return axios.post(DOMAIN + '/comment', requestDto, {
    headers: {
      Authorization: 'Bearer ' + jwt,
    },
  });
};

// 댓글 수정하기
export const patchCommentRequest = async (jwt: string, commentId: number, content: string) => {
  return await axios
    .patch(
      DOMAIN + `/comment`,
      {
        content,
        commentId,
      },
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      },
    )
};