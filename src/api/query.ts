import { useQuery, UseQueryOptions } from 'react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { DOMAIN } from '@/utils';
import { GetAllDeliveryInfoResponseDto, GetDeliveryInfoResponseDto } from '@/api/response.dto.ts';
import { DeliveryInfoItem } from '@/api/item.ts';

export const deliveryInfoKey = 'deliveryInfo';
export const useDeliveryInfoQuery = (
  jwt: string,
  opt?: UseQueryOptions<AxiosResponse, AxiosError, DeliveryInfoItem | null, typeof deliveryInfoKey>,
) => {
  return useQuery(
    deliveryInfoKey,
    async () => {
      return await axios.get(DOMAIN + '/user/delivery-info', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
    },
    {
      staleTime: Infinity,
      select: (response) => {
        const { userDeliveryInfo } = response.data as GetDeliveryInfoResponseDto;
        return userDeliveryInfo;
      },
      ...opt,
    },
  );
};

export const allCartBookKey = 'allCartBook';
export const useAllCartBookQuery = <T>(
  jwt: string,
  opt?: UseQueryOptions<AxiosResponse, AxiosError, T, typeof allCartBookKey>,
) => {
  return useQuery(
    allCartBookKey,
    async () => {
      return await axios.get(DOMAIN + '/cart/list', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
    },
    {
      select: (result): T => {
        return result.data;
      },
      ...opt,
    },
  );
};

export const allDeliveryInfoKey = ['allDeliveryInfo'];
export const useAllDeliveryInfoQuery = (
  jwt: string,
  opt?: UseQueryOptions<AxiosResponse, AxiosError, DeliveryInfoItem[], typeof allDeliveryInfoKey>,
) => {
  return useQuery(
    allDeliveryInfoKey,
    async () => {
      return await axios.get(DOMAIN + '/user/delivery-info/all', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
    },
    {
      select: (response) => {
        const { userDeliveryInfoList } = response.data as GetAllDeliveryInfoResponseDto;
        return userDeliveryInfoList;
      },
      staleTime: Infinity,
      ...opt,
    },
  );
};
