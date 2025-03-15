import { querySwaps } from "@/graphql/swap.query";
import { Swaps } from "@/types/graphql/swap.types";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAccount } from "wagmi";

interface SwapResponse {
  swaps: {
    items: Swaps[];
  }
}

export const useSwaps = () => {
  const { address } = useAccount();

  const { data, isLoading, error, refetch } = useQuery<SwapResponse>({
    queryKey: ['gql-swaps'],
    queryFn: async () => {
      return await request(
        process.env.NEXT_PUBLIC_API_GRAPHQL_URL || "",
        querySwaps()
      );
    },
    enabled: !!address,
    refetchInterval: 10000,
    staleTime: 10000
  })

  return {
    sData: data?.swaps.items || [],
    sLoading: isLoading,
    sError: error,
    sRefetch: refetch,
  }
}