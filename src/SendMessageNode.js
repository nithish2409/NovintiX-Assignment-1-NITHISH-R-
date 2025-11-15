// src/SendMessageNode.js
import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

// Using memo for performance optimization. It prevents the component from
// re-rendering if its props (data) have not changed.
const SendMessageNode = ({ data }) => {
  return (
    <div style={{
      background: '#dff9fb',
      border: '1px solid #1abc9c',
      borderRadius: '5px',
      padding: '10px 15px',
      fontSize: '14px',
      width: '180px'
    }}>
      {/* Target handle on the left for incoming connections */}
      <Handle type="target" position={Position.Left} />

      <div>
        <strong>✉️ Send Message</strong>
      </div>

      {/* Display the message from the node's data, or a placeholder */}
      <div style={{
        fontSize: '12px',
        color: '#555',
        marginTop: '5px',
        whiteSpace: 'pre-wrap', // Allows text to wrap
        wordBreak: 'break-word', // Breaks long words
      }}>
        <p>{data.message || 'No message configured.'}</p>
      </div>

      {/* Source handle on the right for outgoing connections */}
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default memo(SendMessageNode);