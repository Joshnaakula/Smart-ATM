import React, { useState } from 'react';
import axios from 'axios';

function Transfer() {
  const [fromAcc, setFromAcc] = useState('');
  const [toAcc, setToAcc] = useState('');
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleTransfer = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:5000/transfer', {
        from_acc: fromAcc,
        to_acc: toAcc,
        amount: parseFloat(amount)
      });
      setSuccess(res.data.message);
      setError('');
      setFromAcc('');
      setToAcc('');
      setAmount('');
    } catch (err) {
      setError(err.response?.data?.error || '❌ Transfer failed.');
      setSuccess('');
    }
  };

  return (
    <div className="transfer container">
      <h2>💸 Transfer Funds</h2>

      <input
        type="text"
        placeholder="From Account Number"
        value={fromAcc}
        onChange={(e) => setFromAcc(e.target.value)}
      />
      <input
        type="text"
        placeholder="To Account Number"
        value={toAcc}
        onChange={(e) => setToAcc(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleTransfer}>Transfer</button>

      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Transfer;
