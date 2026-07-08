import { FolderPlus, FilePlus } from "lucide-react";
import styles from "./FileExplorerTree.module.css";
import { AddItemInput } from "./AddItemInput";
import { ItemNode } from "./ItemNode";
import { useContext } from "react";
import { FileExplorerContext } from "../context/FileExplorerContext";

type FileExplorerTreeProps = {
  className?: string;
  theme?: "light" | "dark";
};

export function FileExplorerTree({ className, theme }: FileExplorerTreeProps) {
  const {
    tree,
    handleStartCreate,
    handleCancelCreate,
    shouldShowCreateInputAt,
  } = useContext(FileExplorerContext);

  return (
    <div
      className={`${styles.container} ${className ?? ""}`.trim()}
      data-pui-theme={theme}
      onClick={(e) => {
        e.stopPropagation();
        handleCancelCreate();
      }}
    >
      <div className={styles.header}>
        <button
          type="button"
          className={styles.headerButton}
          aria-label="New folder"
          onClick={(e) => {
            e.stopPropagation();
            handleStartCreate("folder");
          }}
        >
          <FolderPlus size={16} />
        </button>
        <button
          type="button"
          className={styles.headerButton}
          aria-label="New file"
          onClick={(e) => {
            e.stopPropagation();
            handleStartCreate("file");
          }}
        >
          <FilePlus size={16} />
        </button>
      </div>

      <div className={styles.treeContent} role="tree" aria-label="File Explorer">
        {shouldShowCreateInputAt(null) && <AddItemInput />}

        {tree.map((rootNode) => (
          <ItemNode key={rootNode.id} node={rootNode} />
        ))}

        {tree.length === 0 && !shouldShowCreateInputAt(null) && (
          <div className={styles.emptyState}>
            <FolderPlus size={24} strokeWidth={1.5} className={styles.emptyIcon} />
            <p className={styles.emptyText}>Empty Workspace</p>
            <p className={styles.emptySubtext}>Create a file or folder from the toolbar above</p>
          </div>
        )}
      </div>
    </div>
  );
}
