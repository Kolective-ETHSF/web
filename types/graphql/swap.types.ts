import { z } from "zod";

export const SwapsSchema = z.object({
  id: z.string(),
  sender: z.string(),
  tokenIn: z.string(),
  tokenOut: z.string(),
  transactionHash: z.string(),
  amountOut: z.string(), 
  amountIn: z.string(),
  buyPrice: z.string(),
  sellPrice: z.string(),
  blockNumber: z.string(),
  blockTimestamp: z.string(),
});

export type Swaps = z.infer<typeof SwapsSchema>;