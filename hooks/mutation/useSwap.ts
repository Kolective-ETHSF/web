import { CoreABI } from "@/lib/abis/CoreABI";
import { denormalize, valueToBigInt } from "@/lib/bignumber";
import { ADDRESS_CORE, DECIMALS_TOKEN } from "@/lib/constants";
import { config } from "@/lib/wagmi";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import {
  waitForTransactionReceipt,
  writeContract,
} from "wagmi/actions";

type Status = "idle" | "loading" | "success" | "error";

export const useSwap = () => {
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
      amountIn,
      decimals
    }: {
      tokenIn: HexAddress;
      tokenOut: HexAddress;
      amountIn: string;
      decimals?: number;
    }) => {
      try {
        setSteps([{ step: 1, status: "idle" }]);

        if (!amountIn || !tokenIn || !tokenOut) {
          throw new Error("Invalid parameters");
        }

        const dAmountIn = denormalize(amountIn || "0", decimals ?? DECIMALS_TOKEN);

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 1) {
              return { ...item, status: "loading" };
            }
            return item;
          })
        );

        const txHash = await writeContract(config, {
          address: ADDRESS_CORE,
          abi: CoreABI,
          functionName: "swap",
          args: [
            tokenIn,
            tokenOut,
            valueToBigInt(dAmountIn),
          ],
        });

        setTxHash(txHash);

        const result = await waitForTransactionReceipt(config, {
          hash: txHash,
        });

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 1) {
              return { ...item, status: "success" };
            }
            return item;
          })
        );

        return result;
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