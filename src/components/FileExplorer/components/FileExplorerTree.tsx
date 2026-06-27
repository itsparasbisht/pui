import { FolderPlus, FilePlus } from "lucide-react";
import styles from "./FileExplorerTree.module.css";
import { AddItemInput } from "./AddItemInput";
import { ItemNode } from "./ItemNode";
import { useCallback, useContext } from "react";
import { FileExplorerContext } from "../context/FileExplorerContext";

export function FileExplorerTree() {
  const {
    tree,
    createDraft,
    handleStartCreate,
    handleCancelCreate,
    selectedItem,
  } = useContext(FileExplorerContext);

  const shouldShowAddInput = useCallback(() => {
    if (createDraft && selectedItem && selectedItem.type === "file") {
      return selectedItem.parentId === null;
    } else if (createDraft && selectedItem?.type === "folder") {
      return false;
    } else if (createDraft && selectedItem === null) {
      return true;
    }

    return false;
  }, [selectedItem, createDraft]);

  return (
    <div
      className={`${styles.container}`}
      onClick={(e) => {
        e.stopPropagation();
        handleCancelCreate();
      }}
    >
      <div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleStartCreate("folder");
          }}
        >
          <FolderPlus />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleStartCreate("file");
          }}
        >
          <FilePlus />
        </button>
      </div>

      {shouldShowAddInput() && <AddItemInput />}

      {tree.map((rootNode) => (
        <ItemNode key={rootNode.id} node={rootNode} />
      ))}
    </div>
  );
}
