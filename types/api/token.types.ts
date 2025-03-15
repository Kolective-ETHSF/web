import { z } from "zod";

export const TokenResponseSchema = z.object({
  id: z.number(),
  addressToken: z.string(),
  symbol: z.string(),
  name: z.string(),
  decimals: z.number(),
  chain: z.string(),
  logo: z.string(),
  priceChange24H: z.number(),
  tags: z.array(z.string()),
});

export type TokenResponse = z.infer<typeof TokenResponseSchema>;
export type ListTokenResponse = TokenResponse[];