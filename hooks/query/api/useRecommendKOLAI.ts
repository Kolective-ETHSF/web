import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import apiAgent from "@/config/api-agent.config";

interface Response {
  id: number | null;
}

export const useRecommendKOLAI = ({
  riskAI
}: {
  riskAI?: string;
}) => {
  const { address } = useAccount();
  
  const promt = "Make recommendation KOLs to follow";

  const { data, isLoading, error, refetch } = useQuery<Response>({
    queryKey: ['recommend-ai', riskAI],
    queryFn: async () => {
      if (riskAI) {
        return await apiAgent.post("generate-recommendation-kol", { data: promt, user_address: address });
      }

      return { id: null };
    },
    enabled: !!riskAI,
    retry: 1,
    refetchInterval: 6000000,
    staleTime: 6000000
  })

  return {
    rData: data?.id || null,
    rLoading: isLoading,
    rError: error,
    rRefetch: refetch,
  }
}