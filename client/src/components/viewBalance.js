import React, { useState } from 'react';
import axios from 'axios';

const ViewBalance = () => {
  const [accNum, setAccNum] = useState('');
  const [pin, setPin] = useState('');
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState('');

  const handleCheckBalance = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get('http://127.0.0.1:5000/balance', {
        params: {
          acc_num: accNum,
          pin: pin
        }
      });
      setBalance(res.data.balance);
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
      setBalance(null);
    }
  };

  return (
    <div style={styles.container}>
      <h2>View Balance</h2>
      <form onSubmit={handleCheckBalance} style={styles.form}>
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
        <button type="submit">Check Balance</button>
      </form>
      {balance !== null && <p>💰 Balance: ₹{balance}</p>}
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

export default ViewBalance;
