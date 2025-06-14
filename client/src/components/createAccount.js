import React, { useState } from 'react';
import axios from 'axios';

const CreateAccount = () => {
  const [formData, setFormData] = useState({
    name: '',
    acc_num: '',
    pin: '',
    balance: ''
  });

  const [responseMsg, setResponseMsg] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://127.0.0.1:5000/create_account', formData);
      setResponseMsg(res.data.message);
    } catch (err) {
      setResponseMsg(err.response?.data?.error || 'Something went wrong');
    }
  };

  return (
    <div style={styles.container}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input type="text" name="acc_num" placeholder="Account Number" value={formData.acc_num} onChange={handleChange} required />
        <input type="password" name="pin" placeholder="4-digit PIN" value={formData.pin} onChange={handleChange} required />
        <input type="number" name="balance" placeholder="Initial Balance" value={formData.balance} onChange={handleChange} required />
        <button type="submit">Create</button>
      </form>
      {responseMsg && <p>{responseMsg}</p>}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '400px',
    margin: 'auto',
    textAlign: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: '10px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  }
};

export default CreateAccount;
