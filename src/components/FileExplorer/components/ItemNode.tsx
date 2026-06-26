import { File, Folder } from "lucide-react";
import { type TreeNode } from "../utils";
import styles from "./ItemNode.module.css";
import { useContext } from "react";
import { FileExplorerContext } from "../context/FileExplorerContext";

type ItemNodeProps = {
  node: TreeNode;
};

export function ItemNode({ node }: ItemNodeProps) {
  const { selectedId, handleSelectItem } = useContext(FileExplorerContext);

  const isSelected = selectedId === node.id;
  const isFolder = node.type === "folder";

  return (
    <div style={{ marginLeft: node.parentId === null ? 0 : "20px" }}>
      <div>
        {isFolder && (
          <details>
            <summary
              onClick={(e) => {
                e.stopPropagation();
                handleSelectItem(node.id);
              }}
              className={`${styles.item} ${isSelected && styles.selectedItem}`}
            >
              <Folder /> <span>{node.name}</span>
            </summary>

            {node.children.map((child) => (
              <ItemNode key={child.id} node={child} />
            ))}
          </details>
        )}

        {!isFolder && (
          <div
            className={`${styles.item} ${isSelected && styles.selectedItem}`}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectItem(node.id);
            }}
          >
            <File /> <span>{node.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
