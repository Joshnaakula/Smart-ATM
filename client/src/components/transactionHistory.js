import React, { useState } from 'react';
import axios from 'axios';

function TransactionHistory() {
  const [accNum, setAccNum] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/transactions?acc_num=${accNum}`);
      setTransactions(res.data.transactions || []);
      setError('');
    } catch (err) {
      setError('❌ Error fetching transaction history.');
      setTransactions([]);
    }
  };

  return (
    <div className="transaction-history">
      <h2>📜 Transaction History</h2>
      <input
        type="text"
        placeholder="Enter Account Number"
        value={accNum}
        onChange={(e) => setAccNum(e.target.value)}
      />
      <button onClick={fetchTransactions}>Get History</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
{Array.isArray(transactions) ? (
  <ul>
    {transactions.map((txn, index) => (
      <li key={index}>
        - {txn.message} ({txn.timestamp})
      </li>
    ))}
  </ul>
) : (
  <p>No transaction history found.</p>
)}


    </div>
  );
}

export default TransactionHistory;
