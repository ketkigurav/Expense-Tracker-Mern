// src/components/ExpenseList.jsx

function ExpenseList({ expenses, onDeleteExpense, onEditExpense }) {
  if (expenses.length === 0) {
    return <p className="no-expenses">No expenses yet. Add one!</p>;
  }

  return (
    <div className="table-container">
      <table className="expense-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Amount</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id}>
              <td>{expense.description}</td>
              <td>₹{expense.amount.toFixed(2)}</td>
              <td className="action-cell">
                <button onClick={() => onEditExpense(expense._id)} className="edit-btn">
                  ✏️
                </button>
                <button onClick={() => onDeleteExpense(expense._id)} className="delete-btn">
                  &times;
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseList;