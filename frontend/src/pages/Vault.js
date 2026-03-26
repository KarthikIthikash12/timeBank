import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './Vault.css';
import toast from 'react-hot-toast';

export default function Vault() {
  const { user, logout, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/users/ledger', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        
        if (res.data && res.data.balance !== undefined) {
          setUser(prev => ({ ...prev, timeBalance: res.data.balance }));
        }
        if (res.data && Array.isArray(res.data.history)) {
          setTransactions(res.data.history);
        } else {
          setTransactions([]);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch ledger", error);
        setLoading(false);
      }
    };
    fetchLedger();
  }, [setUser]); 

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeposit = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/users/deposit', {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUser({ ...user, timeBalance: res.data.newBalance });
      toast.success('Success! 120 Mins minted to your vault.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Deposit failed.');
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="vault-container">
      <aside className="left-sidebar">
        <div className="brand-logo">TimeBank</div>
        <div className="nav-menu">
          <div className="nav-item" onClick={() => navigate('/')}>Dashboard</div>
          <div className="nav-item" onClick={() => navigate('/marketplace')}>Marketplace</div>
          <div className="nav-item active">My Vault</div>
          <div className="nav-item" onClick={() => navigate('/history')}>History</div>
        </div>
        <div className="nav-menu" style={{ flexGrow: 0 }}>
          <div className="nav-item" onClick={() => navigate('/profile')}>Edit Profile</div>
          <div className="nav-item" onClick={handleLogout}>Log Out</div>
        </div>
      </aside>

      <main className="vault-content">
        <div className="vault-header">
          <h1>My Vault</h1>
          <p style={{ color: '#64748b' }}>Manage your temporal assets and transaction history.</p>
        </div>

        <div className="balance-card">
          <div className="balance-info">
            <h3>Available Balance</h3>
            <p className="balance-amount">
              {user?.timeBalance !== undefined ? user.timeBalance : 120} <span>MINS</span>
            </p>
          </div>
          {/* <button className="deposit-action-btn" onClick={handleDeposit}>
            + Deposit 120 Mins
          </button> */}
        </div>

        <div className="ledger-section">
          <h2>Transaction Ledger</h2>
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Amount</th>
                <th>Counterparty</th>
                <th>Skill / Reason</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Decrypting vault history...</td></tr>
              ) : transactions.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No transactions yet. Time to hit the marketplace!</td></tr>
              ) : (
                transactions.map(tx => (
                  <tr key={tx._id}>
                    <td>
                      <span className={`type-badge ${tx.type === 'earned' ? 'type-earned' : 'type-spent'}`}>
                        {tx.type === 'earned' ? '+ EARNED' : '- SPENT'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 'bold' }}>{tx.amount} MINS</td>
                    <td>{tx.counterparty || 'Unknown Node'}</td>
                    <td style={{ color: '#64748b' }}>{tx.skill}</td>
                    <td style={{ color: '#64748b', fontSize: '0.9rem' }}>{formatDate(tx.date)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}