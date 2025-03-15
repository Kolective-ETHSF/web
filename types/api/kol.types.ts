import { z } from "zod";
import { TweetResponseSchema } from "./tweet.types";

export const KOLResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  username: z.string(),
  avatar: z.string().url(),
  followersTwitter: z.number(),
  followersKOL: z.number(),
  riskRecommendation: z.enum(["CONSERVATIVE", "BALANCED", "AGGRESSIVE"]),
  avgProfitD: z.number(),
  rankFollowersKOL: z.number(),
  rankAvgProfitD: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
  tweets: z.array(TweetResponseSchema),
});

export type KOLResponse = z.infer<typeof KOLResponseSchema>;
export type ListKOLResponse = KOLResponse[];