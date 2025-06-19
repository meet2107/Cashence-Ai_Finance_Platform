import { getUserAccounts } from '@/actions/dashboard'
import { defaultCategories } from '@/data/categories';
import React from 'react'
import {AddTransactionForm} from '../_components/transaction-form';

const AddTransactionPage = async () => {
  const accounts = await getUserAccounts();
  return (
    <div className = 'max-w-3xl mx-auto px-5'>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent">
          Add Transaction
        </h1>

        <AddTransactionForm 
            accounts = {accounts}
            categories = {defaultCategories}
        />
    </div>
  );
};

export default AddTransactionPage;