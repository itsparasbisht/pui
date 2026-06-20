import { createContext } from "react";
import type { TreeNode } from "../utils";

type fileExplorerContext = {
  activeNode: TreeNode | null;
  changeActiveNode?: (node: TreeNode | null) => void;
  expandedNodes: number[];
  updateExpandedNodes: (nodeId: number) => void;
};

const initialState: fileExplorerContext = {
  activeNode: null,
  changeActiveNode: () => {},
  expandedNodes: [],
  updateExpandedNodes: () => {},
};

export const FileExplorerContext =
  createContext<fileExplorerContext>(initialState);
