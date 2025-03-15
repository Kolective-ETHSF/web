"use client"

import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowDownUp,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { Button } from '@heroui/button';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/modal';
import { Avatar } from '@heroui/avatar';
import { Card, CardBody } from '@heroui/card';
import { useSwap } from '@/hooks/mutation/useSwap';
import { useToken } from '@/hooks/query/api/useToken';
import { TokenResponse } from '@/types/api/token.types';
import { useBalance } from '@/hooks/query/useBalance';
import { DECIMALS_TOKEN } from '@/lib/constants';
import ModalTransactionCustom from '@/components/modal/modal-transaction-custom';

const SwapComponent: React.FC = () => {
  const { tData } = useToken();
  const { mutation, txHash } = useSwap();

  const [fromToken, setFromToken] = useState<TokenResponse | null>(tData && tData[0] ? tData[0] : null);
  const [toToken, setToToken] = useState<TokenResponse | null>(tData && tData[1] ? tData[1] : null);
  const [fromAmount, setFromAmount] = useState<string>('');
  const [isTokenModalOpen, setIsTokenModalOpen] = useState<'from' | 'to' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  useEffect(() => {
    if (tData && tData.length >= 2) {
      setFromToken(tData[0]);
      setToToken(tData[1]);
    }
  }, [tData]);

  const { bNormalized: bFrom, bRefetch: bFromRefetch } = useBalance({
    token: fromToken?.addressToken as HexAddress,
    decimals: DECIMALS_TOKEN
  });
  const { bNormalized: bTo, bRefetch: bToRefetch } = useBalance({
    token: toToken?.addressToken as HexAddress,
    decimals: DECIMALS_TOKEN
  });

  useEffect(() => {
    if (fromToken) bFromRefetch();
    if (toToken) bToRefetch();
  }, [fromToken, toToken, bFromRefetch, bToRefetch]);

  const handleTokenSelect = (token: TokenResponse) => {
    if (isTokenModalOpen === 'from') {
      if (token.addressToken !== toToken?.addressToken) {
        setFromToken(token);
      }
    } else if (isTokenModalOpen === 'to') {
      if (token.addressToken !== fromToken?.addressToken) {
        setToToken(token);
      }
    }
    setIsTokenModalOpen(null);
  };

  const swapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const estimatedOutput = useMemo(() => {
    if (!fromAmount || !fromToken || !toToken) return '';

    const convertedAmount = (
      parseFloat((parseFloat(fromAmount) * fromToken.priceChange24H).toString()) / toToken.priceChange24H
    ).toFixed(2);

    return convertedAmount;
  }, [fromAmount, fromToken, toToken]);

  const validateSwap = () => {
    const fromBalance = parseFloat(bFrom?.toString() || '0');
    const fromAmountNum = parseFloat(fromAmount || '0');

    return (
      !!fromToken &&
      !!toToken &&
      !!fromAmount &&
      fromAmountNum > 0 &&
      fromAmountNum <= fromBalance
    );
  };

  const handleSwap = () => {
    if (validateSwap()) {
      mutation.mutate({
        tokenIn: fromToken?.addressToken as HexAddress,
        tokenOut: toToken?.addressToken as HexAddress,
        amountIn: fromAmount,
        decimals: DECIMALS_TOKEN
      });
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-0.2 rounded-[20px] bg-background/50">
        <CardBody>
          <div className='flex flex-col relative gap-2'>
            <div className="p-5 py-7 rounded-[20px] border-1 border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <div className='flex flex-col items-start'>
                  <span className='text-gray-400'>Sell</span>
                  <input
                    type="string"
                    placeholder="0.00"
                    value={fromAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        setFromAmount(value);
                      }
                    }}
                    className="text-2xl font-bold w-full bg-transparent outline-none py-2"
                  />
                  <span className="text-right text-sm text-gray-500">
                    Balance: {bFrom || '0.00'}
                  </span>
                </div>
                <Button
                  variant="faded"
                  onPress={() => setIsTokenModalOpen('from')}
                >
                  {fromToken ? (
                    <div className="flex items-center">
                      <Avatar
                        src={fromToken.logo}
                        alt={fromToken.symbol}
                        className="w-6 h-6 mr-2"
                      />
                      {fromToken.symbol}
                    </div>
                  ) : (
                    'Select Token'
                  )}
                  <ChevronDown size={16} className="ml-2" />
                </Button>
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full z-10 p-1">
              <Button
                isIconOnly
                variant="solid"
                onPress={swapTokens}
                className="rounded-2xl p-2 w-12 h-12 min-w-12 bg-background"
              >
                <ArrowDownUp size={20} />
              </Button>
            </div>

            <div className="p-5 py-7 rounded-[20px] border-1 border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <div className='flex flex-col items-start'>
                  <span className='text-gray-400'>Buy</span>
                  <input
                    type="string"
                    placeholder="0.00"
                    value={estimatedOutput}
                    readOnly
                    className="text-2xl font-bold w-full bg-transparent outline-none py-2"
                  />
                  <span className="text-right text-sm text-gray-500">
                    Balance: {bTo || '0.00'}
                  </span>
                </div>
                <Button
                  variant="faded"
                  onPress={() => setIsTokenModalOpen('to')}
                >
                  {toToken ? (
                    <div className="flex items-center">
                      <Avatar
                        src={toToken.logo}
                        alt={toToken.symbol}
                        className="w-6 h-6 mr-2"
                      />
                      {toToken.symbol}
                    </div>
                  ) : (
                    'Select Token'
                  )}
                  <ChevronDown size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>
          
          <Button
            onPress={handleSwap}
            disabled={!validateSwap() || mutation.isPending}
            className="w-full mt-4"
            color='warning'
            variant='solid'
          >
            {mutation.isPending ? <Loader2 className="animate-spin w-4 h-4" /> : 'Swap'}
          </Button>
        </CardBody>
      </Card>

      <Modal
        isOpen={!!isTokenModalOpen}
        onOpenChange={() => setIsTokenModalOpen(null)}
      >
        <ModalContent>
          <ModalHeader>
            Select {isTokenModalOpen === 'from' ? 'From' : 'To'} Token
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-2 gap-4">
              {tData && tData.map((token, idx) => (
                <Button
                  key={idx}
                  variant="bordered"
                  color="default"
                  onPress={() => handleTokenSelect(token)}
                  className="flex flex-row justify-center items-center p-3"
                  isDisabled={
                    (isTokenModalOpen === 'from' && token.addressToken === toToken?.addressToken) ||
                    (isTokenModalOpen === 'to' && token.addressToken === fromToken?.addressToken)
                  }
                >
                  <Avatar
                    src={token.logo}
                    alt={token.symbol}
                    className="w-4 h-4"
                  />
                  <div className="text-center">
                    <h4 className="font-semibold">{token.symbol}</h4>
                  </div>
                </Button>
              ))}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <ModalTransactionCustom
        isOpen={isModalOpen}
        setIsOpen={handleCloseModal}
        status={mutation.status || ''}
        data={txHash || ""}
        name='swap'
        errorMessage={mutation.error?.message || undefined}
      />
    </div>
  );
};

export default SwapComponent;