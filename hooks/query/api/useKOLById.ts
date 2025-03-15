import { KOLResponse } from '@/types/api/kol.types';
import { useQuery } from '@tanstack/react-query';
import api from '../../../config/api.config';

interface KOL {
  kol: KOLResponse;
}

export const useKOLById = ({
  username
}: {
  username: string;
}) => {
  const { data, isLoading, refetch, error } = useQuery<KOL>({
    queryKey: ['kol', username],
    queryFn: async () => {
      return await api.get(`api/kol/username/${username}`);
    },
  });

  const datas: KOLResponse = data?.kol ?? {} as KOLResponse;

  return {
    kiData: datas,
    kiLoading: isLoading,
    kiRefetch: refetch,
    kiError: error,
  }
};
