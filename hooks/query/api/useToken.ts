import { useQuery } from '@tanstack/react-query';
import api from '../../../config/api.config';
import { ListTokenResponse } from '@/types/api/token.types';

interface Token {
  tokens: ListTokenResponse;
}

export const useToken = () => {
  const { data, isLoading, refetch, error } = useQuery<Token>({
    queryKey: ['token'],
    queryFn: async () => {
      return await api.get("api/token/data");
    },
  });

  const datas: ListTokenResponse = data?.tokens || [];

  return {
    tData: datas,
    tLoading: isLoading,
    tRefetch: refetch,
    tError: error,
  }
};
