import React, { useState, useContext } from 'react';
import { BudgetContext } from '../contexts/BudgetContext';

const BudgetGoals = () => {
  const { budgetGoals, categories, addBudgetGoal, updateBudgetGoal, deleteBudgetGoal, transactions, error } = useContext(BudgetContext);
  
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly'
  });
  
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      if (editingId) {
        await updateBudgetGoal(editingId, {
          ...formData,
          amount: parseFloat(formData.amount)
        });
        setEditingId(null);
      } else {
        await addBudgetGoal({
          ...formData,
          amount: parseFloat(formData.amount)
        });
      }
      setFormData({
        category: '',
        amount: '',
        period: 'monthly'
      });
    } catch (err) {
      console.error('Failed to save budget goal:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (goal) => {
    setFormData({
      category: goal.category,
      amount: goal.amount.toString(),
      period: goal.period
    });
    setEditingId(goal._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this budget goal?')) {
      try {
        await deleteBudgetGoal(id);
      } catch (err) {
        console.error('Failed to delete budget goal:', err);
      }
    }
  };

  const calculateProgress = (goal) => {
    const categoryTransactions = transactions
      .filter(t => t.category === goal.category && t.type === 'expense')
      .filter(t => {
        const transactionDate = new Date(t.date);
        const currentDate = new Date();
        return transactionDate.getMonth() === currentDate.getMonth() && 
               transactionDate.getFullYear() === currentDate.getFullYear();
      });
    
    const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    const progress = (spent / goal.amount) * 100;
    
    return { spent, progress };
  };

  return (
    <div className="budget-goals">
      <h2>Budget Goals</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="budget-goal-form">
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
          <label htmlFor="amount">Budget Amount</label>
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
          <label htmlFor="period">Period</label>
          <select
            id="period"
            name="period"
            value={formData.period}
            onChange={handleChange}
            required
          >
            <option value="monthly">Monthly</option>
            <option value="weekly">Weekly</option>
            <option value="yearly">Yearly</option>
          </select>
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : editingId ? 'Update Goal' : 'Add Goal'}
        </button>
        {editingId && (
          <button 
            type="button" 
            onClick={() => {
              setEditingId(null);
              setFormData({
                category: '',
                amount: '',
                period: 'monthly'
              });
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="goals-list-container">
        <h3>Your Budget Goals</h3>
        {budgetGoals.length > 0 ? (
          <ul className="goals-list">
            {budgetGoals.map(goal => {
              const { spent, progress } = calculateProgress(goal);
              return (
                <li key={goal._id} className="goal-item">
                  <div className="goal-details">
                    <h4>{goal.category}</h4>
                    <div className="goal-info">
                      <span>Budget: ${goal.amount.toFixed(2)} ({goal.period})</span>
                      <span>Spent: ${spent.toFixed(2)}</span>
                      <span>Remaining: ${(goal.amount - spent).toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${Math.min(progress, 100)}%`,
                          backgroundColor: progress > 100 ? '#e74c3c' : '#2ecc71'
                        }}
                      ></div>
                    </div>
                    <span className="progress-text">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="goal-actions">
                    <button onClick={() => handleEdit(goal)}>Edit</button>
                    <button onClick={() => handleDelete(goal._id)}>Delete</button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No budget goals set. Add your first goal above!</p>
        )}
      </div>
    </div>
  );
};

export default BudgetGoals;
