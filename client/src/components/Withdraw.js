import React, { useState } from 'react';
import axios from 'axios';

function Withdraw() {
  const [accNum, setAccNum] = useState('');
  const [pin, setPin] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleWithdraw = async () => {
    try {
      const res = await axios.post('http://127.0.0.1:5000/withdraw', {
        acc_num: accNum,
        pin,
        amount: parseFloat(amount)
      });
      setMessage(res.data.message);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
      setMessage('');
    }
  };

  return (
    <div className="withdraw">
      <h2>🏧 Withdraw</h2>
      <input
        type="text"
        placeholder="Account Number"
        value={accNum}
        onChange={(e) => setAccNum(e.target.value)}
      />
      <input
        type="password"
        placeholder="PIN"
        value={pin}
        onChange={(e) => setPin(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleWithdraw}>Withdraw</button>

      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Withdraw;
