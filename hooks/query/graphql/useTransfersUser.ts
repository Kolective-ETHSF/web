import { queryTransfersByUser } from "@/graphql/transfer.query";
import { Transfers } from "@/types/graphql/transfer.types";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAccount } from "wagmi";
import { useAddressAI } from "../useAddressAI";

interface TranferResponse {
  transfers: {
    items: Transfers[];
  }
};

export const useTransfersUser = ({
  wallet
}: {
  wallet?: "user" | "ai";
}) => {
  const { address } = useAccount();
  const { addressAI } = useAddressAI();

  const uA = wallet === "user" ? address : addressAI;

  const { data, isLoading, error, refetch } = useQuery<TranferResponse>({
    queryKey: ['gql-transfers-user', uA],
    queryFn: async () => {
      if (uA) {
        return await request(
          process.env.NEXT_PUBLIC_API_GRAPHQL_URL || "",
          queryTransfersByUser((uA).toString())
        );
      }

      return { transfers: { items: [] } };
    },
    enabled: !!uA,
    refetchInterval: 10000,
    staleTime: 10000
  })

  return {
    tuData: data?.transfers.items || [],
    tuLoading: isLoading,
    tuError: error,
    tuRefetch: refetch,
  }
}