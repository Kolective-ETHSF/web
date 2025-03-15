import { subtitle } from '@/components/primitives';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';
import { useKOLFollowed } from '@/hooks/query/api/useKOLFollowed';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { formatNumberOri } from '@/lib/custom-helper';
import { ButtonSoniclabsGlow } from '@/components/button/button-soniclabs';
import ModalUnfollow from '@/components/modal/modal-unfollow';

export default function DashboardOverview() {
  const { address } = useAccount();
  const { kfData, kfLoading } = useKOLFollowed({ address: address as string });

  return (
    <div className="p-6 space-y-8 border-2 border-default-200 rounded-xl">
      {kfData ? (
        <div className="space-y-6">
          <div className="flex flex-col items-start justify-start pb-4 w-full">
            <div className='flex flex-row items-center gap-3 mb-2'>
              <motion.img
                src={kfData.avatar || "/placeholder-person.jpg"}
                alt={kfData.name}
                width={100}
                height={100}
                className="rounded-full min-w-10 min-h-10 sm:min-w-14 sm:min-h-14 w-10 h-10 sm:w-14 sm:h-14"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
              <motion.span
                className={cn(subtitle({ sizeText: "xl" }), "font-bold text-start truncate line-clamp-1 w-auto")}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {kfData.name}
              </motion.span>
            </div>
            <motion.span
              className={cn(subtitle(), "text-start")}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              @{kfData.username} - {formatNumberOri(kfData.followersTwitter || 0, { compact: true })} followers
            </motion.span>
            <motion.div className='mt-5 flex flex-col gap-3 w-fit' initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
              <div className='flex flex-row gap-3'>
                <ButtonSoniclabsGlow text='Already Followed' />
                <ModalUnfollow kolId={kfData.id} kol={kfData} />
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className={cn(subtitle({ sizeText: 'lxl' }), 'font-semibold')}>Tweets Content</h2>
            <div className="p-4 rounded-lg backdrop-blur-lg shadow-md">
              <InfiniteMovingCards items={kfData} direction="right" speed="slow" />
            </div>
          </motion.div>
        </div>
      ) : kfLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-24 bg-gray-500 rounded-lg" />
          <div className="h-20 bg-gray-500 rounded-lg" />
          <div className="h-48 bg-gray-500 rounded-lg" />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-4">
          <span className="text-lg font-semibold">No KOL Followed</span>
          <span className="text-default-400">You haven&apos;t followed any KOL yet</span>
        </div>
      )}
    </div>
  );
}
