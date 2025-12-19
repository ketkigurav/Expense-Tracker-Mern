import { useState, useMemo } from 'react';

function History({ expenses }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Group expenses by month
  const groupedExpenses = useMemo(() => {
    // First, filter based on the search term
    const filtered = expenses.filter(expense =>
      expense.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Then, group the filtered results by month
    return filtered.reduce((acc, expense) => {
      const monthYear = new Date(expense.date).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
      if (!acc[monthYear]) {
        acc[monthYear] = [];
      }
      acc[monthYear].push(expense);
      return acc;
    }, {});
  }, [expenses, searchTerm]); // Recalculate only when expenses or search term change

  return (
    <div className="app-container" style={{ flex: 2, maxWidth: '1000px', margin: '0 auto' }}>
      <h3>Transaction History</h3>
      <input
        type="text"
        placeholder="Search by description..."
        className="history-search"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      
      {Object.keys(groupedExpenses).length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        Object.entries(groupedExpenses).map(([month, monthExpenses]) => (
          <div key={month} className="month-group">
            <h4>{month}</h4>
            <div className="table-container">
              <table className="expense-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {monthExpenses.map(expense => (
                    <tr key={expense._id}>
                      <td>{expense.description}</td>
                      <td>{expense.category}</td>
                      <td>{new Date(expense.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</td>
                      <td>₹{expense.amount.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default History;