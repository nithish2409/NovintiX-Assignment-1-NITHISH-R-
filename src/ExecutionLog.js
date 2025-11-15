// src/ExecutionLog.js
import React from 'react';

const logStyles = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  width: '100%',
  height: '200px',
  background: '#2d2d2d',
  color: '#00ff00',
  fontFamily: 'monospace',
  padding: '10px',
  boxSizing: 'border-box',
  overflowY: 'auto',
  zIndex: 10,
  borderTop: '1px solid #444',
};

const ExecutionLog = ({ log }) => {
  return (
    <div style={logStyles}>
      <pre>
        {log.length > 0
          ? log.join('\n')
          : 'Click "Run Workflow" to see the output...'}
      </pre>
    </div>
  );
};

export default ExecutionLog;