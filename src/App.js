// src/App.js
import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import 'reactflow/dist/style.css';

import Sidebar from './Sidebar';
import SettingsPanel from './SettingsPanel';
import SendMessageNode from './SendMessageNode';
import TransformNode from './TransformNode';
import ConditionalNode from './ConditionalNode';
import ApiCallNode from './ApiCallNode';
import ExecutionLog from './ExecutionLog';
import './App.css';

// --- Initial Setup and Component Definition (No changes in this top section) ---
const initialNodes = [{ id: '1', type: 'input', position: { x: 250, y: 5 }, data: { label: 'Start Trigger' } }];
const initialEdges = [];
const nodeTypes = { sendMessage: SendMessageNode, transform: TransformNode, conditional: ConditionalNode, apiCall: ApiCallNode };
const flowKey = 'workflow-builder-flow';
let id = initialNodes.length;
const getId = () => `dndnode_${id++}`;

function WorkflowBuilder() {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const [executionLog, setExecutionLog] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedElements, setSelectedElements] = useState([]);

  // --- All Handlers (handleNodeDataChange, onNodesChange, etc.) are unchanged ---
  const handleNodeDataChange = useCallback((nodeId, propertyName, value) => { setNodes((nds) => nds.map((node) => { if (node.id === nodeId) { const newData = { ...node.data, [propertyName]: value }; let newClassName = node.className || ''; if (propertyName === 'label') newClassName = !value?.trim() ? 'invalid' : ''; return { ...node, data: newData, className: newClassName }; } return node; })); }, [setNodes]);
  const onNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), [setNodes]);
  const onEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), [setEdges]);
  const onConnect = useCallback((connection) => setEdges((eds) => addEdge(connection, eds)), [setEdges]);
  const onSelectionChange = useCallback((elements) => { setSelectedElements(elements.nodes.concat(elements.edges)); }, []);
  const onDelete = useCallback(() => { const elementsToRemove = selectedElements.filter(el => el.id !== '1'); if (elementsToRemove.length === 0) return; const nodeIdsToRemove = new Set(elementsToRemove.filter(el => !el.source).map(el => el.id)); const edgeIdsToRemove = new Set(elementsToRemove.filter(el => el.source).map(el => el.id)); setNodes((nds) => nds.filter(node => !nodeIdsToRemove.has(node.id))); setEdges((eds) => eds.filter(edge => !edgeIdsToRemove.has(edge.id))); }, [selectedElements, setNodes, setEdges]);
  const onDragOver = useCallback((event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; }, []);
  const onNodeClick = useCallback((event, node) => setSelectedNodeId(node.id), []);
  const onPaneClick = useCallback(() => setSelectedNodeId(null), []);
  const onSave = useCallback(() => { if (reactFlowInstance) { localStorage.setItem(flowKey, JSON.stringify(reactFlowInstance.toObject())); alert('Workflow saved!'); } }, [reactFlowInstance]);
  const onRestore = useCallback(() => { const flow = JSON.parse(localStorage.getItem(flowKey)); if (flow) { setNodes(flow.nodes || []); setEdges(flow.edges || []); setSelectedNodeId(null); } else { alert('No saved workflow found.'); } }, [setNodes, setEdges]);
  const onDrop = useCallback((event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData('application/reactflow');
    if (!type) return;
    const position = reactFlowInstance.screenToFlowPosition({ x: event.clientX, y: event.clientY });
    const newNode = { id: getId(), type, position, data: {} };
    if (type === 'sendMessage') newNode.data = { message: 'Your message here...' };
    else if (type === 'apiCall') newNode.data = { url: 'https://jsonplaceholder.typicode.com/todos/1' };
    else if (type === 'conditional') newNode.data = { key: 'apiResponse.userId', comparison: 'equals', value: '1' };
    else if (type === 'transform') newNode.data = {};
    else { newNode.data = { label: `${type} node` }; newNode.className = ''; }
    setNodes((nds) => nds.concat(newNode));
  }, [reactFlowInstance]);
  const isValidConnection = useCallback((connection) => !edges.some(edge => edge.source === connection.source && edge.sourceHandle === connection.sourceHandle), [edges]);
  
  // --- REWRITTEN AND CORRECTED EXECUTION ENGINE ---
  const onExecute = useCallback(async () => {
    setExecutionLog(['--- Starting Workflow Execution ---']);
    const startNode = nodes.find((node) => node.type === 'input');
    if (!startNode) {
      setExecutionLog((log) => [...log, 'ERROR: No input node found.']);
      return;
    }

    const nodeMap = new Map(nodes.map(node => [node.id, node]));

    // This is now a recursive function that returns the final payload.
    const executeNode = async (nodeId, payload) => {
      const currentNode = nodeMap.get(nodeId);
      if (!currentNode) return payload;

      let newPayload = { ...payload }; // Start with a copy of the input payload

      try {
        setExecutionLog((log) => [...log, `[Node ${currentNode.id}] Executing... Input: ${JSON.stringify(newPayload)}`]);

        // Each node type now returns a completely new payload object
        if (currentNode.type === 'apiCall') {
          const url = currentNode.data.url;
          if (url) { const response = await fetch(url); if (!response.ok) throw new Error(`API call failed: ${response.status}`); const data = await response.json(); newPayload = { apiResponse: data }; }
          else { throw new Error('URL is not defined in API Call node'); }
        }
        else if (currentNode.type === 'conditional') {
          const { key, comparison, value } = currentNode.data;
          const getNestedValue = (obj, path) => path.split('.').reduce((acc, part) => acc && acc[part], obj);
          const payloadValue = getNestedValue(newPayload, key || '');
          let conditionMet = false;
          switch (comparison) {
            case 'contains': conditionMet = String(payloadValue).toLowerCase().includes(String(value).toLowerCase()); break;
            case 'greaterThan': conditionMet = Number(payloadValue) > Number(value); break;
            default: conditionMet = payloadValue == value;
          }
          setExecutionLog((log) => [...log, `[Node ${currentNode.id}] Condition: (${key || ''} ${comparison} ${value || ''}) -> ${conditionMet}`]);
          
          const nextEdge = edges.find(edge => edge.source === nodeId && edge.sourceHandle === String(conditionMet));
          if (nextEdge) {
            await executeNode(nextEdge.target, newPayload); // Pass the current payload down the selected branch
          }
          return; // Stop this execution path since it has branched
        }
        else if (currentNode.type === 'transform') {
          const inputMessage = newPayload.apiResponse?.title || newPayload.message || '';
          newPayload = { message: inputMessage.toUpperCase() }; // Output a simple object
        }
        else if (currentNode.type === 'sendMessage') {
          const finalMsg = newPayload.message || JSON.stringify(newPayload.apiResponse);
          newPayload = { finalMessage: `SENT: ${finalMsg}` }; // Output a simple object
        }

        setExecutionLog((log) => [...log, `[Node ${currentNode.id}] ✅ Success! Output: ${JSON.stringify(newPayload)}`]);
      } catch (error) {
        setExecutionLog((log) => [...log, `[Node ${currentNode.id}] ❌ Error: ${error.message}`]);
        return; // Stop execution on error
      }

      // Find the next linear node
      const nextEdge = edges.find(edge => edge.source === nodeId);
      if (nextEdge) {
        await executeNode(nextEdge.target, newPayload); // Pass the new, clean payload to the next node
      } else {
        setExecutionLog((log) => [...log, '--- Workflow Execution Finished ---']);
      }
    };

    // Start the execution with an initial payload
    await executeNode(startNode.id, { message: "hello world" });
  }, [nodes, edges]);

  const selectedNode = nodes.find(node => node.id === selectedNodeId);

  return (
    <div className="workflow-builder" ref={reactFlowWrapper}>
      <Sidebar />
      <div className="react-flow-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          onSelectionChange={onSelectionChange}
          onDelete={onDelete}
          isValidConnection={isValidConnection}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
          <div style={{ position: 'absolute', right: 10, top: 10, zIndex: 4, display: 'flex', gap: '5px' }}>
            <button onClick={onExecute}>Run Workflow</button>
            <button onClick={onSave}>Save</button>
            <button onClick={onRestore}>Restore</button>
          </div>
        </ReactFlow>
      </div>
      <SettingsPanel
        selectedNode={selectedNode}
        onDataChange={handleNodeDataChange}
      />
      <ExecutionLog log={executionLog} />
    </div>
  );
}

export default WorkflowBuilder;