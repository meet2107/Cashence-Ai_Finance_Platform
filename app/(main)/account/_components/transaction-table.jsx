"use client";

import React, { useEffect, useMemo, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { format } from 'date-fns';
import { categoryColors } from '@/data/categories';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ChevronDown, ChevronUp, Clock, MoreHorizontal, RefreshCcw, Search, Trash, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import useFetch from '@/hooks/use-fetch';
import { bulkDeleteTransactions } from '@/actions/accounts';
import { toast } from 'sonner';
import { BarLoader } from 'react-spinners';

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

const TransactionTable = ({ transactions }) => {

  const router = useRouter();
  const [selectedIds, setselectedIds] = useState([]);
  const [sortConfig, setsortConfig] = useState({
    field: "date",
    direction: "desc",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;

  const {
    loading: deleteLoading,
    fn: deleteFn,
    data: deleted,
  } = useFetch(bulkDeleteTransactions);

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter((transaction) =>
        transaction.description?.toLowerCase().includes(search)
      );
    }

    if (recurringFilter) {
      result = result.filter((transaction) =>
        recurringFilter === "recurring" ? transaction.isRecurring : !transaction.isRecurring
      );
    }

    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    result.sort((a, b) => {
      let comparison = 0;
      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          break;
      }
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * transactionsPerPage;
    const endIndex = startIndex + transactionsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage]);

  const handleSort = (field) => {
    setsortConfig(current => ({
      field,
      direction: current.field === field && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleSelect = (id) => {
    setselectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
    );
  };

  const handleSelectAll = () => {
    setselectedIds((current) =>
      current.length === paginatedTransactions.length
        ? []
        : paginatedTransactions.map((t) => t.id)
    );
  };

  const handleBulkDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} transactions`)) {
      return;
    }
    deleteFn(selectedIds);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setselectedIds([]);
  };

  useEffect(() => {
    if (deleted && !deleteLoading) {
      toast.error("Transactions deleted successfully");
    }
  }, [deleted, deleteLoading]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, typeFilter, recurringFilter, transactions]);

  return (
    <div className='space-y-4'>
      {deleteLoading && selectedIds.length > 0 && (
        <BarLoader className='mt-4' width={"100%"} color="#9333ea" />
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search Transactions"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>

        <div className='flex gap-2'>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select value={recurringFilter} onValueChange={setRecurringFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">Recurring</SelectItem>
              <SelectItem value="non-recurring">Non-recurring</SelectItem>
            </SelectContent>
          </Select>

          {selectedIds.length > 0 && (
            <div className='flex items-center gap-2'>
              <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
                <Trash className='h-2 w-4 mr-2' />
                Delete Selected ({selectedIds.length})
              </Button>
            </div>
          )}

          {(searchTerm || typeFilter || recurringFilter) && (
            <Button variant="outline" size="icon" onClick={handleClearFilters} title="Clear Filters">
              <X className='h-4 w-5' />
            </Button>
          )}
        </div>
      </div>

      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox onCheckedChange={handleSelectAll}
                  checked={
                    selectedIds.length === paginatedTransactions.length &&
                    paginatedTransactions.length > 0
                  }
                />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("date")}>
                <div className='flex items-center'>Date
                  {sortConfig.field === "date" && (sortConfig.direction === "asc" ?
                    <ChevronUp className='ml-1 h-4 w-4' /> :
                    <ChevronDown className='ml-1 h-4 w-4' />)}
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("category")}>
                <div className='flex items-center'>Category
                  {sortConfig.field === "category" && (sortConfig.direction === "asc" ?
                    <ChevronUp className='ml-1 h-4 w-4' /> :
                    <ChevronDown className='ml-1 h-4 w-4' />)}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort("amount")}>
                <div className='flex items-center justify-end'>Amount
                  {sortConfig.field === "amount" && (sortConfig.direction === "asc" ?
                    <ChevronUp className='ml-1 h-4 w-4' /> :
                    <ChevronDown className='ml-1 h-4 w-4' />)}
                </div>
              </TableHead>
              <TableHead>Recurring</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="w-[50px]">
                    <Checkbox
                      onCheckedChange={() => handleSelect(transaction.id)}
                      checked={selectedIds.includes(transaction.id)}
                    />
                  </TableCell>
                  <TableCell>{format(new Date(transaction.date), "PP")}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="capitalize">
                    <span style={{
                      background: categoryColors[transaction.category],
                    }}
                      className='px-2 py-1 rounded text-white text-sm'
                    >
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell className="text-right font-medium" style={{ color: transaction.type === 'EXPENSE' ? 'red' : 'green' }}>
                    {transaction.type === 'EXPENSE' ? '-' : '+'}${transaction.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>{transaction.isRecurring ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="outline" className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200">
                            <RefreshCcw className='h-3 w-3' />
                            {RECURRING_INTERVALS[transaction.recurringInterval]}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className='text-sm'>
                            <div className='font-medium'>Next Date:</div>
                            <div>{format(new Date(transaction.nextRecurringDate), "PP")}</div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <Badge variant="outline" className="gap-1">
                      <Clock className='h-3 w-3' />
                      One-Time
                    </Badge>
                  )}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className='h-4 w-4' /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel onClick={() => router.push(`/transaction/create?edit=${transaction.id}`)}>Edit</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => deleteFn([transaction.id])}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center mt-4 space-x-2">
          <Button size="sm" variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>
            Previous
          </Button>
          {(() => {
            const pageNumbers = [];
            const maxVisible = 3;
            const half = Math.floor(maxVisible / 2);
            let start = Math.max(1, currentPage - half);
            let end = Math.min(totalPages, currentPage + half);

            if (currentPage <= half) {
              end = Math.min(totalPages, maxVisible);
            } else if (currentPage + half > totalPages) {
              start = Math.max(1, totalPages - maxVisible + 1);
            }

            for (let i = start; i <= end; i++) {
              pageNumbers.push(i);
            }

            return (
              <>
                {start > 1 && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => setCurrentPage(1)}>1</Button>
                    {start > 2 && <span className="px-1">...</span>}
                  </>
                )}
                {pageNumbers.map(i => (
                  <Button
                    key={i}
                    size="sm"
                    variant={currentPage === i ? "default" : "outline"}
                    onClick={() => setCurrentPage(i)}
                  >
                    {i}
                  </Button>
                ))}
                {end < totalPages && (
                  <>
                    {end < totalPages - 1 && <span className="px-1">...</span>}
                    <Button size="sm" variant="outline" onClick={() => setCurrentPage(totalPages)}>{totalPages}</Button>
                  </>
                )}
              </>
            );
          })()}
          <Button size="sm" variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default TransactionTable;
