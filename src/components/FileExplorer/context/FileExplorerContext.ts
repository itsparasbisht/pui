import { createContext } from "react";
import type { TreeNode } from "../utils";

type fileExplorerContext = {
  activeNode: TreeNode | null;
  changeActiveNode?: (node: TreeNode | null) => void;
};

const initialState: fileExplorerContext = {
  activeNode: null,
  changeActiveNode: () => {},
};

export const FileExplorerContext =
  createContext<fileExplorerContext>(initialState);
