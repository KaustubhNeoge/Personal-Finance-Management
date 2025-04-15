import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { BudgetContext } from '../contexts/BudgetContext';
import DashboardChart from '../Components/DashboardChart';

const Dashboard = () => {
  const { summaryData, transactions, budgetGoals, loading } = useContext(BudgetContext);

  if (loading) {
    return <div>Loading dashboard data...</div>;
  }

  const recentTransactions = transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const calculateGoalProgress = (goal) => {
    const categoryTransactions = transactions
      .filter(t => t.category === goal.category && t.type === 'expense')
      .filter(t => {
        const transactionDate = new Date(t.date);
        const currentDate = new Date();
        return transactionDate.getMonth() === currentDate.getMonth() && 
               transactionDate.getFullYear() === currentDate.getFullYear();
      });
    
    const spent = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      ...goal,
      spent,
      progress: (spent / goal.amount) * 100
    };
  };

  const goalsWithProgress = budgetGoals.map(calculateGoalProgress);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      
      <div className="summary-cards">
        <div className="card">
          <h3>Total Income</h3>
          <p className="amount income">${summaryData.totalIncome.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Total Expenses</h3>
          <p className="amount expense">${summaryData.totalExpense.toFixed(2)}</p>
        </div>
        <div className="card">
          <h3>Balance</h3>
          <p className={`amount ${summaryData.balance >= 0 ? 'income' : 'expense'}`}>
            ${Math.abs(summaryData.balance).toFixed(2)}
          </p>
        </div>
      </div>

      <div className="dashboard-charts">
        <DashboardChart transactions={transactions} />
      </div>

      <div className="dashboard-sections">
        <div className="recent-transactions">
          <div className="section-header">
            <h2>Recent Transactions</h2>
            <Link to="/history">View All</Link>
          </div>
          {recentTransactions.length > 0 ? (
            <ul className="transaction-list">
              {recentTransactions.map(transaction => (
                <li key={transaction._id} className="transaction-item">
                  <div className="transaction-info">
                    <span className="transaction-date">
                      {new Date(transaction.date).toLocaleDateString()}
                    </span>
                    <span className="transaction-description">{transaction.description}</span>
                  </div>
                  <span className={`transaction-amount ${transaction.type}`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent transactions</p>
          )}
        </div>

        <div className="budget-goals-preview">
          <div className="section-header">
            <h2>Budget Goals</h2>
            <Link to="/budget-goals">Manage Goals</Link>
          </div>
          {goalsWithProgress.length > 0 ? (
            <ul className="goals-list">
              {goalsWithProgress.map(goal => (
                <li key={goal._id} className="goal-item">
                  <div className="goal-info">
                    <span className="goal-category">{goal.category}</span>
                    <div className="goal-progress-info">
                      <span>${goal.spent.toFixed(2)} / ${goal.amount.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ 
                        width: `${Math.min(goal.progress, 100)}%`,
                        backgroundColor: goal.progress > 100 ? '#e74c3c' : '#2ecc71'
                      }}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No budget goals set</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
