import React, { useState } from "react";
import Xarrow from "react-xarrows";

const NodeBox = ({ node }) => (
  <div
    id={node.id}
    className="min-w-[120px] max-w-[150px] bg-purple-100 rounded-2xl  text-black rounded flex flex-col items-center justify-center p-2 m-2 shadow-lg hover:bg-blue-200 transition-bg duration-300"
  >
    <img
      src={node.image}
      alt={node.name}
      className="w-12 h-12 rounded-full border-2 border-white mb-1"
    />
    <div className="font-bold text-sm">{node.name}</div>
    <div className="text-xs italic">{node.role}</div>
  </div>
);

const LevelBox = ({ level, nodes }) => (
  <div
    id={`level-${level}`}
    className="w-full border-2 border-gray-400 rounded p-4 m-4 bg-gray-100"
  >
    <h2 className="text-lg font-bold mb-2">Level {level}</h2>
    <div className="flex flex-wrap justify-center">
      {nodes.map((node) => (
        <NodeBox key={node.id} node={node} />
      ))}
    </div>
  </div>
);

const LevelTree = () => {
  const [level1, setLevel1] = useState([
    { id: "A1", name: "Alice", role: "CEO", image: "https://i.pinimg.com/736x/2d/95/e5/2d95e5886fc4c65a6778b5fee94a7d59.jpg" },
    { id: "A2", name: "Bob", role: "CTO", image: "https://via.placeholder.com/50" },
  ]);
  const [level2, setLevel2] = useState([
    { id: "B1", name: "Charlie", role: "Manager", image: "https://via.placeholder.com/50" },
    { id: "B2", name: "Dana", role: "Designer", image: "https://via.placeholder.com/50" },
  ]);
  const [level3, setLevel3] = useState([
    { id: "C1", name: "Eve", role: "Engineer", image: "https://via.placeholder.com/50" },
    { id: "C2", name: "Frank", role: "Analyst", image: "https://via.placeholder.com/50" },
    { id: "C2", name: "Frank", role: "Analyst", image: "https://via.placeholder.com/50" },
    { id: "C2", name: "Frank", role: "Analyst", image: "https://via.placeholder.com/50" },
    { id: "C2", name: "Frank", role: "Analyst", image: "https://via.placeholder.com/50" },
    { id: "C2", name: "Frank", role: "Analyst", image: "https://via.placeholder.com/50" },
    { id: "C2", name: "Frank", role: "Analyst", image: "https://via.placeholder.com/50" },
  ]);

  const addNode = (level) => {
    const id = String.fromCharCode(64 + level) + Math.floor(Math.random() * 100);
    const newNode = {
      id,
      name: "New User",
      role: "Role",
      image: "https://i.pinimg.com/736x/2d/95/e5/2d95e5886fc4c65a6778b5fee94a7d59.jpg",
    };

    if (level === 1) setLevel1((prev) => [...prev, newNode]);
    console.log(newNode)
    if (level === 2) setLevel2((prev) => [...prev, newNode]);
    if (level === 3) setLevel3((prev) => [...prev, newNode]);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-3xl  font-bold text-center mb-8">8Bit Orgnization</h1>

      <div className="flex justify-center gap-4 mb-6">
        <button onClick={() => addNode(1)} className="bg-blue-600 text-white px-4 py-2 rounded">
          Add to Level 1
        </button>
        <button onClick={() => addNode(2)} className="bg-green-600 text-white px-4 py-2 rounded">
          Add to Level 2
        </button>
        <button onClick={() => addNode(3)} className="bg-purple-600 text-white px-4 py-2 rounded">
          Add to Level 3
        </button>
      </div>

      <div>
        <LevelBox level={1} nodes={level1} />
        <LevelBox level={2} nodes={level2} />
        <LevelBox level={3} nodes={level3} />
      </div>

     
      {/* Arrows between level containers */}
      <Xarrow start="level-1" end="level-2" color="black" strokeWidth={2} />
      <Xarrow start="level-2" end="level-3" color="black" strokeWidth={2} />
    </div>
  );
};

export default LevelTree;
