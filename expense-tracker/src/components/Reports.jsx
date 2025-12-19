import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function Reports({ expenses }) {
  // --- Logic for Pie Chart (Spending by Category) ---
  const categoryData = expenses.reduce((acc, expense) => {
    const category = expense.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + expense.amount;
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(categoryData),
    datasets: [{
      label: 'Spending by Category',
      data: Object.values(categoryData),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
      ],
      borderColor: '#fff',
      borderWidth: 2,
    }],
  };

  // --- Logic for Bar Chart (Monthly Spending Trend) ---
  const monthlyData = expenses.reduce((acc, expense) => {
    const month = new Date(expense.date).toLocaleString('default', { month: 'short', year: '2-digit' });
    acc[month] = (acc[month] || 0) + expense.amount;
    return acc;
  }, {});

  // Sort months chronologically for the bar chart
  const sortedMonths = Object.keys(monthlyData).sort((a, b) => new Date(`1 ${a}`) - new Date(`1 ${b}`));
  const sortedValues = sortedMonths.map(month => monthlyData[month]);

  const barChartData = {
    labels: sortedMonths,
    datasets: [{
      label: 'Total Spending per Month (₹)',
      data: sortedValues,
      backgroundColor: 'rgba(75, 192, 192, 0.8)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }],
  };

  return (
    <div className="dashboard-layout">
      <div className="app-container">
        <h3>Spending by Category</h3>
        {expenses.length > 0 ? <Pie data={pieChartData} /> : <p className="text-center text-gray-500 mt-4">No data to display.</p>}
      </div>
      <div className="app-container">
        <h3>Monthly Trends</h3>
        {expenses.length > 0 ? <Bar data={barChartData} /> : <p className="text-center text-gray-500 mt-4">No data to display.</p>}
      </div>
    </div>
  );
}

export default Reports;