import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);
  const [budgetGoals, setBudgetGoals] = useState([]);
  const [summaryData, setSummaryData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  });

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      fetchTransactions();
      fetchCategories();
      fetchBudgetGoals();
    } else {
      setTransactions([]);
      setCategories([]);
      setBudgetGoals([]);
      setSummaryData({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0
      });
      setLoading(false);
    }
  }, [currentUser]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/transactions');
      setTransactions(response.data);
      calculateSummary(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const fetchBudgetGoals = async () => {
    try {
      const response = await axios.get('/api/budget-goals');
      setBudgetGoals(response.data);
    } catch (err) {
      console.error('Failed to fetch budget goals', err);
    }
  };

  const calculateSummary = (transactionsData) => {
    const totalIncome = transactionsData
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const totalExpense = transactionsData
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    setSummaryData({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense
    });
  };

  const addTransaction = async (transaction) => {
    try {
      const response = await axios.post('/api/transactions', transaction);
      setTransactions([...transactions, response.data]);
      calculateSummary([...transactions, response.data]);
      return response.data;
    } catch (err) {
      setError('Failed to add transaction');
      throw err;
    }
  };

  const updateTransaction = async (id, transaction) => {
    try {
      const response = await axios.put(`/api/transactions/${id}`, transaction);
      const updatedTransactions = transactions.map(t => 
        t._id === id ? response.data : t
      );
      setTransactions(updatedTransactions);
      calculateSummary(updatedTransactions);
      return response.data;
    } catch (err) {
      setError('Failed to update transaction');
      throw err;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`/api/transactions/${id}`);
      const updatedTransactions = transactions.filter(t => t._id !== id);
      setTransactions(updatedTransactions);
      calculateSummary(updatedTransactions);
    } catch (err) {
      setError('Failed to delete transaction');
      throw err;
    }
  }; 

  const addBudgetGoal = async (goal) => {
    try {
      const response = await axios.post('/api/budget-goals', goal);
      setBudgetGoals([...budgetGoals, response.data]);
      return response.data;
    } catch (err) {
      setError('Failed to add budget goal');
      throw err;
    }
  };

  const updateBudgetGoal = async (id, goal) => {
    try {
      const response = await axios.put(`/api/budget-goals/${id}`, goal);
      const updatedGoals = budgetGoals.map(g => 
        g._id === id ? response.data : g
      );
      setBudgetGoals(updatedGoals);
      return response.data;
    } catch (err) {
      setError('Failed to update budget goal');
      throw err;
    }
  };

  const deleteBudgetGoal = async (id) => {
    try {
      await axios.delete(`/api/budget-goals/${id}`);
      setBudgetGoals(budgetGoals.filter(g => g._id !== id));
    } catch (err) {
      setError('Failed to delete budget goal');
      throw err;
    }
  };

  const value = {
    transactions,
    categories,
    budgetGoals,
    summaryData,
    loading,
    error,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudgetGoal,
    updateBudgetGoal,
    deleteBudgetGoal
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
};