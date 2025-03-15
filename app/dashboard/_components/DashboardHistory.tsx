/* eslint-disable @typescript-eslint/no-explicit-any */
import { useTransfersUser } from '@/hooks/query/graphql/useTransfersUser';
import { useSwapsUser } from '@/hooks/query/graphql/useSwapsUser';
import { normalize } from '@/lib/bignumber';
import { DECIMALS_TOKEN } from '@/lib/constants';
import { formatNumberOri } from '@/lib/custom-helper';
import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useMemo, useCallback } from 'react';
import SkeletonWrapper from '@/components/loader/skeleton-wrapper';
import { Select, SelectItem } from '@heroui/select';
import { cn } from '@/lib/utils';
import { subtitle } from '@/components/primitives';
import { motion } from 'framer-motion';
import { Button } from '@heroui/button';
import { Snippet } from '@heroui/snippet';

const PAGE_SIZE = 10;

export default function DashboardHistory() {
  const { tuData, tuLoading } = useTransfersUser({ wallet: "ai" });
  const { tuData: tuDataUser, tuLoading: tuLoadingUser } = useTransfersUser({ wallet: "user" });
  const { suData, suLoading } = useSwapsUser({ wallet: "ai" });
  const { suData: suDataUser, suLoading: suLoadingUser } = useSwapsUser({ wallet: "user" });

  const [selectedType, setSelectedType] = useState<'transfers' | 'swaps'>('transfers');
  const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: 'asc' | 'desc' }>({
    key: 'blockTimestamp',
    direction: 'desc'
  });
  const [currentPage, setCurrentPage] = useState(1);

  const handleTypeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value as 'transfers' | 'swaps');
    setCurrentPage(1); // Reset to first page when changing data type
  }, []);

  const handleSort = useCallback((key: string) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  }, []);

  const columns = useMemo(() => selectedType === 'transfers'
    ? [
      { key: 'blockNumber', label: 'Block Number' },
      { key: 'blockTimestamp', label: 'Timestamp' },
      { key: 'from', label: 'From' },
      { key: 'to', label: 'To' },
      { key: 'transactionHash', label: 'Transaction Hash' },
      { key: 'value', label: 'Value' },
    ]
    : [
      { key: 'blockNumber', label: 'Block Number' },
      { key: 'blockTimestamp', label: 'Timestamp' },
      { key: 'sender', label: 'Sender' },
      { key: 'tokenIn', label: 'Token In' },
      { key: 'tokenOut', label: 'Token Out' },
      { key: 'amountIn', label: 'Amount In' },
      { key: 'amountOut', label: 'Amount Out' },
      { key: 'buyPrice', label: 'Buy Amount' },
      { key: 'sellPrice', label: 'Token Price' },
    ], [selectedType]);

    const isLoading = selectedType === 'transfers' ? tuLoading || tuLoadingUser : suLoading || suLoadingUser;

    const combinedData = useMemo(() => {
      const aiData = selectedType === 'transfers' ? tuData : suData;
      const userData = selectedType === 'transfers' ? tuDataUser : suDataUser;
      return [...(aiData || []), ...(userData || [])];
    }, [selectedType, tuData, tuDataUser, suData, suDataUser]);
  
    const sortedData = useMemo(() => {
      if (!combinedData.length) return [];
      return [...combinedData].sort((a, b) => {
        if (!sortConfig.key) return 0;
        const keyPath = sortConfig.key as keyof typeof combinedData[0];
        let valA: any = a[keyPath] ?? '';
        let valB: any = b[keyPath] ?? '';
        if (['blockNumber', 'blockTimestamp', 'value', 'amountIn', 'amountOut'].includes(sortConfig.key)) {
          valA = Number(valA);
          valB = Number(valB);
        }
        return sortConfig.direction === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
      });
    }, [combinedData, sortConfig]);

  // Pagination calculations
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return sortedData.slice(startIndex, startIndex + PAGE_SIZE);
  }, [sortedData, currentPage]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Function to render pagination numbers
  const renderPaginationNumbers = useCallback(() => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          variant={currentPage === i ? 'solid' : 'bordered'}
          color='warning'
          size='sm'
          className="mx-1"
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }
    return pages;
  }, [currentPage, totalPages, handlePageChange]);

  // Function to render a cell value
  const renderCellValue = useCallback((item: any, key: string) => {
    const value = item[key as keyof typeof item];

    if (key === 'blockTimestamp') {
      return new Date(Number(value) * 1000).toLocaleString();
    }

    if (key === "from" || key === "to" || key === "sender" || key === "tokenIn" || key === "tokenOut") {
      return (
        <Snippet
          hideSymbol
          className="max-w-full"
          color="warning"
          variant="flat"
          classNames={{
            pre: "truncate"
          }}
        >
          {value}
        </Snippet>
      );
    }


    if (key === 'transactionHash') {
      return (
        <Snippet
          hideSymbol
          className="max-w-full"
          color="warning"
          variant="flat"
          classNames={{
            pre: "truncate"
          }}
        >
          {value}
        </Snippet>
      );
    }

    if (key === "value" || key === "amountIn" || key === "amountOut" || key === "buyPrice" || key === "sellPrice") {
      const normalizedValue = normalize(value, DECIMALS_TOKEN);
      return formatNumberOri(Number(normalizedValue), { compact: true, decimals: 2 });
    }

    return <span>{value}</span>;
  }, []);

  return (
    <div className="overflow-x-auto p-4">
      <motion.h2
        className={cn(subtitle({ sizeText: "lxl" }), "font-bold text-start")}
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        Check your history
      </motion.h2>

      <Select
        value={selectedType}
        onChange={handleTypeChange}
        variant='bordered'
        color='warning'
        className='my-5 max-w-48'
        defaultSelectedKeys={['transfers']}
      >
        <SelectItem key={'transfers'}>Transfer History</SelectItem>
        <SelectItem key={'swaps'}>Swaps History</SelectItem>
      </Select>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-default-200 text-sm">
          <thead>
            <tr>
              {columns.map(({ key, label }) => (
                <th
                  key={key}
                  className="border border-default-200 px-4 py-2 cursor-pointer"
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center justify-center gap-1">
                    {label}
                    <ChevronDown
                      className={cn(
                        "w-4 h-4",
                        sortConfig.key === key ? "text-warning" : "text-gray-500",
                        sortConfig.key === key && sortConfig.direction === 'desc' && "rotate-180"
                      )}
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: PAGE_SIZE }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="text-center border border-default-200">
                  {columns.map(({ key }) => (
                    <td key={`skeleton-cell-${key}-${index}`} className="border border-default-200 px-4 py-2">
                      <SkeletonWrapper isLoading={true}>
                        <span>Loading...</span>
                      </SkeletonWrapper>
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={index} className="text-center border border-default-200">
                  {columns.map(({ key }) => (
                    <td key={`${key}-${index}`} className="border border-default-200 px-4 py-2 truncate max-w-xs">
                      {renderCellValue(item, key)}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="border border-default-200 px-4 py-8 text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-2">
          <Button
            variant='bordered'
            color='warning'
            size='sm'
            isDisabled={currentPage === 1}
            onPress={() => handlePageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {renderPaginationNumbers()}

          <Button
            variant='bordered'
            color='warning'
            size='sm'
            isDisabled={currentPage === totalPages}
            onPress={() => handlePageChange(currentPage + 1)}
            aria-label="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          <span className="text-sm ml-2">
            Page {currentPage} of {totalPages} ({totalItems} items)
          </span>
        </div>
      )}
    </div>
  );
}