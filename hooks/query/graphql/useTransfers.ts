import { queryTransfers } from "@/graphql/transfer.query";
import { Transfers } from "@/types/graphql/transfer.types";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAccount } from "wagmi";

interface TranferResponse {
  transfers: {
    items: Transfers[];
  }
}

export const useTransfers = () => {
  const { address } = useAccount();

  const { data, isLoading, error, refetch } = useQuery<TranferResponse>({
    queryKey: ['gql-transfers'],
    queryFn: async () => {
      return await request(
        process.env.NEXT_PUBLIC_API_GRAPHQL_URL || "",
        queryTransfers()
      );
    },
    enabled: !!address,
    refetchInterval: 10000,
    staleTime: 10000
  })

  return {
    tData: data?.transfers.items || [],
    tLoading: isLoading,
    tError: error,
    tRefetch: refetch,
  }
}