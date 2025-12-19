import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast'; // Import toast
import Navbar from './components/Navbar';
import ExpenseTracker from './components/ExpenseTracker';
import MonthlySummary from './components/MonthlySummary';
import History from './components/History';
import Reports from './components/Reports';
import SignupPage from './components/SignupPage';
import LoginPage from './components/LoginPage';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api'; // Base URL for API

// --- Helper function to make authenticated API requests ---
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('authToken');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers, // Merge existing headers
  };
  // Add the Authorization header if a token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  // Handle unauthorized errors (e.g., expired token)
  if (response.status === 401) {
    localStorage.removeItem('authToken'); // Clear invalid token
    // Use toast for error message
    toast.error('Session expired. Please log in again.');
    // Redirect to login (cannot use useNavigate directly here, handle in component or context)
    window.location.href = '/login'; // Simple redirect for now
    throw new Error('Unauthorized'); // Stop further processing
  }
  return response;
};


// --- Dashboard Component ---
function Dashboard({ expenses, totalExpenses, onAddExpense, onDeleteExpense, onEditExpense, onUpdateExpense, editingExpense, setEditingExpense }) {
 // ... (Dashboard code remains the same)
  return (
    <div className="dashboard-layout">
      <ExpenseTracker
        expenses={expenses}
        totalExpenses={totalExpenses}
        onAddExpense={onAddExpense}
        onDeleteExpense={onDeleteExpense}
        onEditExpense={onEditExpense}
        onUpdateExpense={onUpdateExpense}
        editingExpense={editingExpense}
        setEditingExpense={setEditingExpense}
      />
      <MonthlySummary expenses={expenses} />
    </div>
  );
}

// --- Main App Component ---
function App() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const getExpenses = async () => {
      if (!isLoggedIn) {
          setIsLoading(false);
          setExpenses([]); // Clear expenses if logged out
          return;
      }
      setIsLoading(true); // Set loading true before fetch
      try {
        const response = await fetchWithAuth(`${API_BASE_URL}/expenses`); // Use helper
        if (!response.ok && response.status !== 401) throw new Error('Failed to fetch'); // Check for non-auth errors
        const data = await response.json();
        setExpenses(data);
      } catch (error) {
         if (error.message !== 'Unauthorized') { // Don't log auth errors twice
            console.error("Failed to fetch expenses:", error);
         }
      } finally {
        setIsLoading(false);
      }
    };
    getExpenses();
  }, [isLoggedIn]); // Re-run when login status changes

  // --- Updated Handlers using fetchWithAuth ---
  const handleAddExpense = async (newExpense) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/expenses`, { // Use helper
        method: 'POST',
        body: JSON.stringify(newExpense),
      });
      if (!response.ok) throw new Error('Failed to add expense');
      const data = await response.json();
      setExpenses([...expenses, data]);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/expenses/${id}`, { method: 'DELETE' }); // Use helper
      if (!response.ok) throw new Error('Failed to delete expense');
      setExpenses(expenses.filter((expense) => expense._id !== id));
      toast.success('Expense deleted!'); // Add success toast
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete expense.'); // Add error toast
    }
  };

  const handleEditExpense = (id) => {
    const expenseToEdit = expenses.find((expense) => expense._id === id);
    setEditingExpense(expenseToEdit);
  };

  const handleUpdateExpense = async (updatedExpense) => {
     try {
       const response = await fetchWithAuth(`${API_BASE_URL}/expenses/${updatedExpense._id}`, { // Use helper
        method: 'PUT',
        body: JSON.stringify(updatedExpense),
      });
       if (!response.ok) throw new Error('Failed to update expense');
       const data = await response.json();
       setExpenses(
         expenses.map((expense) => (expense._id === data._id ? data : expense))
       );
       setEditingExpense(null);
     } catch (error) {
        console.error(error);
        throw error;
     }
  };

  const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);

  if (isLoading && isLoggedIn) { // Only show full loading if logged in and loading
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Dashboard
                expenses={expenses} totalExpenses={totalExpenses} onAddExpense={handleAddExpense} onDeleteExpense={handleDeleteExpense} onEditExpense={handleEditExpense} onUpdateExpense={handleUpdateExpense} editingExpense={editingExpense} setEditingExpense={setEditingExpense}
              />
            </ProtectedRoute>
          }
        />
        <Route path="/history" element={ <ProtectedRoute isLoggedIn={isLoggedIn}><History expenses={expenses} /></ProtectedRoute> } />
        <Route path="/reports" element={ <ProtectedRoute isLoggedIn={isLoggedIn}><Reports expenses={expenses} /></ProtectedRoute> } />

        {/* Public Routes */}
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>
    </>
  );
}

export default App;