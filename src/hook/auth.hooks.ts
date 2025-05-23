//// mutation
// types
import { AuthWithGoogleRequest, SignInRequest, SignUpRequest } from '@/api/request.dto';
import { UserResponse } from '@/api/response.dto';
import { request } from '@/api/template';
import { queryClient } from '@/main';
import { ErrorResponse } from '@/types/common.type';
import { DOMAIN } from '@/utils/env';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { userKey } from './user.hook';
import { toast } from '@/hooks/use-toast';

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

  authWithGoogle: (request: AuthWithGoogleRequest) => void;
  isAuthWithGooglePending: boolean;
}

type UseAuthMutation = (props?: UseAuthMutationProps) => UseAuthMutationReturn;

// mutate
/**
 * 로그인, 회원가입, 로그아웃, firebase 구글 회원가입
 * @param {UseAuthMutationProps}
 * @returns {UseAuthMutationReturn}
 * @description 인증 관련 mutation 들 모웃
 */
export const useAuthMutation: UseAuthMutation = (props?: UseAuthMutationProps) => {
  const navigate = useNavigate();

  // 로그인
  const { mutate: signIn, isPending: isSignInPending } = useMutation({
    mutationFn: (requestBody: SignInRequest) => {
      return request.post<SignInRequest, UserResponse>(DOMAIN + '/auth/sign-in', requestBody, true);
    },
    onSuccess: (response: UserResponse) => {
      // 로그인 성공
      toast({
        title: '로그인 성공',
        description: '환영합니다!', duration: 2000,});
      queryClient.setQueryData([userKey], response);
      sessionStorage.setItem('user', JSON.stringify(response));
      navigate('/');

    },
    onError: props?.onSignInError,
  });

  // 회원가입
  const { mutate: signUp, isPending: isSignUpPending } = useMutation({
    mutationFn: (requestBody: SignUpRequest) => {
      return request.post(DOMAIN + '/auth/sign-up', requestBody, false);
    },
    onSuccess: props?.onSignUpSuccess
      ? props.onSignUpSuccess
      : () => {
          window.alert('회원가입 성공!');
          navigate('/auth/sign-in');
        },
    onError: props?.onSignUpError
      ? props.onSignUpError
      : (err: ErrorResponse) => {
          window.alert(err.message);
        },
  });

  // 로그아웃
  const { mutate: logout, isPending: isLogoutPending } = useMutation({
    mutationFn: () => {
      return request.post(DOMAIN + '/auth/sign-out', {}, true);
    },
    onSuccess: props?.onLogoutSuccess,
    onError: props?.onLogoutError,
  });

  // 구글로 인증
  const { mutate: authWithGoogle, isPending: isAuthWithGooglePending } = useMutation({
    mutationFn: (requestBody: AuthWithGoogleRequest) => {
      return request.post<AuthWithGoogleRequest, UserResponse>(DOMAIN + '/auth/google', requestBody, true);
    },
    onSuccess: (result: UserResponse) => {
      // 로그인 성공 시 캐시 저장
      queryClient.setQueryData([userKey], result);
      navigate('/');
    },
    onError: (error: ErrorResponse) => {
      console.log(error.message);
      window.alert('다시 시도해주세요');
    },
  });

  return {
    signIn,
    isSignInPending,
    signUp,
    isSignUpPending,
    logout,
    isLogoutPending,
    authWithGoogle,
    isAuthWithGooglePending,
  };
};
