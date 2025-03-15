import React from "react";
import { useToken } from "@/hooks/query/api/useToken";
import { useSwapsUser } from "@/hooks/query/graphql/useSwapsUser";
import Image from "next/image";
import { normalize } from "@/lib/bignumber";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DECIMALS_TOKEN } from "@/lib/constants";
import { Loader2, ArrowRight, TrendingUp, TrendingDown, ExternalLink } from "lucide-react";
import { subtitle } from "@/components/primitives";
import { Chip } from "@heroui/chip";
import { Snippet } from "@heroui/snippet";

export default function TraderDetails() {
  const { tData, tLoading } = useToken();
  const { suData, suLoading } = useSwapsUser({ wallet: "ai" });

  if (tLoading || suLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-48">
        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        <p className="mt-3 text-sm font-medium">Loading trade data...</p>
      </div>
    );
  }

  if (!suData || suData.length === 0 || !tData) {
    return (
      <div className="p-6 text-center h-48 flex flex-col items-center justify-center">
        <p className="font-medium">No trade data available</p>
        <p className="mt-2 text-sm text-gray-500">Completed trades will appear here</p>
      </div>
    );
  }

  const lastTrade = suData[0];

  if (!lastTrade) {
    return (
      <div className="p-6 text-center h-48 flex flex-col items-center justify-center">
        <p className="font-medium">No recent trades</p>
        <p className="mt-2 text-sm text-gray-500">Start trading to see your positions</p>
      </div>
    );
  }

  const tokenIn = tData.find((t) => t.addressToken?.toLowerCase() === lastTrade.tokenIn?.toLowerCase());
  const tokenOut = tData.find((t) => t.addressToken?.toLowerCase() === lastTrade.tokenOut?.toLowerCase());

  const priceChanged = tokenOut?.priceChange24H ?? 0;
  const lastPriceTokenOut = normalize(Number(lastTrade.sellPrice ?? 0), DECIMALS_TOKEN);
  const profit = priceChanged - Number(lastPriceTokenOut);
  const isProfitPositive = profit >= 0;

  const amountInNormalized = normalize(lastTrade.amountIn ?? 0, DECIMALS_TOKEN);
  const amountOutNormalized = normalize(lastTrade.amountOut ?? 0, DECIMALS_TOKEN);

  const percentChange = Number(lastPriceTokenOut) > 0 ? (profit / Number(lastPriceTokenOut)) * 100 : 0;

  const tradeDate = lastTrade.blockTimestamp
    ? new Date(Number(lastTrade.blockTimestamp) * 1000).toLocaleString()
    : "N/A";

  return (
    <motion.div
      className="w-full rounded-xl shadow-md overflow-hidden border-2 border-default-200 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex flex-col sm:flex-row justify-between sm:items-center">
        <motion.h2
          className={cn(subtitle({ sizeText: "lxl" }), "font-bold text-start")}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Position Summary
        </motion.h2>
        <Chip className="mt-2 sm:mt-0" color="warning" variant="flat">
          Last Trade: {tradeDate}
        </Chip>
      </div>

      <div className="flex flex-col md:flex-row md:gap-6">
        <div className="flex-1 p-4">
          <div className="flex flex-col gap-4">
            {/* Trade direction */}
            <div className="flex flex-wrap items-center justify-between md:justify-start gap-4 py-2">
              <div className="flex items-center min-w-0">
                {tokenIn ? (
                  <Image src={tokenIn.logo} alt={tokenIn.symbol} width={36} height={36} className="rounded-full" />
                ) : (
                  <div className="w-9 h-9 rounded-full"></div>
                )}
                <div className="ml-2 min-w-0">
                  <p className="text-xs text-gray-500">From</p>
                  <p className="font-medium truncate">{tokenIn?.symbol || "Unknown"}</p>
                </div>
              </div>

              <ArrowRight className="w-5 h-5 text-gray-400 mx-2" />

              <div className="flex items-center min-w-0">
                {tokenOut ? (
                  <Image src={tokenOut.logo} alt={tokenOut.symbol} width={36} height={36} className="rounded-full" />
                ) : (
                  <div className="w-9 h-9 rounded-full"></div>
                )}
                <div className="ml-2 min-w-0">
                  <p className="text-xs text-gray-500">To</p>
                  <p className="font-medium truncate">{tokenOut?.symbol || "Unknown"}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-md">
                <p className="text-xs text-gray-500 mb-1">Amount In</p>
                <p className="font-semibold">{parseFloat(amountInNormalized).toFixed(4)} {tokenIn?.symbol}</p>
              </div>

              <div className="p-3 rounded-md">
                <p className="text-xs text-gray-500 mb-1">Amount Out</p>
                <p className="font-semibold">{parseFloat(amountOutNormalized).toFixed(4)} {tokenOut?.symbol}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 py-4 flex flex-col justify-end items-end">
          <div className="mb-4 py-3 rounded-lg w-full">
            <div className="flex items-center justify-between border border-default-200 rounded-xl w-full px-3 py-2">
              <div className="flex items-center">
                {isProfitPositive ? (
                  <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-red-500 mr-2" />
                )}
                <span className="text-sm font-medium">Performance</span>
              </div>
              <div className={cn(
                "font-bold",
                isProfitPositive ? "text-green-600" : "text-red-600"
              )}>
                {isProfitPositive ? "+" : ""}{profit.toFixed(4)}
                <span className="text-xs ml-1">({Math.abs(percentChange).toFixed(2)}%)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <div className="p-3 rounded-md">
              <p className="text-xs text-gray-500 mb-1">Entry Price</p>
              <p className="font-semibold">${lastPriceTokenOut}</p>
            </div>

            <div className="p-3 rounded-md">
              <p className="text-xs text-gray-500 mb-1">Current Price</p>
              <p className="font-semibold">{priceChanged.toFixed(6)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-gray-600">Transaction Details</p>
          {lastTrade.transactionHash && (
            <a
              href={`https://sepolia.basescan.org/tx/${lastTrade.transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-xs text-blue-600 hover:text-blue-800"
            >
              View on Explorer <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          )}
        </div>
        {lastTrade.transactionHash ? (
          <Snippet
            hideSymbol
            className="max-w-full"
            color="warning"
            variant="flat"
            classNames={{
              pre: "truncate"
            }}
          >
            {lastTrade.transactionHash}
          </Snippet>
        ) : (
          <p className="text-xs text-gray-400 mt-1">No transaction hash available</p>
        )}
      </div>
    </motion.div>
  );

}