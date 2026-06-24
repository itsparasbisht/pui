import { useEffect, useState, type ReactNode } from "react";
import { FileExplorerContext } from "./FileExplorerContext";
import type { FileExplorerItem, TreeNode } from "../utils";
import type { FileExplorerProps } from "../FileExplorer";

type FileExplorerProviderProps = {
  children: ReactNode;
} & Omit<FileExplorerProps, "onItemsChange" | "className">;

export function FileExplorerProvider({
  children,
  items,
  selectedId,
  onSelectionChange,
  expandedIds,
  onExpandedChange,
}: FileExplorerProviderProps) {
  const [activeNode, setActiveNode] = useState<
    TreeNode | FileExplorerItem | null
  >(null);
  const [expandedNodes, setExpandedNodes] = useState<string[]>(
    expandedIds ?? [],
  );

  useEffect(() => {
    if (selectedId) {
      const node = items.find((item) => item.id === selectedId) ?? null;
      setActiveNode(node);
    }
  }, [items, selectedId]);

  function changeActiveNode(node: TreeNode | null) {
    setActiveNode(node);

    if (onSelectionChange) onSelectionChange(node);

    if (node !== null && node.type === "folder") updateExpandedNodes(node.id);
  }

  function updateExpandedNodes(nodeId: string) {
    const isNodeExpanded = expandedNodes.includes(nodeId);

    if (isNodeExpanded) {
      const filteredNodes = expandedNodes.filter((id) => id !== nodeId);
      setExpandedNodes(filteredNodes);

      if (onExpandedChange) onExpandedChange(filteredNodes);
    } else {
      setExpandedNodes((prev) => [...prev, nodeId]);
    }
  }

  return (
    <FileExplorerContext.Provider
      value={{
        activeNode,
        changeActiveNode,
        expandedNodes,
        updateExpandedNodes,
      }}
    >
      {children}
    </FileExplorerContext.Provider>
  );
}
