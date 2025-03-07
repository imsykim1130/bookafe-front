export interface SignInRequestDto {
  email: string;
  password: string;
}

export interface SignUpRequestDto {
  email: string;
  password: string;
  nickname: string;
  role: 'user' | 'admin';
}

export interface getSearchBookListRequestDto {
  query: string;
  sort?: 'accuracy' | 'latest';
  page?: number;
  size?: number;
  target?: 'title' | 'isbn' | 'publisher' | 'person';
}

export interface getBookRequestDto {
  isbn: string;
}

export interface PostOrderRequestDto {
  address: string;
  addressDetail?: string;
  phoneNumber: string;
  couponId: number | null;
  usedPoint: number | null;
}

export interface postcommentrequestdto {
  parentid: number | null;
  isbn: string;
  content: string;
  emoji: string | null;
}

export interface PostDeliveryInfoRequestDto {
  name: string;
  address: string;
  addressDetail: string | null;
  receiver: string;
  receiverPhoneNumber: string;
  isDefault: boolean;
}
