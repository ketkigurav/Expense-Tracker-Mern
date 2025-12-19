// src/components/MonthlySummary.jsx

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register the necessary components for a Line chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function MonthlySummary({ expenses }) {
  // --- Chart Logic ---

  // 1. Filter expenses for the current month
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  // Sort expenses by date to make the line graph sequential
  monthlyExpenses.sort((a, b) => new Date(a.date) - new Date(b.date));

  // 2. Prepare data specifically for a line chart
  const chartData = {
    // X-axis labels (e.g., "Oct 5", "Oct 7")
    labels: monthlyExpenses.map(expense => {
        const date = new Date(expense.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }),
    datasets: [
      {
        label: 'Daily Spending (₹)',
        // Y-axis data points (the amounts)
        data: monthlyExpenses.map(expense => expense.amount),
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        fill: true, // Fills the area under the line
        tension: 0.1 // Makes the line slightly curved
      },
    ],
  };

  // 3. Add options to configure the chart's appearance
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Spending This Month',
      },
    },
  };

  return (
    <div className="app-container">
      <h3>Monthly Expenditure</h3>
      {monthlyExpenses.length > 0 ? (
        // 4. Render the Line component
        <Line options={options} data={chartData} />
      ) : (
        <p>No expenses recorded for this month.</p>
      )}
    </div>
  );
}

export default MonthlySummary;