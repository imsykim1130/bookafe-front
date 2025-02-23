import { GetAllDeliveryInfoResponseDto, GetDeliveryInfoResponseDto } from '@/api/response.dto';
import { DOMAIN } from '@/utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CartBookData } from './item';

// 기본 배송정보 가져오기
export const deliveryInfoKey = ['deliveryInfo'];
export const useDeliveryInfoQuery = (jwt: string) => {
  return useQuery({
    queryKey: deliveryInfoKey,
    queryFn: async () => {
      console.log('기본 배송정보 가져오기');
      return await axios
        .get(DOMAIN + '/user/delivery-info', {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((response) => {
          // 성공
          const { userDeliveryInfo } = response.data as GetDeliveryInfoResponseDto;
          return userDeliveryInfo;
        })
        .catch((err) => {
          // 실패
          throw err;
        });
    },
    staleTime: Infinity,
  });
};
// 모든 배송 정보 가져오기
export const allDeliveryInfoKey = ['allDeliveryInfo'];
export const useAllDeliveryInfoQuery = (jwt: string) => {
  return useQuery({
    queryKey: allDeliveryInfoKey,
    queryFn: async () => {
      console.log('모든 배송정보 가져오기');
      return await axios
        .get(DOMAIN + '/user/delivery-info/all', {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((response) => {
          // 성공
          const { userDeliveryInfoList } = response.data as GetAllDeliveryInfoResponseDto;
          return userDeliveryInfoList;
        })
        .catch((err) => {
          // 실패
          throw err;
        });
    },
    staleTime: Infinity,
  });
};

// 장바구니 책 가져오기
export const allCartBookKey = ['allCartBook'];
export const useAllCartBookQuery = (jwt: string) => {
  return useQuery({
    queryKey: allCartBookKey,
    queryFn: async () => {
      console.log('장바구니 책 가져오기');
      return await axios
        .get(DOMAIN + '/cart/list', {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then((response) => {
          // 성공
          return response.data as CartBookData[];
        })
        .catch((err) => {
          // 실패
          throw err;
        });
    },
    staleTime: Infinity,
  });
};
