import { File, Folder } from "lucide-react";
import { type TreeNode } from "./utils";
import { AddItemInput } from "./AddItemInput";
import { useContext } from "react";
import { FileExplorerContext } from "./context/FileExplorerContext";

type ItemNodeProps = {
  node: TreeNode;
  addItemHandler: (name: string) => void;
  showAddItemInput: boolean;
  setShowAddItemInput: (hide: boolean) => void;
};

export function ItemNode({
  node,
  addItemHandler,
  showAddItemInput,
  setShowAddItemInput,
}: ItemNodeProps) {
  const isFolder = node.type === "folder";

  const { activeNode, changeActiveNode, expandedNodes } =
    useContext(FileExplorerContext);

  console.log(expandedNodes);

  const isExpanded = expandedNodes.includes(node.id);

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
          backgroundColor: activeNode?.id === node.id ? "#c4c4c4" : "white",
        }}
        onClick={(e) => {
          e.stopPropagation();
          changeActiveNode!(node);
          setShowAddItemInput(false);
        }}
      >
        {isFolder && (
          <details open={isExpanded}>
            <summary>
              <Folder /> <span>{node.name}</span>
            </summary>

            {showAddItemInput &&
              (activeNode?.id === node.id ||
                (activeNode?.type === "file" &&
                  activeNode?.parentId === node.id)) && (
                <AddItemInput onAddItem={addItemHandler} currentNode={node} />
              )}

            {node.children.map((child) => (
              <ItemNode
                key={child.id}
                node={child}
                addItemHandler={addItemHandler}
                showAddItemInput={showAddItemInput}
                setShowAddItemInput={setShowAddItemInput}
              />
            ))}
          </details>
        )}

        {!isFolder && (
          <>
            <File /> <span>{node.name}</span>
          </>
        )}
      </div>

      {/* {node.type === "folder" &&
        showAddItemInput &&
        (activeNode?.id === node.id ||
          (activeNode?.type === "file" &&
            activeNode?.parentId === node.id)) && (
          <AddItemInput onAddItem={addItemHandler} currentNode={node} />
        )} */}

      {/* {isFolder &&
        node.children.map((child) => (
          <ItemNode
            key={child.id}
            node={child}
            addItemHandler={addItemHandler}
            isVisible={isVisible}
            setIsVisible={setIsVisible}
          />
        ))} */}
    </div>
  );
}
