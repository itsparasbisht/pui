import { createContext } from "react";
import type { TreeNode } from "../utils";

type fileExplorerContext = {
  activeNode: TreeNode | null;
  changeActiveNode?: (node: TreeNode | null) => void;
  expandedNodes: string[];
  updateExpandedNodes: (nodeId: string) => void;
};

const initialState: fileExplorerContext = {
  activeNode: null,
  changeActiveNode: () => {},
  expandedNodes: [],
  updateExpandedNodes: () => {},
};

export const FileExplorerContext =
  createContext<fileExplorerContext>(initialState);
