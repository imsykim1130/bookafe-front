export type SignInRequest = {
  email: string;
  password: string;
  isGoogleAuth?: boolean;
};

export type SignUpRequest = {
  email: string;
  password: string;
  nickname: string;
  role: 'user' | 'admin';
};

export type AuthWithGoogleRequest = {
  idToken: string;
  isSignUp: boolean;
};
