"use client";

import { subtitle } from '@/components/primitives'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import React from 'react'
import { FaucetComponent } from './_components/FaucetComponent';
import { useToken } from '@/hooks/query/api/useToken';
import { TokenResponse } from '@/types/api/token.types';
import WalletConnection from '@/components/wallet-connection';
import { useAccount } from 'wagmi';

export default function Page() {
  const { tData } = useToken();
  const { isConnected } = useAccount();

  const sToken = tData && tData.find((token: TokenResponse) => token.symbol.toUpperCase() === 'S');

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
            Faucet
          </motion.span>
          <motion.span
            className={cn(subtitle(), "text-start")}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Claims your faucet for testing purpose here.
          </motion.span>
        </div>
        {isConnected ? <div><FaucetComponent token={sToken} /></div> : <WalletConnection />}
      </div>
    </div>
  )
}
