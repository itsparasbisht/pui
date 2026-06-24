import { FolderPlus, FilePlus } from "lucide-react";
import styles from "./FileExplorerTree.module.css";
import { useContext, useMemo, useState } from "react";
import {
  buildTree,
  generateId,
  type FileExplorerItem,
  type ItemType,
} from "./utils";
import { AddItemInput } from "./AddItemInput";
import { ItemNode } from "./ItemNode";
import { FileExplorerContext } from "./context/FileExplorerContext";
import type { FileExplorerProps } from "./FileExplorer";

const getNextId = generateId();

let itemType: ItemType = "folder";

type FileExplorerTreeProps = Pick<
  FileExplorerProps,
  "items" | "onItemsChange" | "className"
>;

export function FileExplorerTree({
  items,
  onItemsChange,
  className,
}: FileExplorerTreeProps) {
  const [explorerData, setExplorerData] = useState<FileExplorerItem[]>(items);

  const [showAddItemInput, setShowAddItemInput] = useState(false);

  const { activeNode, changeActiveNode } = useContext(FileExplorerContext);

  function handleCreate(item: ItemType) {
    itemType = item;
    setShowAddItemInput(true);
  }

  function handleEnterItem(name: string) {
    const newId = getNextId().toString();

    let newItemParentId: string | null = null;

    if (activeNode && activeNode.type === "folder") {
      newItemParentId = activeNode.id;
    } else if (activeNode && activeNode.type === "file") {
      newItemParentId = activeNode.parentId;
    }

    setExplorerData((prevData) => [
      ...prevData,
      {
        id: newId,
        name,
        type: itemType,
        parentId: newItemParentId,
      },
    ]);

    onItemsChange([
      ...explorerData,
      {
        id: newId,
        name,
        type: itemType,
        parentId: newItemParentId,
      },
    ]);

    if (itemType === "folder") {
      changeActiveNode!({
        id: newId,
        name,
        type: "folder",
        parentId: newItemParentId,
        children: [],
      });
    }

    setShowAddItemInput(false);
  }

  const itemsTree = useMemo(() => buildTree(explorerData), [explorerData]);

  return (
    <div
      className={`${styles.container} ${className}`}
      onClick={() => {
        console.log("click");
        changeActiveNode!(null);
        setShowAddItemInput(false);
      }}
    >
      <div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCreate("folder");
          }}
        >
          <FolderPlus />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCreate("file");
          }}
        >
          <FilePlus />
        </button>
      </div>

      {showAddItemInput &&
        (activeNode === null ||
          (activeNode.type === "file" && activeNode.parentId === null)) && (
          <AddItemInput onAddItem={handleEnterItem} currentNode={null} />
        )}

      {itemsTree.map((rootNode) => (
        <ItemNode
          key={rootNode.id}
          node={rootNode}
          addItemHandler={handleEnterItem}
          showAddItemInput={showAddItemInput}
          setShowAddItemInput={setShowAddItemInput}
        />
      ))}
    </div>
  );
}
