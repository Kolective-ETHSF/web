import { ButtonSoniclabs } from '@/components/button/button-soniclabs';
import Loading from '@/components/loader/loading';
import ModalApi from '@/components/modal/modal-api';
import { useCreateWalletAI } from '@/hooks/mutation/api/useCreateWalletAI'
import { Snippet } from '@heroui/snippet';
import React, { useCallback } from 'react'
import { useAccount } from 'wagmi'

export default function CreateWalletContent({
  addressAI
}: {
  addressAI: HexAddress
}) {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const { address } = useAccount();

  const { mutation: mCreateWallet, result: rCreateWallet } = useCreateWalletAI()

  const handleCreate = () => {
    mCreateWallet.mutate({
      user_address: address as string
    })
  }

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(addressAI.toString())
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-lg font-normal">
        You need to create a wallet AI first to automate the staking.
      </p>
      {addressAI ? (
        <Snippet
          variant='flat'
          color='warning'
          className='w-full'
          classNames={{
            pre: "truncate"
          }}
          title="Your Wallet Address"
          hideSymbol
          onCopy={handleCopy}
        >
          {addressAI.toString()}
        </Snippet>
      ) : (
        <ButtonSoniclabs
          fullWidth={false}
          disabled={mCreateWallet.isPending || mCreateWallet.isSuccess}
          text={mCreateWallet.isSuccess ? "Wallet Created" : "Create Wallet"}
          onClick={handleCreate}
        />
      )}
      <ModalApi
        isOpen={isModalOpen}
        setIsOpen={closeModal}
        title="Create Wallet"
        status={mCreateWallet.status}
        data={rCreateWallet?.address || ""}
        openText="Your wallet address is:"
        processName="wallet"
      />
      {mCreateWallet.isPending && (<Loading />)}
    </div>
  )
}
