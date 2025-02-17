import { useQuery, UseQueryOptions } from 'react-query';
import axios, { AxiosError, AxiosResponse } from 'axios';
import { DOMAIN } from '@/utils';

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
