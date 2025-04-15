import React, { useState, useContext } from 'react';
import { BudgetContext } from '../contexts/BudgetContext';

const TransactionHistory = () => {
  const { transactions, deleteTransaction, categories } = useContext(BudgetContext);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    startDate: '',
    endDate: '',
    search: ''
  });

  const handleFilterChange = (e) => {  
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value   
    }));
  };

  const filteredTransactions = transactions.filter(transaction => {

    if (filters.type !== 'all' && transaction.type !== filters.type) {
      return false;
    }
    
    if (filters.category !== 'all' && transaction.category !== filters.category) {
      return false;
    }
    
    if (filters.startDate && new Date(transaction.date) < new Date(filters.startDate)) {
      return false;
    }
    if (filters.endDate && new Date(transaction.date) > new Date(filters.endDate)) {
      return false;
    }
    
    if (filters.search && !transaction.description.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      await deleteTransaction(id);
    }
  };

  return (
    <div className="transaction-history">
      <h2>Transaction History</h2>
      
      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="type">Type</label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="startDate">From</label>
          <input
            type="date"
            id="startDate"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter-group">
          <label htmlFor="endDate">To</label>
          <input
            type="date"
            id="endDate"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>
        <div className="filter-group search">
          <input
            type="text"
            id="search"
            name="search"
            placeholder="Search transactions..."
            value={filters.search}
            onChange={handleFilterChange}
        </div>
      </div>

      <div className="transactions-table-container">
        {filteredTransactions.length > 0 ? (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map(transaction => (
                <tr key={transaction._id}>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.category}</td>
                  <td className={transaction.type}>
                    {transaction.type === 'income' ? 'Income' : 'Expense'}
                  </td>
                  <td className={transaction.type}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </td>
                  <td>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDelete(transaction._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No transactions found matching your filters.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
