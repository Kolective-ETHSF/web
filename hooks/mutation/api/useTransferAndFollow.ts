import api from "@/config/api.config";
import { TokenABI } from "@/lib/abis/TokenABI";
import { denormalize, valueToBigInt } from "@/lib/bignumber";
import { DECIMALS_TOKEN } from "@/lib/constants";
import { config } from "@/lib/wagmi";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useAccount } from "wagmi";
import {
  waitForTransactionReceipt,
  writeContract,
} from "wagmi/actions";

type Status = "idle" | "loading" | "success" | "error";

export const useTransferAndFollow = () => {
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
      addressToken,
      toAddress,
      value,
      decimals,
      kolId
    }: {
      addressToken: HexAddress;
      toAddress: HexAddress;
      value: string;
      decimals?: number;
      kolId: number;
    }) => {
      try {
        setSteps([{ step: 1, status: "idle" }]);

        if (!value || !toAddress) {
          throw new Error("Invalid parameters");
        }

        const dAmount = denormalize(value || "0", decimals ?? DECIMALS_TOKEN);

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 1) {
              return { ...item, status: "loading" };
            }
            return item;
          })
        );

        const txHash = await writeContract(config, {
          address: addressToken,
          abi: TokenABI,
          functionName: "transfer",
          args: [
            toAddress,
            valueToBigInt(dAmount),
          ],
        });

        setTxHash(txHash);

        const result = await waitForTransactionReceipt(config, {
          hash: txHash,
        });

        if (result) {
          const res = await api.post("api/kol/follow", { kolId: kolId, userAddress: address });

          if (res.status === 200) {
            setSteps((prev) =>
              prev.map((item) => {
                if (item.step === 1) {
                  return { ...item, status: "success" };
                }
                return item;
              })
            );

            return result;
          }
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