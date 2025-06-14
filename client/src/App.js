import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateAccount from './components/createAccount';
import Deposit from './components/Deposit';
import Withdraw from './components/Withdraw';
import TransactionHistory from './components/transactionHistory';
import Transfer from './components/Transfer';
import OpenFD from './components/OpenFD';
import ViewFD from './components/ViewFD';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 font-sans">
        <nav className="bg-blue-600 text-white p-4 shadow-md">
          <ul className="flex space-x-4 justify-center">
            <li><Link to="/" className="hover:underline">🏦 Create</Link></li>
            <li><Link to="/deposit" className="hover:underline">💰 Deposit</Link></li>
            <li><Link to="/withdraw" className="hover:underline">💸 Withdraw</Link></li>
            <li><Link to="/transfer" className="hover:underline">🔁 Transfer</Link></li>
            <li><Link to="/transactions" className="hover:underline">📜 History</Link></li>
            <li><Link to="/fd" className="hover:underline">📈 Open FD</Link></li>
            <li><Link to="/fds" className="hover:underline">📋 View FDs</Link></li>
          </ul>
        </nav>

        <div className="max-w-xl mx-auto p-6 mt-6 bg-white rounded shadow">
          <Routes>
            <Route path="/" element={<CreateAccount />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/transfer" element={<Transfer />} />
            <Route path="/transactions" element={<TransactionHistory />} />
            <Route path="/fd" element={<OpenFD />} />
            <Route path="/fds" element={<ViewFD />} />
      
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
