import { querySwapsByUser } from "@/graphql/swap.query";
import { Swaps } from "@/types/graphql/swap.types";
import { useQuery } from "@tanstack/react-query";
import request from "graphql-request";
import { useAccount } from "wagmi";
import { useAddressAI } from "../useAddressAI";

interface SwapResponse {
  swaps: {
    items: Swaps[];
  }
}

export const useSwapsUser = ({
  wallet
}: {
  wallet?: "user" | "ai";
}) => {
  const { address } = useAccount();
  const { addressAI } = useAddressAI();

  const uA = wallet === "user" ? address : addressAI;

  const { data, isLoading, error, refetch } = useQuery<SwapResponse>({
    queryKey: ['gql-swaps-user', uA],
    queryFn: async () => {
      if (uA) {
        return await request(
          process.env.NEXT_PUBLIC_API_GRAPHQL_URL || "",
          querySwapsByUser((uA).toString())
        );
      }

      return { swaps: { items: [] } };
    },
    enabled: !!uA,
    refetchInterval: 10000,
    staleTime: 10000
  })

  return {
    suData: data?.swaps.items || [],
    suLoading: isLoading,
    suError: error,
    suRefetch: refetch,
  }
}