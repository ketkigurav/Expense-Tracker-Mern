import { useState, useMemo } from 'react';
import ExpenseList from './ExpenseList';
import ExpenseForm from './ExpenseForm';

function ExpenseTracker({ expenses, totalExpenses, onAddExpense, onDeleteExpense, onEditExpense, onUpdateExpense, editingExpense, setEditingExpense }) {
  // 1. Add new state to hold the selected filter date
  const [filterDate, setFilterDate] = useState('');

  // 2. Filter expenses based on the selected date
  const filteredExpenses = useMemo(() => {
    if (!filterDate) {
      return expenses; // If no date is selected, show all expenses
    }
    // Otherwise, show only expenses that match the selected date
    return expenses.filter(expense => 
      new Date(expense.date).toISOString().split('T')[0] === filterDate
    );
  }, [expenses, filterDate]); // Recalculate only when expenses or filterDate change

  return (
    <div className="app-container">
      <ExpenseForm
        onAddExpense={onAddExpense}
        onUpdateExpense={onUpdateExpense}
        editingExpense={editingExpense}
        setEditingExpense={setEditingExpense}
      />
      <div className="summary">
        <h3>Total Expenses: ₹{totalExpenses.toFixed(2)}</h3>
      </div>

      {/* 3. Add the new date filter UI */}
      <div className="filter-container">
        <h4>Filter by Date</h4>
        <div className="filter-controls">
          <input 
            type="date" 
            value={filterDate} 
            onChange={(e) => setFilterDate(e.target.value)} 
          />
          <button onClick={() => setFilterDate('')}>Clear</button>
        </div>
      </div>
      
      {/* 4. Pass the filtered list to the ExpenseList component */}
      <ExpenseList
        expenses={filteredExpenses}
        onDeleteExpense={onDeleteExpense}
        onEditExpense={onEditExpense}
      />
    </div>
  );
}
export default ExpenseTracker;