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
        console.log("norm",normalizedUsers)
        const rootUser = normalizedUsers.find(user => user.parent === null);
        console.log("Root User",rootUser)
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
  const renderSquareNode = ({ nodeDatum, toggleNode }) => (
    <g onClick={toggleNode}>
      <rect
        width={140}
        height={120}
        x={-70}
        y={-80}
        fill="#"
        stroke="#111827"
        strokeWidth={2}
        rx={12}
      />

      {nodeDatum.attributes?.image && (
        <image
          href={nodeDatum.attributes.image}
          x={-30}
          y={-70}
          width={60}
          height={60}
          clipPath="circle(30px at center)"
        />
      )}

      <text
        x="0"
        y="15 "
        textAnchor="middle"
        fontSize="14"
        // fontWeight="bold"
        
        // fill="#fff"
      >
        {nodeDatum.name}
      </text>

      {nodeDatum.attributes?.role && (
        <text
          x="0"
          y="30"
          textAnchor="middle"
          fontSize="12"
          // fill="#e0e7ff"
        >
          {nodeDatum.attributes.role}
        </text>
      )}
    </g>
  );

  return (
    <div
      ref={treeRef}
      style={{
        width: "100vw",
        height: "100vh",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f3f4f6 0%, #e0e7ff 100%)",
        // background: "linear-gradient(135deg, #fbc2eb 10%, #a18cd1 50%, #c2e9fb 100%)",
        // background: "linear-gradient(135deg, #d0e8ff 0%, #76b4ff 50%, #3a8dff 100%)",
          // background: "linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 50%, #d4d4d4 100%)",

        // background: "linear-gradient(135deg, #f4e2d8 0%, #d6d4f1 50%, #c2f0f7 70%)",

        // background: "linear-gradient(135deg, #f3f4f6 0%, #e0e7ff 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        overflow: "auto",
      }}
    >
      <h1 style={{
        fontSize: "2.5rem",
        // fontWeight: 700,
        color: "#3730a3",
        margin: "32px 0 12px 0",
        letterSpacing: "-1px",
        textShadow: "0 2px 8px #fff8"
      }}>
       8Bit Organization
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
