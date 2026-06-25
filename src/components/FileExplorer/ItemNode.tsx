import { File, Folder } from "lucide-react";
import { type TreeNode } from "./utils";
import styles from "./ItemNode.module.css";

type ItemNodeProps = {
  node: TreeNode;
};

export function ItemNode({ node }: ItemNodeProps) {
  const isFolder = node.type === "folder";

  return (
    <div style={{ marginLeft: node.parentId === null ? 0 : "20px" }}>
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
        {isFolder && (
          <details style={{ width: "100%" }}>
            <summary
              onClick={(e) => e.preventDefault()}
              className={styles.expandableNode}
            >
              <Folder /> <span>{node.name}</span>
            </summary>

            {node.children.map((child) => (
              <ItemNode key={child.id} node={child} />
            ))}
          </details>
        )}

        {!isFolder && (
          <div className={styles.fileNode}>
            <File /> <span>{node.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
