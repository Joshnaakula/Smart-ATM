import React, { useState } from 'react';
import axios from 'axios';

const DepositMoney = () => {
  const [accNum, setAccNum] = useState('');
  const [pin, setPin] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleDeposit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:5000/deposit', {
        acc_num: accNum,
        pin: pin,
        amount: parseFloat(amount)
      });
      setMessage(res.data.message);
      setError('');
      setAccNum('');
      setPin('');
      setAmount('');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
      setMessage('');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Deposit Money</h2>
      <form onSubmit={handleDeposit} style={styles.form}>
        <input
          type="text"
          placeholder="Account Number"
          value={accNum}
          onChange={(e) => setAccNum(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Deposit</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '400px',
    margin: 'auto',
    textAlign: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: '10px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  }
};

export default DepositMoney;
