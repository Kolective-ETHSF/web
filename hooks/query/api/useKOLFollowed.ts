import { KOLResponse } from '@/types/api/kol.types';
import { useQuery } from '@tanstack/react-query';
import api from '../../../config/api.config';

interface KOL {
  followedKOL: {
    id: number;
    kolId: number;
    kol: KOLResponse;
    userAddress: string;
    createdAt: string;
    updatedAt: string;
  };
}

export const useKOLFollowed = ({
  address,
}: {
  address: string;
}) => {
  const { data, isLoading, refetch, error } = useQuery<KOL>({
    queryKey: ['kolFollowed', address],
    queryFn: async () => {
      return await api.get(`api/kol/followed/${address}`);
    },
    retry: 1,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });

  const datas: KOLResponse | undefined = data?.followedKOL.kol;

  return {
    kfData: datas,
    kfLoading: isLoading,
    kfRefetch: refetch,
    kfError: error,
  }
};
