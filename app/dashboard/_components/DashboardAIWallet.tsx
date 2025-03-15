import ModalTransactionCustom from "@/components/modal/modal-transaction-custom";
import ModalTransfer from "@/components/modal/modal-transfer";
import { subtitle } from "@/components/primitives";
import { useTransferAI } from "@/hooks/mutation/api/useTransferAI";
import { useToken } from "@/hooks/query/api/useToken";
import { useAddressAI } from "@/hooks/query/useAddressAI";
import { useBalanceAI } from "@/hooks/query/useBalanceAI";
import { formatNumberOri } from "@/lib/custom-helper";
import { cn } from "@/lib/utils";
import { TokenResponse } from "@/types/api/token.types";
import { Button } from "@heroui/button";
import { Image } from "@heroui/image";
import { Snippet } from "@heroui/snippet";
import { motion } from "framer-motion";
import { useState } from "react";
import { useAccount } from "wagmi";

export default function DashboardAIWallet() {
  const { tData } = useToken();
  const { address } = useAccount();
  const { addressAI } = useAddressAI();

  const handleCopy = () => {
    navigator.clipboard.writeText(addressAI.toString())
  }

  return (
    <div className="flex flex-col gap-5 w-full">
      <div className="flex flex-col gap-2 w-auto sm:w-fit">
        <motion.h2
          className={cn(subtitle({ sizeText: "lxl" }), "font-bold text-start")}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          Wallet Details
        </motion.h2>
        {addressAI &&
          <Snippet
            variant='flat'
            color='warning'
            className='w-full sm:w-auto'
            classNames={{
              pre: "truncate"
            }}
            title="Your Wallet Address"
            hideSymbol
            onCopy={handleCopy}
          >
            {addressAI.toString()}
          </Snippet>
        }
      </div>
      <div className="flex flex-col gap-2 w-full">
        <motion.h2
          className={cn(subtitle({ sizeText: "lxl" }), "font-bold text-start")}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          List your tokens
        </motion.h2>
        <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-4 relative z-10 py-10 max-w-7xl mx-auto">
          {tData && tData.length > 0 && tData?.map((t, i) => (
            <Feature key={t.id} index={i} token={t} address={address as HexAddress} />
          ))}
        </div>
      </div>
    </div>
  );
}

const Feature = ({
  index,
  token,
  address
}: {
  index: number;
  token: TokenResponse;
  address: HexAddress;
}) => {
  const { bNormalized } = useBalanceAI({ token: token.addressToken as HexAddress, decimals: token.decimals });
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalOpenTransaction, setIsModalOpenTransaction] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");
  const { mutation, txHash } = useTransferAI();

  const closeModal = () => {
    setIsModalOpen(false);
  }

  const handleTransfer = async () => {
    mutation.mutate({
      addressToken: token.addressToken as HexAddress,
      toAddress: address,
      value: amount
    });
  }
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800 items-center justify-center",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}

      <div className="w-full text-center">
        <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200">{token.name}</h3>
      </div>

      <div className="flex w-full justify-center items-center my-4">
        <Image
          src={token?.logo || "https://s2.coinmarketcap.com/static/img/coins/64x64/32684.png"}
          alt={token?.name}
          width={50}
          height={50}
          className="rounded-full"
        />
      </div>

      <div className="text-neutral-700 dark:text-neutral-300 text-lg font-medium">
        {formatNumberOri(Number(bNormalized), { compact: true })} ${token.symbol}
      </div>

      <Button
        onPress={() => setIsModalOpen(true)}
        color="warning"
        className="mt-4"
      >
        Transfer to Main Wallet
      </Button>

      <ModalTransfer
        isOpen={isModalOpen}
        onClose={closeModal}
        onTransfer={handleTransfer}
        amount={amount}
        setAmount={setAmount}
        recipient={address}
        setRecipient={() => { }}
        token={token.symbol}
        isLoading={mutation.isPending}
        maxAmount={bNormalized}
        logoToken={token.logo}
      />

      <ModalTransactionCustom
        isOpen={isModalOpenTransaction}
        setIsOpen={() => setIsModalOpenTransaction(false)}
        status={mutation.status || ""}
        data={txHash || ""}
        errorMessage={mutation.error?.message || undefined}
        name='transfer'
      />
    </div>
  );
};
