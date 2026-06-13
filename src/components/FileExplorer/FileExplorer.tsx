import { FolderPlus, FilePlus, Folder, File } from "lucide-react";
import styles from "./FileExplorer.module.css";
import { useState } from "react";
import { generateId, type ExplorerData } from "./utils";
import { AddItemInput } from "./AddItemInput";

const getNextId = generateId();

let itemType: "folder" | "file" = "folder";

export function FileExplorer() {
  const [explorerData, setExplorerData] = useState<ExplorerData[]>([]);

  function handleCreateFolder() {
    itemType = "folder";
  }

  function handleCreateFile() {
    itemType = "file";
  }

  function handleEnterItem(name: string) {
    const newId = getNextId();

    setExplorerData((prevData) => [
      ...prevData,
      {
        id: newId,
        name,
        type: itemType,
        parentId: null,
      },
    ]);
  }

  return (
    <div className={styles.container}>
      <div>
        <button onClick={handleCreateFolder}>
          <FolderPlus />
        </button>
        <button onClick={handleCreateFile}>
          <FilePlus />
        </button>
      </div>

      <AddItemInput onEnterItem={handleEnterItem} />

      {explorerData.map((item) => (
        <div key={item.id}>
          {item.type === "folder" ? <Folder /> : <File />}
          <span>{item.name}</span>
        </div>
      ))}

      {/* <p>{JSON.stringify(explorerData, null, 2)}</p> */}
    </div>
  );
}
