// src/SettingsPanel.js
import React from 'react';

const SettingsPanel = ({ selectedNode, onDataChange }) => {
  const renderSettings = () => {
    if (!selectedNode) {
      return <p>Select a node to configure its properties.</p>;
    }

    const handleChange = (event) => {
      const { name, value } = event.target;
      onDataChange(selectedNode.id, name, value);
    };

    switch (selectedNode.type) {
      case 'sendMessage':
        return (
          <div>
            <label htmlFor="message">Message:</label>
            <textarea id="message" name="message" rows="5" value={selectedNode.data.message || ''} onChange={handleChange} style={{ width: '100%' }} />
          </div>
        );
      
      case 'conditional':
        return (
          <div>
            <p style={{fontSize: '13px', color: '#555'}}>Check a value from the payload.</p>
            <label htmlFor="key">Property Key:</label>
            <input
              id="key"
              type="text"
              name="key"
              value={selectedNode.data.key || ''}
              onChange={handleChange}
              placeholder="apiResponse.userId"
            />
            
            <label htmlFor="comparison" style={{marginTop: '10px'}}>Comparison:</label>
            <select
              id="comparison"
              name="comparison"
              value={selectedNode.data.comparison || 'equals'}
              onChange={handleChange}
              style={{width: '100%', padding: '8px', marginTop: '5px'}}
            >
              <option value="equals">Equals</option>
              <option value="contains">Contains</option>
              <option value="greaterThan">Greater Than</option>
            </select>

            <label htmlFor="value" style={{marginTop: '10px'}}>Value:</label>
            <input
              id="value"
              type="text"
              name="value"
              value={selectedNode.data.value || ''}
              onChange={handleChange}
              placeholder="1"
            />
          </div>
        );
      
      case 'apiCall':
        return (
          <div>
            <label htmlFor="url">API Endpoint URL:</label>
            <input
              id="url"
              type="text"
              name="url"
              value={selectedNode.data.url || ''}
              onChange={handleChange}
              placeholder="https://api.example.com/data"
            />
          </div>
        );

      default:
        return (
          <div>
            <label htmlFor="label">Label:</label>
            <input id="label" type="text" name="label" value={selectedNode.data.label || ''} onChange={handleChange} />
          </div>
        );
    }
  };

  return (
    <aside className="settings-panel">
      <h3>Settings Panel</h3>
      {renderSettings()}
    </aside>
  );
};

export default SettingsPanel;