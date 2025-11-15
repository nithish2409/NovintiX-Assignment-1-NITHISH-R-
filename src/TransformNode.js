// src/TransformNode.js
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const TransformNode = ({ data }) => {
  return (
    <div style={{
      background: '#fff9e6',
      border: '1px solid #ffaf40',
      borderRadius: '5px',
      padding: '10px 15px',
      fontSize: '14px',
      width: '180px',
    }}>
      <Handle type="target" position={Position.Left} />
      <div>
        <strong>🔄 Transform to Uppercase</strong>
      </div>
      <div style={{ fontSize: '12px', color: '#555', marginTop: '5px' }}>
        <p>Takes incoming message and converts it to uppercase.</p>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(TransformNode);