import { ListKOLResponse } from '@/types/api/kol.types';
import { useQuery } from '@tanstack/react-query';
import api from '../../../config/api.config';

interface KOL {
  kols: ListKOLResponse;
}

export const useKOL = () => {
  const { data, isLoading, refetch, error } = useQuery<KOL>({
    queryKey: ['kol'],
    queryFn: async () => {
      return await api.get("api/kol");
    },
  });

  const datas: ListKOLResponse = data?.kols || [];

  return {
    kData: datas,
    kLoading: isLoading,
    kRefetch: refetch,
    kError: error,
  }
};
