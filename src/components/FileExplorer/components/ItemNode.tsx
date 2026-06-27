import { File, Folder } from "lucide-react";
import { type TreeNode } from "../utils";
import styles from "./ItemNode.module.css";
import { useCallback, useContext } from "react";
import { FileExplorerContext } from "../context/FileExplorerContext";
import { AddItemInput } from "./AddItemInput";

type ItemNodeProps = {
  node: TreeNode;
};

export function ItemNode({ node }: ItemNodeProps) {
  const {
    selectedId,
    handleSelectItem,
    handleCancelCreate,
    createDraft,
    selectedItem,
  } = useContext(FileExplorerContext);

  const isSelected = selectedId === node.id;
  const isFolder = node.type === "folder";

  const shouldShowAddInput = useCallback(() => {
    if (createDraft && selectedItem && selectedItem.type === "file") {
      return selectedItem.parentId === node.id;
    } else if (createDraft) {
      return selectedItem?.id === node.id;
    }
  }, [selectedItem, node.id, createDraft]);

  return (
    <div style={{ marginLeft: node.parentId === null ? 0 : "20px" }}>
      <div>
        {isFolder && (
          <details>
            <summary
              onClick={(e) => {
                e.stopPropagation();
                handleSelectItem(node.id);
                handleCancelCreate();
              }}
              className={`${styles.item} ${isSelected && styles.selectedItem}`}
            >
              <Folder /> <span>{node.name}</span>
            </summary>

            {shouldShowAddInput() && <AddItemInput />}

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
              handleCancelCreate();
            }}
          >
            <File /> <span>{node.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
