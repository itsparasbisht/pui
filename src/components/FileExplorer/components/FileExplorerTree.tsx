import { FolderPlus, FilePlus } from "lucide-react";
import styles from "./FileExplorerTree.module.css";
import { AddItemInput } from "./AddItemInput";
import { ItemNode } from "./ItemNode";
import { useContext } from "react";
import { FileExplorerContext } from "../context/FileExplorerContext";

type FileExplorerTreeProps = {
  className?: string;
};

export function FileExplorerTree({ className }: FileExplorerTreeProps) {
  const {
    tree,
    handleStartCreate,
    handleCancelCreate,
    shouldShowCreateInputAt,
  } = useContext(FileExplorerContext);

  return (
    <div
      className={`${styles.container} ${className ?? ""}`.trim()}
      onClick={(e) => {
        e.stopPropagation();
        handleCancelCreate();
      }}
    >
      <div>
        <button
          type="button"
          aria-label="New folder"
          onClick={(e) => {
            e.stopPropagation();
            handleStartCreate("folder");
          }}
        >
          <FolderPlus />
        </button>
        <button
          type="button"
          aria-label="New file"
          onClick={(e) => {
            e.stopPropagation();
            handleStartCreate("file");
          }}
        >
          <FilePlus />
        </button>
      </div>

      {shouldShowCreateInputAt(null) && <AddItemInput />}

      {tree.map((rootNode) => (
        <ItemNode key={rootNode.id} node={rootNode} />
      ))}
    </div>
  );
}
