import React, { useEffect, useState } from "react";
import axios from "axios";
import Xarrow from "react-xarrows";

const NodeBox = ({ node }) => (
  <div
    id={node.id}
    style={{
      width: 130,
      margin: 10,
      padding: 10,
      borderRadius: 12,
      backgroundColor: "#d6bcfa",
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      textAlign: "center",
    }}
  >
    <img
      src={node.image}
      alt={node.name}
      style={{
        width: 50,
        height: 50,
        borderRadius: "50%",
        border: "2px solid white",
        marginBottom: 6,
      }}
    />
    <div style={{ fontWeight: "bold", fontSize: 14 }}>{node.name}</div>
    <div style={{ fontSize: 12, fontStyle: "italic" }}>{node.role}</div>
  </div>
);

const LevelBox = ({ level, nodes }) => (
  <div
    id={`level-${level}`}
    style={{
      border: "2px solid gray",
      margin: "20px 0",
      padding: 20,
      borderRadius: 8,
      background: "#f0f0f0",
    }}
  >
    <h2 style={{ textAlign: "center", marginBottom: 10 }}>Level {level}</h2>
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
      {nodes.map((node) => (
        <NodeBox key={node.id} node={node} />
      ))}
    </div>
  </div>
);

const LevelTree = () => {
  const [nodes, setNodes] = useState([]);

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const res = await axios.get("http://localhost:3000/users"); // or your endpoint
        setNodes(res.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchNodes();
  }, []);

  const levels = [...new Set(nodes.map((node) => node.level))].sort((a, b) => a - b);

  return (
    <div style={{ padding: 40, backgroundColor: "#fff", minHeight: "100vh", position: "relative" }}>
      <h1 style={{ textAlign: "center", fontSize: 32, color: "#4a00e0", marginBottom: 30 }}>
        8Bit Organization
      </h1>

      {levels.map((level) => (
        <LevelBox key={level} level={level} nodes={nodes.filter((n) => n.level === level)} />
      ))}

      {/* Draw arrows between levels */}
      {levels.map((level, i) =>
        i < levels.length - 1 ? (
          <Xarrow
            key={level}
            start={`level-${level}`}
            end={`level-${levels[i + 1]}`}
            color="black"
            strokeWidth={2}
          />
        ) : null
      )}
    </div>
  );
};

export default LevelTree;
