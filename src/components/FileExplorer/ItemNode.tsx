import { File, Folder } from "lucide-react";
import { type TreeNode } from "./utils";

type ItemNodeProps = {
  node: TreeNode;
};

export function ItemNode({ node }: ItemNodeProps) {
  const isFolder = node.type === "folder";

  return (
    <div style={{ marginLeft: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          cursor: "pointer",
          padding: "0.25rem 0.5rem",
          borderRadius: "4px",
        }}
      >
        {isFolder ? <Folder /> : <File />}
        <span>{node.name}</span>
      </div>

      {isFolder &&
        node.children.map((child) => <ItemNode key={child.id} node={child} />)}
    </div>
  );
}
