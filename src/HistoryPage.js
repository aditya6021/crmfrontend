import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const HistoryPage = () => {
  const [pastCampaigns, setPastCampaigns] = useState([]);

  useEffect(() => {
    fetchPastCampaigns();
  }, []);

  const fetchPastCampaigns = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/campaigns/past');
      setPastCampaigns(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="history-container">
      <h2>Past Campaigns</h2>
      {pastCampaigns.length > 0 ? (
        <table className="history-table">
          <thead>
            <tr>
              <th>Campaign ID</th>
              <th>Created At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {pastCampaigns.map(campaign => (
              <tr key={campaign.id}>
                <td>{campaign.id}</td>
                <td>{campaign.created_at}</td>
                <td>{campaign.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No past campaigns found</p>
      )}
    </div>
  );
};

export default HistoryPage;
