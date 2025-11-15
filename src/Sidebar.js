import React from 'react';

const Sidebar = () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="sidebar">
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
        Input Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
        Default Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'output')} draggable>
        Output Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'sendMessage')} draggable style={{ borderColor: '#1abc9c' }}>
        ✉️ Send Message Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'transform')} draggable style={{ borderColor: '#ffaf40' }}>
        🔄 Transform Text Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'conditional')} draggable style={{ borderColor: '#777' }}>
        💎 Conditional Branch
      </div>
      {/* --- ADDED THIS BLOCK --- */}
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'apiCall')} draggable style={{ borderColor: '#4caf50' }}>
        🌐 API Call Node
      </div>
      {/* -------------------- */}
    </aside>
  );
};

export default Sidebar;
