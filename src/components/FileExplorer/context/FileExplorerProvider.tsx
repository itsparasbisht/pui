import { useState, type ReactNode } from "react";
import { FileExplorerContext } from "./FileExplorerContext";
import type { TreeNode } from "../utils";

export function FileExplorerProvider({ children }: { children: ReactNode }) {
  const [activeNode, setActiveNode] = useState<TreeNode | null>(null);

  function changeActiveNode(node: TreeNode | null) {
    setActiveNode(node);
  }

  return (
    <FileExplorerContext.Provider value={{ activeNode, changeActiveNode }}>
      {children}
    </FileExplorerContext.Provider>
  );
}
