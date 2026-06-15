import { FolderPlus, FilePlus } from "lucide-react";
import styles from "./FileExplorer.module.css";
import { useMemo, useState } from "react";
import {
  buildTree,
  generateId,
  type ExplorerData,
  type ItemType,
} from "./utils";
import { AddItemInput } from "./AddItemInput";
import { ItemNode } from "./ItemNode";

const getNextId = generateId();

let itemType: ItemType = "folder";

export function FileExplorer() {
  const [explorerData, setExplorerData] = useState<ExplorerData[]>([
    { id: 0, name: "folder1", type: "folder", parentId: null },
    { id: 1, name: "file1", type: "file", parentId: 0 },
    { id: 2, name: "file2", type: "file", parentId: null },
    { id: 3, name: "file3", type: "file", parentId: 0 },
    { id: 4, name: "folder2", type: "folder", parentId: 0 },
    { id: 5, name: "file4", type: "file", parentId: 0 },
    { id: 6, name: "file5", type: "file", parentId: 4 },
  ]);

  function handleCreate(item: ItemType) {
    itemType = item;
  }

  function handleEnterItem(name: string) {
    const newId = getNextId();

    setExplorerData((prevData) => [
      ...prevData,
      {
        id: newId,
        name,
        type: itemType,
        parentId: null, // temp,
      },
    ]);
  }

  const itemsTree = useMemo(() => buildTree(explorerData), [explorerData]);

  return (
    <div className={styles.container}>
      <div>
        <button onClick={() => handleCreate("folder")}>
          <FolderPlus />
        </button>
        <button onClick={() => handleCreate("file")}>
          <FilePlus />
        </button>
      </div>

      <AddItemInput onEnterItem={handleEnterItem} />

      {itemsTree.map((rootNode) => (
        <ItemNode node={rootNode} />
      ))}
    </div>
  );
}
