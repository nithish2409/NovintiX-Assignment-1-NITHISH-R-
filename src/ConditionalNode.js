// src/ConditionalNode.js
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

const ConditionalNode = ({ data }) => {
  const nodeStyle = {
    border: '1px solid #777',
    borderRadius: '5px',
    padding: '10px 15px',
    background: '#f0f0f0',
    width: '200px',
    fontSize: '14px',
  };

  const handleLabelStyle = {
    position: 'absolute',
    right: -55,
    fontSize: '12px',
    color: '#555',
  };

  return (
    <div style={nodeStyle}>
      {/* Input Handle */}
      <Handle type="target" position={Position.Left} />

      <div>
        <strong>💎 Conditional Branch</strong>
        <p style={{ fontSize: '12px', color: '#555', marginTop: '5px' }}>
          Checks if message contains "hello".
        </p>
      </div>

      {/* Output Handles */}
      <div style={{...handleLabelStyle, top: '45%'}}>True</div>
      <Handle
        type="source"
        id="true" // Unique ID for this handle
        position={Position.Right}
        style={{ top: '50%' }}
      />

      <div style={{...handleLabelStyle, top: '75%', color: '#c0392b'}}>False</div>
      <Handle
        type="source"
        id="false" // Unique ID for this handle
        position={Position.Right}
        style={{ top: '80%', background: '#c0392b' }}
      />
    </div>
  );
};

export default memo(ConditionalNode);