import { z } from "zod";
import { TokenResponseSchema } from "./token.types";

export const TweetResponseSchema = z.object({
  id: z.number(),
  tokenId: z.number(),
  content: z.string(),
  signal: z.enum(["BUY", "SELL"]),
  risk: z.enum(["CONSERVATIVE", "BALANCED", "AGGRESSIVE"]),
  timestamp: z.string(),
  expired: z.boolean(),
  valid: z.boolean(),
  kolId: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  token: TokenResponseSchema,
});

export type TweetResponse = z.infer<typeof TweetResponseSchema>;
export type ListTweetResponse = TweetResponse[];