import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { auth, googleProvider, signInWithPopup, GoogleAuthProvider } from './firebase';
import './App.css';
import HistoryPage from './HistoryPage';

function App() {
  const [user, setUser] = useState(null);
  const [rules, setRules] = useState([{ field: '', operator: '', value: '', condition: 'AND' }]);
  const [audienceSize, setAudienceSize] = useState(null);
  const [pendingCampaigns, setPendingCampaigns] = useState([]);
  const [message, setMessage] = useState('Hi {name}, here is 10% off on your next order');

  useEffect(() => {
    auth.onAuthStateChanged(setUser);
    fetchCampaigns();
  }, []);

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((result) => {
        const user = result.user;
        console.log(user);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const signOut = () => {
    auth.signOut();
  };

  const handleAddRule = () => {
    setRules([...rules, { field: '', operator: '', value: '', condition: 'AND' }]);
  };

  const handleChange = (index, e) => {
    const newRules = [...rules];
    newRules[index][e.target.name] = e.target.value;
    setRules(newRules);
  };

  const handleRemoveRule = (index) => {
    const newRules = [...rules];
    newRules.splice(index, 1);
    setRules(newRules);
  };

  const handleCheckSize = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/audiences/check_size', { rules });
      setAudienceSize(response.data.size);
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateAudience = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/audiences', { rules });
      alert(`Audience created with ID: ${response.data.id}`);
      fetchCampaigns();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendCampaign = async (campaignId) => {
    try {
      await axios.post('http://localhost:3000/api/campaigns/send', {
        audience_id: campaignId,
        message
      });
      fetchCampaigns();
      alert('Campaign sent');
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const pendingResponse = await axios.get('http://localhost:3000/api/campaigns/pending');
      setPendingCampaigns(pendingResponse.data);
      
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) {
    return (
      <div className="login-container">
        <div className="login-left">
          <div className="content">
            <h2>Welcome to CRM Application</h2>
            <p>Manage your customer relationships effortlessly with our state-of-the-art CRM system. Our platform helps you streamline your sales process, improve customer satisfaction, and drive business growth.</p>
          </div>
        </div>
        <div className="login-right">
          <div className="login-box">
            <h2>Login</h2>
            <button onClick={signInWithGoogle}>Sign In with Google</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div>
        <header>
          <h1>CRM Application</h1>
         
          <nav>
            <Link to="/">Home</Link>
            <Link to="/history">View Past Campaigns</Link>
            <button onClick={signOut}>Sign Out</button>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/" element={
              <>
                <section>
                  <h2>Create Audience</h2>
                  {rules.map((rule, index) => (
                    <div key={index} className="rule">
                      <select name="field" value={rule.field} onChange={e => handleChange(index, e)}>
                        <option value="">Select Field</option>
                        <option value="total_spends">Total Spends</option>
                        <option value="max_visits">Max Visits</option>
                        <option value="last_visited">Last Visited</option>
                      </select>
                      <select name="operator" value={rule.operator} onChange={e => handleChange(index, e)}>
                        <option value="">Select Operator</option>
                        <option value=">">&gt;</option>
                        <option value="<">&lt;</option>
                        <option value="=">=</option>
                        {rule.field === 'last_visited' && <option value="NOT_VISITED_LAST_3_MONTHS">Not visited in last 3 months</option>}
                      </select>
                      {rule.field !== 'last_visited' || rule.operator !== 'NOT_VISITED_LAST_3_MONTHS' ? (
                        <input
                          type="text"
                          name="value"
                          value={rule.value}
                          onChange={e => handleChange(index, e)}
                        />
                      ) : null}
                      <select name="condition" value={rule.condition} onChange={e => handleChange(index, e)}>
                        <option value="AND">AND</option>
                        <option value="OR">OR</option>
                      </select>
                      <button className="remove-button" onClick={() => handleRemoveRule(index)}>-</button>
                    </div>
                  ))}
                  <button onClick={handleAddRule}>Add Rule</button>
                  <button onClick={handleCheckSize}>Check Audience Size</button>
                  <button onClick={handleCreateAudience}>Create Audience</button>
                  {audienceSize !== null && <p>Audience Size: {audienceSize}</p>}
                </section>

                <section>
                  <h2>Pending Campaigns</h2>
                  {pendingCampaigns.length > 0 ? (
                    <ul>
                      {pendingCampaigns.map(campaign => (
                        <li key={campaign.id}>
                          Campaign ID: {campaign.id}, Created At: {campaign.created_at}
                          <button onClick={() => handleSendCampaign(campaign.id)}>Send Campaign</button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No pending campaigns found</p>
                  )}
                </section>
              </>
            } />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
