"use client";

import { subtitle } from '@/components/primitives'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import React from 'react'
import DeBridgeWidget from './_components/DeBridgeWidget';
import WalletConnection from '@/components/wallet-connection';
import { useAccount } from 'wagmi';

export default function Page() {
  const { isConnected } = useAccount();

  return (
    <div className="py-5 pt-24 overflow-x-hidden w-full">
      <div className="flex flex-col gap-3 items-start">
        <div className="flex flex-col items-start justify-start pb-5">
          <motion.span
            className={cn(subtitle({ sizeText: "xl" }), "font-bold text-start")}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Bridge
          </motion.span>
          <motion.span
            className={cn(subtitle(), "text-start")}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Bridge your token with DeBridge.
          </motion.span>
          <motion.div
            className={cn(subtitle(), "text-start max-w-lg")}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            This bridge only works on mainnet mode, but now in testing mode for hackathon purposes, but you still can use this bridge for bridge mainnet token. :)
          </motion.div>
        </div>
        {isConnected ? <DeBridgeWidget /> : <WalletConnection />}
      </div>
    </div>
  )
}
