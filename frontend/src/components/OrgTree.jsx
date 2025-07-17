import { useEffect, useRef, useState } from "react";
import Tree from "react-d3-tree";
const { VITE_API_URL } = import.meta.env;

// Recursively map user object to react-d3-tree format
function mapToTreeNode(user) {
  const mapped = {
    name: user.name,
    attributes: {
      role: user.designation,
      image: user.image,
    },
    children: Array.isArray(user.children) && user.children.length > 0
      ? user.children.map(mapToTreeNode)
      : [],
  };
  if (!mapped.children.length) {
    console.log("Leaf node mapped:", mapped);
  }
  return mapped;
}

function normalizeChildrenRecursive(user, allUsers) {
  const normalizedChildren = Array.isArray(user.children)
    ? user.children.map(child =>
        typeof child === "string"
          ? allUsers.find(u => u._id === child)
          : child
      ).filter(Boolean)
    : [];
  return {
    ...user,
    children: normalizedChildren.map(child => normalizeChildrenRecursive(child, allUsers)),
  };
}

export default function OrgTree() {
  const treeRef = useRef();
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    fetch(`${VITE_API_URL}/user`)
      .then((response) => response.json())
      .then((data) => {
        const normalizedUsers = data.map(user => normalizeChildrenRecursive(user, data));
        const rootUser = normalizedUsers.find(user => user.parent === null);
        const treeRoot = mapToTreeNode(rootUser);
        console.log("Mapped tree root:", treeRoot);
        setTreeData(treeRoot);
        const dimensions = treeRef.current.getBoundingClientRect();
        setTranslate({ x: dimensions.width / 2, y: 100 });
      })
  }, []);

  // useEffect(() => {
  //   const rootNode = buildTree(flatEmployees);
  //   setTreeData(rootNode);

  //   const dimensions = treeRef.current.getBoundingClientRect();
  //   setTranslate({ x: dimensions.width / 2, y: 100 });
  // }, []);

  // Custom Node Renderer
  const renderSquareNode = ({ nodeDatum, toggleNode }) => {
    const isParent = nodeDatum.children && nodeDatum.children.length > 0;
    // Parent: blue-200 bg, white text, blue-700 border. Leaf: white bg, dark blue text, gray border.
    const bgColor = isParent ? "#bfdbfe" : "#fff";
    const borderColor = isParent ? "#1d4ed8" : "#cbd5e1";
    const nameColor = isParent ? "#fff" : "#1e293b";
    const roleBg = isParent ? "#fff" : "#dbeafe";
    const roleText = isParent ? "#2563eb" : "#1e293b";
    const roleOpacity = isParent ? 0.18 : 1;
    return (
      <g onClick={toggleNode} style={{ cursor: "pointer" }}>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.15" />
        </filter>
        <rect
          width={160}
          height={140}
          x={-80}
          y={-90}
          fill={bgColor}
          stroke={borderColor}
          strokeWidth={2}
          rx={18}
          filter="url(#shadow)"
        />
        {/* Render image in a perfect circle with border */}
        {nodeDatum.attributes?.image && (
          <g>
            <circle cx="0" cy="-60" r="32" fill="#fff" stroke="#cbd5e1" strokeWidth="2" />
            <image
              href={nodeDatum.attributes.image}
              x={-32}
              y={-92}
              width={64}
              height={64}
              style={{
                clipPath: 'circle(32px at 32px 32px)'
              }}
            />
          </g>
        )}
        <text
          x="0"
          y="0"
          textAnchor="middle"
          fontSize="16"
          fontWeight="normal"
          fill={nameColor}
          style={{
            ...(isParent ? { textShadow: '0 1px 4px #0006' } : {}),
            fontFamily: 'Inter, Segoe UI, Arial, sans-serif'
          }}
        >
          {nodeDatum.name}
        </text>
        {nodeDatum.attributes?.role && (
          <rect x={-50} y={20} width={100} height={28} rx={8} fill={roleBg} opacity={roleOpacity} />
        )}
        {nodeDatum.attributes?.role && (
          <text
            x="0"
            y="38"
            textAnchor="middle"
            fontSize="13"
            fontWeight="normal"
            fill={roleText}
            style={{
              ...(isParent ? { textShadow: '0 1px 4px #fff8' } : {}),
              fontFamily: 'Inter, Segoe UI, Arial, sans-serif'
            }}
          >
            {nodeDatum.attributes.role}
          </text>
        )}
        <rect
          width={160}
          height={140}
          x={-80}
          y={-90}
          fill="transparent"
          rx={18}
          style={{ pointerEvents: "all" }}
        >
          <title>Click to expand/collapse</title>
        </rect>
      </g>
    );
  };

  return (
    <div
      ref={treeRef}
      style={{
        width: "100vw",
        height: "100vh",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f3f4f6 0%, #e0e7ff 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        overflow: "auto",
      }}
    >
      <h1 style={{
        fontSize: "2.5rem",
        fontWeight: 700,
        color: "#3730a3",
        margin: "32px 0 12px 0",
        letterSpacing: "-1px",
        textShadow: "0 2px 8px #fff8"
      }}>
        Organization Structure
      </h1>
      <div style={{ width: "100%", flex: 1 }}>
        {treeData && (
          <Tree
            data={treeData}
            translate={translate}
            orientation="vertical"
            pathFunc="step"
            collapsible
            nodeSize={{ x: 200, y: 220 }}
            renderCustomNodeElement={renderSquareNode}
            zoomable
            zoom={0.9}
            separation={{ siblings: 1.2, nonSiblings: 2 }}
          />
        )}
      </div>
    </div>
  );
}
