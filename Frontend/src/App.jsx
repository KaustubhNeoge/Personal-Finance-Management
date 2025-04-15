import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.jsx';
import { BudgetProvider } from './contexts/BudgetContext.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Navbar from './components/Navbar.jsx';
import AddTransaction from './pages/AddTransaction.jsx';
import BudgetGoals from './pages/BudgetGoals.jsx';
import TransactionHistory from './pages/TransactionHistory';
import Profile from './pages/Profile.jsx';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <BudgetProvider>
        <Router>
          <div className="App">
            <Navbar />
            <div className="container">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/" 
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/add-transaction" 
                  element={
                    <PrivateRoute>
                      <AddTransaction />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/budget-goals" 
                  element={
                    <PrivateRoute>
                      <BudgetGoals />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/history" 
                  element={
                    <PrivateRoute>
                      <TransactionHistory />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  } 
                />
              </Routes>
            </div>
          </div>
        </Router>
      </BudgetProvider>
    </AuthProvider>
  );
}

export default App;