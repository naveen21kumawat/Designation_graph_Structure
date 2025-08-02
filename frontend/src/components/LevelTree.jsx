// LevelTree.jsx or .tsx

import React, { useState } from "react";
import Xarrow from "react-xarrows";

// Node Component
const NodeBox = ({ node, onDragStart, onClick }) => (
  <div
    id={node.id}
    draggable
    onDragStart={(e) => onDragStart(e, node.id)}
    onClick={() => onClick(node)}
    className="min-w-[120px] max-w-[150px] bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl text-black flex flex-col items-center justify-center p-3 m-2 shadow-xl hover:scale-105 transition-transform duration-300 cursor-pointer"
  >
    <img
      src={node.image}
      alt={node.name}
      className="w-14 h-14 rounded-full border-4 border-white mb-2 shadow-md"
    />
    <div className="font-bold text-sm">{node.name}</div>
    <div className="text-xs italic text-gray-600">{node.role}</div>
  </div>
);

const LevelBox = ({ level, nodes, onDrop, onDragOver, onDragStart, onNodeClick, isDragging }) => {
  if (!nodes.length && !isDragging) return null;

  return (
    <div
      id={`level-${level}`}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, level)}
      className="w-full border border-gray-300 rounded-xl p-6 m-4 bg-gray-50 shadow-inner min-h-[160px]"
    >
      <h2 className="text-xl font-semibold text-center text-gray-700 mb-4">Level {level}</h2>
      <div className="flex flex-wrap justify-center">
        {nodes.map((node) => (
          <NodeBox
            key={node.id}
            node={node}
            onDragStart={onDragStart}
            onClick={onNodeClick}
          />
        ))}
      </div>
    </div>
  );
};

const LevelTree = () => {
  const [nodes, setNodes] = useState([
    { id: "A1", name: "Alice", role: "CEO", image: "https://i.pinimg.com/736x/2d/95/e5/2d95e5886fc4c65a6778b5fee94a7d59.jpg", level: 1 },
    { id: "A2", name: "Bob", role: "CTO", image: "https://via.placeholder.com/50", level: 1 },
    { id: "B1", name: "Charlie", role: "Manager", image: "https://via.placeholder.com/50", level: 2 },
    { id: "B2", name: "Dana", role: "Designer", image: "https://via.placeholder.com/50", level: 2 },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", role: "", image: "", level: 1 });
  const [selectedNode, setSelectedNode] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "level" ? parseInt(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = `${formData.name.slice(0, 1).toUpperCase()}${Math.floor(Math.random() * 1000)}`;
    const newNode = { ...formData, id };
    setNodes((prev) => [...prev, newNode]);
    setFormData({ name: "", role: "", image: "", level: 1 });
    setShowForm(false);
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node);
    setShowUpdateForm(false);
    setConfirmDelete(false);
  };

  const handleUpdate = () => {
    setShowUpdateForm(true);
    setFormData(selectedNode);
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    setNodes((prevNodes) =>
      prevNodes.map((node) => (node.id === formData.id ? formData : node))
    );
    setShowUpdateForm(false);
    setSelectedNode(null);
  };

  const handleDelete = () => {
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== selectedNode.id));
    setSelectedNode(null);
    setConfirmDelete(false);
  };

  const handleDragStart = (e, id) => {
    e.dataTransfer.setData("nodeId", id);
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, newLevel) => {
    e.preventDefault();
    const nodeId = e.dataTransfer.getData("nodeId");
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.id === nodeId ? { ...node, level: newLevel } : node
      )
    );
    setIsDragging(false);
  };

  const levels = [1, 2, 3];

  return (
    <div className="p-6 bg-gradient-to-tr from-white via-blue-50 to-purple-100 min-h-screen relative overflow-x-hidden">
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={() => setShowForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white px-6 py-2 rounded-full shadow-lg"
        >
          ➕ Add Node
        </button>
      </div>

      <h1 className="text-4xl font-extrabold text-center mb-12 text-gray-800">8Bit Organization</h1>

      {showForm && (
        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
          <div className="relative bg-white border border-gray-300 rounded-xl shadow-2xl p-6 backdrop-blur-sm animate-fade-in">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
              onClick={() => setShowForm(false)}
            >×</button>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Add New Node</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="name" placeholder="Name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
              <input name="role" placeholder="Role" required value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
              <input name="image" placeholder="Image URL" required value={formData.image} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
              <select name="level" value={formData.level} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                {levels.map((lvl) => <option key={lvl} value={lvl}>Level {lvl}</option>)}
              </select>
              <button type="submit" className="bg-green-500 text-white w-full py-2 rounded">✅ Add Node</button>
            </form>
          </div>
        </div>
      )}

      {selectedNode && !showUpdateForm && !confirmDelete && (
        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
          <div className="relative bg-white border rounded-xl shadow-xl p-6">
            <button
              className="absolute top-2 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
              onClick={() => setSelectedNode(null)}
            >×</button>
            <h2 className="text-xl font-bold mb-4 text-center">{selectedNode.name}'s Details</h2>
            <img src={selectedNode.image} alt={selectedNode.name} className="w-20 h-20 mx-auto rounded-full mb-4" />
            <div className="text-center">
              <p className="font-semibold">{selectedNode.name}</p>
              <p className="italic text-gray-600">{selectedNode.role}</p>
              <p className="text-sm mt-2">Level: {selectedNode.level}</p>
              <div className="mt-4 flex justify-center gap-4">
                <button className="bg-yellow-400 text-white px-4 py-1 rounded" onClick={handleUpdate}>✏️ Update</button>
                <button className="bg-red-500 text-white px-4 py-1 rounded" onClick={() => setConfirmDelete(true)}>🗑️ Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && selectedNode && (
        <div className="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full relative">
            <button
              onClick={() => setConfirmDelete(false)}
              className="absolute top-2 right-3 text-xl text-gray-500 hover:text-red-500"
            >×</button>
            <h2 className="text-xl font-bold mb-4 text-center text-gray-700">Are you sure?</h2>
            <p className="text-center text-gray-600 mb-6">
              Do you really want to delete <strong>{selectedNode.name}</strong>?
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                onClick={handleDelete}
              >Yes, Delete</button>
              <button
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setConfirmDelete(false)}
              >Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showUpdateForm && (
        <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
          <div className="relative bg-white border border-gray-300 rounded-xl shadow-2xl p-6 backdrop-blur-sm animate-fade-in">
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-red-500 text-xl font-bold"
              onClick={() => setShowUpdateForm(false)}
            >×</button>
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-700">Update Node</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <input name="name" placeholder="Name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
              <input name="role" placeholder="Role" required value={formData.role} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
              <input name="image" placeholder="Image URL" required value={formData.image} onChange={handleChange} className="w-full px-3 py-2 border rounded" />
              <select name="level" value={formData.level} onChange={handleChange} className="w-full px-3 py-2 border rounded">
                {levels.map((lvl) => <option key={lvl} value={lvl}>Level {lvl}</option>)}
              </select>
              <button type="submit" className="bg-blue-500 text-white w-full py-2 rounded">✅ Update Node</button>
            </form>
          </div>
        </div>
      )}

      {levels.map((lvl) => (
        <LevelBox
          key={lvl}
          level={lvl}
          nodes={nodes.filter((node) => node.level === lvl)}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          onNodeClick={handleNodeClick}
          isDragging={isDragging}
        />
      ))}

      <Xarrow start="level-1" end="level-2" color="black" strokeWidth={2} />
      <Xarrow start="level-2" end="level-3" color="black" strokeWidth={2} />
    </div>
  );
};

export default LevelTree;
