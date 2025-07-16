import { useEffect, useState, useRef } from "react";
import Tree from "react-d3-tree";
import { flatEmployees } from "./employees";
import { buildTree } from "../utils/BuildTree";

export default function OrgTree() {
  const treeRef = useRef();
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [treeData, setTreeData] = useState(null);

  useEffect(() => {
    const rootNode = buildTree(flatEmployees);
    setTreeData(rootNode);

    const dimensions = treeRef.current.getBoundingClientRect();
    setTranslate({ x: dimensions.width / 2, y: 100 });
  }, []);

  // Custom Node Renderer
  const renderSquareNode = ({ nodeDatum, toggleNode }) => (
    <g onClick={toggleNode}>
      <rect

      // className="bg-blue-200"
        width={140}
        height={150}
        x={-70}
        y={-80}
        // fill="cyan"
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
          fill="#e0e7ff"
          // r={40}
        >
          {nodeDatum.attributes.role}
        </text>
      )}
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
