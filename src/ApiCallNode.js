import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const ApiCallNode = ({ data }) => {
  const url = data.url || 'No URL configured';
  return (
    <div style={{
      background: '#e8f5e9',
      border: '1px solid #4caf50',
      borderRadius: '5px',
      padding: '10px 15px',
      width: '220px',
      fontSize: '14px',
    }}>
      <Handle type="target" position={Position.Left} />
      <div>
        <strong>🌐 API Call (GET)</strong>
      </div>
      <div style={{
        fontSize: '12px',
        color: '#555',
        marginTop: '5px',
        wordBreak: 'break-all', // Ensure long URLs don't overflow
      }}>
        <p>URL: {url}</p>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(ApiCallNode);