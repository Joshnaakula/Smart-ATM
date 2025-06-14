// src/components/OpenFD.js

import React, { useState } from 'react';
import axios from 'axios';

function OpenFD() {
  const [accNum, setAccNum] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleOpenFD = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:5000/open_fd', {
        acc_num: accNum,
        amount: parseFloat(amount),
        duration: parseInt(duration)
      });

      setResult(res.data);
      setError('');
    } catch (err) {
      setResult(null);
      setError(err.response?.data?.error || '❌ Failed to open FD');
    }
  };

  return (
    <div className="open-fd">
      <h2>🏦 Open Fixed Deposit</h2>
      <input
        type="text"
        placeholder="Account Number"
        value={accNum}
        onChange={(e) => setAccNum(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <input
        type="number"
        placeholder="Duration (months)"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
      />
      <button onClick={handleOpenFD}>Open FD</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {result && (
        <div style={{ marginTop: '1em', color: 'green' }}>
          <p>✅ FD opened successfully!</p>
          <p>💰 Maturity Amount: ₹{result.maturity_amount}</p>
          <p>📅 Maturity Date: {result.maturity_date}</p>
        </div>
      )}
    </div>
  );
}

export default OpenFD;
