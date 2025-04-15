import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { BudgetContext } from '../contexts/BudgetContext';

const AddTransaction = () => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().slice(0, 10)
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addTransaction, categories, error } = useContext(BudgetContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addTransaction({
        ...formData,
        amount: parseFloat(formData.amount)
      });
      navigate('/');
    } catch (err) {
      console.error('Failed to add transaction:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-transaction">
      <h2>Add Transaction</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            id="amount"
            name="amount"
            step="0.01"
            min="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Type</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="type"
                value="expense"
                checked={formData.type === 'expense'}
                onChange={handleChange}
              />
              Expense
            </label>
            <label>
              <input
                type="radio"
                name="type"
                value="income"
                checked={formData.type === 'income'}
                onChange={handleChange}
              />
              Income
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            {categories.map(category => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-buttons">
          <button type="button" onClick={() => navigate('/')}>Cancel</button>
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTransaction;
