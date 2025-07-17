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

      {nodeDatum.attributes?.image ? (
        <image
          href={nodeDatum.attributes.image}
          x={-30}
          y={-70}
          width={60}
          height={60}
          clipPath="circle(30px at center)"
        />
      ) : null}

      <text
        x="0"
        y="15 "
        textAnchor="middle"
        fontSize="14"
      >
        {nodeDatum.name || "No Name"}
      </text>

      {nodeDatum.attributes?.role ? (
        <text
          x="0"
          y="30"
          textAnchor="middle"
          fontSize="12"
        >
          {nodeDatum.attributes.role}
        </text>
      ) : null}
    </g>
  );

  return (
    <div
      ref={treeRef}
      style={{ width: "100%", height: "100vh", backgroundColor: "#f3f4f6" }}
    >
      {treeData && (
        <Tree
          data={treeData}
          translate={translate}
          orientation="vertical"
          pathFunc="step"
          collapsible
          nodeSize={{ x: 180, y: 200 }}
          renderCustomNodeElement={renderSquareNode}
        />
      )}
    </div>
  );
}
