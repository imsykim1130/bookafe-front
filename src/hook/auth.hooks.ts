//// mutation
// types
import { request } from '@/api/template';
import { UserResponse } from '@/hook/user.hook';
import { ErrorResponse } from '@/types/common.type';
import { DOMAIN } from '@/utils/env';
import { useMutation } from '@tanstack/react-query';

export type SignInRequest = {
  email: string;
  password: string;
};

export type SignUpRequest = {
  email: string;
  password: string;
  nickname: string;
  role: 'user' | 'admin';
};

type UseAuthMutationProps = {
  onSignInSuccess?: (expire: number) => void;
  onSignInError?: (error: ErrorResponse) => void;

  onSignUpSuccess?: () => void;
  onSignUpError?: (error: ErrorResponse) => void;

  onLogoutSuccess?: () => void;
  onLogoutError?: (error: ErrorResponse) => void;
};

interface UseAuthMutationReturn {
  signIn: (request: SignInRequest) => void;
  isSignInPending: boolean;

  signUp: (request: SignUpRequest) => void;
  isSignUpPending: boolean;

  logout: () => void;
  isLogoutPending: boolean;
}

type UseAuthMutation = (props?: UseAuthMutationProps) => UseAuthMutationReturn;

// mutate
/**
 * 로그인, 회원가입, 로그아웃
 * @param {UseAuthMutationProps}
 * @returns {UseAuthMutationReturn}
 * @description 인증 관련 mutation 들 모웃
 */
export const useAuthMutation: UseAuthMutation = (props?: UseAuthMutationProps) => {
  // 로그인
  const { mutate: signIn, isPending: isSignInPending } = useMutation({
    mutationFn: (requestBody: SignInRequest) => {
      return request.post<SignInRequest, number>(DOMAIN + '/auth/sign-in', requestBody, true);
    },
    onSuccess: props?.onSignInSuccess,
    onError: props?.onSignInError,
  });

  // 회원가입
  const { mutate: signUp, isPending: isSignUpPending } = useMutation({
    mutationFn: (requestBody: SignUpRequest) => {
      return request.post(DOMAIN + '/auth/sign-up', requestBody, false);
    },
    onSuccess: props?.onSignUpSuccess,
    onError: props?.onSignUpError,
  });

  // 로그아웃
  const { mutate: logout, isPending: isLogoutPending } = useMutation({
    mutationFn: () => {
      return request.post(DOMAIN + '/auth/logout', {}, false);
    },
    onSuccess: props?.onLogoutSuccess,
    onError: props?.onLogoutError,
  });

  return { signIn, isSignInPending, signUp, isSignUpPending, logout, isLogoutPending };
};
