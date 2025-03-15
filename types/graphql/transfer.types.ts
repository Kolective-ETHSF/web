import { z } from "zod";

export const TransfersSchema = z.object({
  blockNumber: z.string(),
  blockTimestamp: z.string(),
  from: z.string(),
  id: z.string(),
  to: z.string(),
  transactionHash: z.string(),
  value: z.string(),
});

export type Transfers = z.infer<typeof TransfersSchema>;