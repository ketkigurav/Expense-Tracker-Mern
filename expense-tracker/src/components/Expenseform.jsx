import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const getFormattedDate = (date) => new Date(date).toISOString().split('T')[0];

const getToday = () => new Date().toISOString().split('T')[0];

function ExpenseForm({ onAddExpense, onUpdateExpense, editingExpense, setEditingExpense }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(getToday());
  const [category, setCategory] = useState('Food');
  const [isSubmitting, setIsSubmitting] = useState(false); // 1. ADD NEW SUBMITTING STATE

  const isEditing = editingExpense !== null;

  useEffect(() => {
    if (isEditing) {
      setDescription(editingExpense.description);
      setAmount(editingExpense.amount);
      setDate(getFormattedDate(editingExpense.date));
      setCategory(editingExpense.category || 'Food');
    } else {
      setDescription('');
      setAmount('');
      setDate(getToday());
      setCategory('Food');
    }
  }, [editingExpense, isEditing]);

  // 2. MAKE HANDLESUBMIT ASYNC
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ... (validation logic remains the same) ...
    if (!description.trim()) return toast.error('Description cannot be empty.');
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return toast.error('Please enter a valid amount.');
    if (!date) return toast.error('Please select a valid date.');

    setIsSubmitting(true); // 3. SET LOADING STATE
    const expenseData = { description, amount: numericAmount, date, category };

    try {
      if (isEditing) {
        await onUpdateExpense({ ...editingExpense, ...expenseData }); // 4. AWAIT THE FUNCTION
        toast.success('Expense updated!');
      } else {
        await onAddExpense(expenseData); // 4. AWAIT THE FUNCTION
        toast.success('Expense added!');
      }
    } catch (error) {
      console.error('Failed to submit expense:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false); // 5. UNSET LOADING STATE
    }
  };
  
  const handleCancel = () => {
    setEditingExpense(null);
  };

  return (
    <form onSubmit={handleSubmit} className="expense-form">
      <h3>{isEditing ? 'Edit Expense' : 'Add New Expense'}</h3>
      {/* ... (form controls remain the same) ... */}
      <div className="form-control">
        <label>Description</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="form-control">
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Shopping">Shopping</option>
          <option value="Utilities">Utilities</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="form-control">
        <label>Amount</label>
        <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
      </div>
      <div className="form-control">
        <label>Date</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      
      {/* 6. UPDATE BUTTONS TO BE DISABLED */}
      <div className="form-actions">
        <button type="submit" disabled={isSubmitting}>
          {isEditing ? (isSubmitting ? 'Updating...' : 'Update Expense') : (isSubmitting ? 'Adding...' : 'Add Expense')}
        </button>
        {isEditing && <button type="button" className="cancel-btn" onClick={handleCancel} disabled={isSubmitting}>Cancel</button>}
      </div>
    </form>
  );
}

export default ExpenseForm;