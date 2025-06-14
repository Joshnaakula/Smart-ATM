import React, { useState } from 'react';
import axios from 'axios';

function ViewFD() {
  const [accNum, setAccNum] = useState('');
  const [fds, setFDs] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchFDs = async () => {
    const trimmedAcc = accNum.trim();
    if (!trimmedAcc) {
      setError('⚠️ Please enter a valid account number.');
      setFDs([]);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:5000/fds?acc_num=${trimmedAcc}`);
      setFDs(res.data);
      setError('');
    } catch (err) {
      setFDs([]);
      setError(err.response?.data?.error || '❌ Failed to fetch FDs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-fds" style={{ padding: '1rem', maxWidth: '600px', margin: 'auto' }}>
      <h2>📄 View Fixed Deposits</h2>
      <input
        type="text"
        placeholder="Enter Account Number"
        value={accNum}
        onChange={(e) => setAccNum(e.target.value)}
        style={{ padding: '0.5rem', width: '100%', marginBottom: '0.5rem' }}
      />
      <button onClick={fetchFDs} style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}>
        View FDs
      </button>

      {loading && <p>⏳ Loading FDs...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {fds.length > 0 && (
        <div>
          <h3>💼 FD List:</h3>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            {fds.map((fd, index) => (
              <li key={index} style={{ marginBottom: '0.5rem', padding: '0.5rem', background: '#f3f3f3', borderRadius: '8px' }}>
                💰 ₹{fd.principal} | ⏳ {fd.duration_months} months <br />
                📅 Maturity Date: {fd.maturity_date} <br />
                📦 Status: <strong>{fd.status}</strong> <br />
                🏦 Maturity Amount: {fd.maturity_amount ? `₹${fd.maturity_amount}` : 'Pending'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ViewFD;
