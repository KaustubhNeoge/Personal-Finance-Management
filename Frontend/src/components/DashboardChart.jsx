import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DashboardChart = ({ transactions }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    prepareChartData();
  }, [transactions]);

  const prepareChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    
    const labels = [];
    for (let i = 5; i >= 0; i--) {
      const monthIndex = (curentMonth - i + 12) % 12;
      labels.push(months[monthIndex]);
    }

    const incomeData = Array(6).fill(0);
    const expenseData = Array(6).fill(0);

    transactions.forEach(transaction => {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = transactionDate.getMonth();
      const monthsAgo = (currentMonth - transactionMonth + 12) % 12;
      
      if (monthsAgo <= 5) {
        const index = 5 - monthsAgo;
        if (transaction.type === 'income') {
          incomeData[index] += transaction.amount;
        } else {
          expenseData[index] += transaction.amount;
        }
      }
    });

    setChartData({
      labels,
      datasets: [
        {
          label: 'Income',
          data: incomeData,
          borderColor: '#2ecc71',
          backgroundColor: 'rgba(46, 204, 113, 0.2)',
          tension: 0.4
        },
        {
          label: 'Expenses',
          data: expenseData,
          borderColor: '#e74c3c',
          backgroundColor: 'rgba(231, 76, 60, 0.2)',
          tension: 0.4
        }
      ]
    });
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Income vs Expenses (Last 6 Months)'
      }
    }
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={options} height={300} />
    </div>
  );
};

export default DashboardChart;
