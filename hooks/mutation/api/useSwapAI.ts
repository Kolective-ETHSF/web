import apiAgent from "@/config/api-agent.config";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAccount } from "wagmi";

type Status = "idle" | "loading" | "success" | "error";

export const useSwapAI = () => {
  const { address } = useAccount();

  const [steps, setSteps] = useState<
    Array<{
      step: number;
      status: Status;
      error?: string;
    }>
  >([
    {
      step: 1,
      status: "idle",
    },
  ]);

  const [txHash, setTxHash] = useState<HexAddress | null>(null);

  const mutation = useMutation({
    mutationFn: async ({
      tokenIn,
      tokenOut,
      value
    }: {
      tokenIn: HexAddress;
      tokenOut: HexAddress;
      value: string;
    }) => {
      try {
        setSteps([{ step: 1, status: "idle" }]);

        if (!value || !tokenIn || !tokenOut) {
          throw new Error("Invalid parameters");
        }

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 1) {
              return { ...item, status: "loading" };
            }
            return item;
          })
        );

        const res = await apiAgent.post("agent/swap", { user_address: address, amount: value, token_in: tokenIn, token_out: tokenOut });

        setTxHash(res.data.txHash);

        if (res.status === 200) {
          setSteps((prev) =>
            prev.map((item) => {
              if (item.step === 1) {
                return { ...item, status: "success" };
              }
              return item;
            })
          );

          return res;
        }
      } catch (e) {
        console.error("Error", e);

        setSteps((prev) =>
          prev.map((step) => {
            if (step.status === "loading") {
              return { ...step, status: "error", error: (e as Error).message };
            }
            return step;
          })
        );

        throw e;
      }
    },
  });

  return { steps, mutation, txHash };
};