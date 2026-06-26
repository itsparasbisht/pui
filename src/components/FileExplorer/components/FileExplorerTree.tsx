import { FolderPlus, FilePlus } from "lucide-react";
import styles from "./FileExplorerTree.module.css";
import { AddItemInput } from "./AddItemInput";
import { ItemNode } from "./ItemNode";
import { useContext } from "react";
import { FileExplorerContext } from "../context/FileExplorerContext";

export function FileExplorerTree() {
  const { tree, createDraft, handleStartCreate } =
    useContext(FileExplorerContext);

  return (
    <div className={`${styles.container}`}>
      <div>
        <button onClick={() => handleStartCreate("folder")}>
          <FolderPlus />
        </button>
        <button onClick={() => handleStartCreate("file")}>
          <FilePlus />
        </button>
      </div>

      {createDraft && <AddItemInput />}

      {tree.map((rootNode) => (
        <ItemNode key={rootNode.id} node={rootNode} />
      ))}
    </div>
  );
}
