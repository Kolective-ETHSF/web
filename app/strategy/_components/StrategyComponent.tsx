"use client";

import React from "react";
import CreateWalletContent from "./CreateWalletContent";
import QuestionnaireContent from "./QuestionnaireContent";
import GeneratedContent from "./GeneratedContent";
import { useAddressAI } from "@/hooks/query/useAddressAI";
import { TracingBeam } from "@/components/ui/tracing-beam";
import { subtitle } from "@/components/primitives";
import { cn } from "@/lib/utils";
import { useRiskProfileAI } from "@/hooks/query/useRiskProfileAI";
import { useKOL } from "@/hooks/query/api/useKOL";
import Loading from "@/components/loader/loading";
import { useRecommendKOLAI } from "@/hooks/query/api/useRecommendKOLAI";
import { motion } from "framer-motion";
import { KOLResponse } from "@/types/api/kol.types";
import { useKOLFollowed } from "@/hooks/query/api/useKOLFollowed";
import { useAccount } from "wagmi";

const StrategyComponent: React.FC = () => {
  const { address } = useAccount();
  const { kData, kLoading } = useKOL();
  const { kfData } = useKOLFollowed({ address: address as string });
  const { addressAI, laAI } = useAddressAI();
  const { riskAI } = useRiskProfileAI();

  const filterKolByRisk = kData && riskAI && kData.filter((kol) => kol.riskRecommendation.includes(riskAI.toUpperCase()));
  const findRankFollowersKOL = filterKolByRisk && filterKolByRisk.sort((a, b) => a.rankFollowersKOL - b.rankFollowersKOL)[0];
  const findRankAvgProfitD = filterKolByRisk && filterKolByRisk.sort((a, b) => a.rankAvgProfitD - b.rankAvgProfitD)[0];

  const colorRisk = riskAI?.toUpperCase()?.includes("CONSERVATIVE")
    ? "text-green-500"
    : riskAI?.toUpperCase()?.includes("BALANCED")
      ? "text-yellow-500"
      : "text-red-500";

  const colorBorderRisk = riskAI?.toUpperCase()?.includes("CONSERVATIVE")
    ? "border-success"
    : riskAI?.toUpperCase()?.includes("BALANCED")
      ? "border-warning"
      : "border-danger";

  const { rData, rLoading } = useRecommendKOLAI({ riskAI: riskAI });

  const kolRecommendation = rData !== null && Array.isArray(filterKolByRisk) ? filterKolByRisk.find((kol) => kol.id === rData) : null;

  if (laAI || kLoading) return <Loading />;

  return (
    <TracingBeam className="px-6">
      <div className="mx-auto antialiased pt-4 relative flex flex-col gap-20">
        <div>
          <span className={cn(subtitle({ sizeText: "lxl" }), "font-bold text-start")}>Create Wallet AI</span>
          <CreateWalletContent addressAI={addressAI} />
        </div>
        <div>
          <span className={cn(subtitle({ sizeText: "lxl" }), "font-bold text-start")}>Fill Questionnaire</span>
          {kfData ? (
            <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-lg font-normal mb-4">
              Please unfollow your KOL first to filling the questionnaire again.
            </p>
          ) : addressAI ? (
            <QuestionnaireContent />
          ) : (
            <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-lg font-normal mb-4">
              Please create your AI wallet to start filling the questionnaire.
            </p>
          )}
        </div>
        <div>
          <span className={cn(subtitle({ sizeText: "lxl" }), "font-bold text-start")}>Generated Recommendation KOL</span>
          {kfData ? (
            <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-lg font-normal mb-4">
              Please unfollow your KOL first to generating recommendation KOL again.
            </p>
          ) : addressAI && riskAI && filterKolByRisk ? (
            <div>
              <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-lg font-normal mb-4">
                You classified as <span className={`font-semibold ${colorRisk}`}>{filterKolByRisk[0]?.riskRecommendation}</span> risk. here&apos;s our recommended kol for you:
              </p>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col mt-5">
                  <motion.span
                    className={cn(subtitle({ sizeText: "lg" }), "font-bold text-start mb-2")}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    Recommended KOL with the most followers
                  </motion.span>
                  {findRankFollowersKOL && <GeneratedContent kfData={findRankFollowersKOL} kfLoading={kLoading} addressAI={addressAI} colorBorderRisk={colorBorderRisk} />}
                </div>
                <div className="flex flex-col my-5">
                  <motion.span
                    className={cn(subtitle({ sizeText: "lg" }), "font-bold text-start mb-2")}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    Recommended KOL with the highest average profit
                  </motion.span>
                  {findRankAvgProfitD && <GeneratedContent kfData={findRankAvgProfitD} kfLoading={kLoading} addressAI={addressAI} colorBorderRisk={colorBorderRisk} />}
                </div>
                <div className="flex flex-col mb-5">
                  <motion.span
                    className={cn(subtitle({ sizeText: "lg" }), "font-bold text-start mb-2")}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    Recommended KOL from AI
                  </motion.span>
                  {(rData !== null || rLoading) && (
                    <GeneratedContent
                      kfData={kolRecommendation as KOLResponse}
                      kfLoading={rLoading}
                      addressAI={addressAI}
                      colorBorderRisk={colorBorderRisk}
                    />
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-lg font-normal mb-4">
              Please create your AI wallet and fill questionnaire first to see generating content.
            </p>
          )}
        </div>
      </div>
    </TracingBeam>
  );
};

export default StrategyComponent;