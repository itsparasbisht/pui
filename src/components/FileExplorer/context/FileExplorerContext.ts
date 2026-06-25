import { createContext } from "react";
import type { FileExplorerItem, TreeNode } from "../utils";

export type FileExplorerContext = {
  items: FileExplorerItem[];
  tree: TreeNode[];

  selectedId: string | null;
  // selectedItem: FileExplorerItem | null;
  // handleSelectItem: (id: string | null) => void;

  // expandedIds: string[];
  // handleToggleExpand: (id: string) => void;

  createDraft: {
    type: "file" | "folder";
    parentId: string | null;
  };
  handleStartCreate: (type: "file" | "folder") => void;
  handleCreateItem: (name: string) => void;
};

const initialState: FileExplorerContext = {
  items: [],
  tree: [],
  selectedId: null,
  // selectedItem: null,
  // handleSelectItem: () => {},
  // expandedIds: [],
  // handleToggleExpand: () => {},
  createDraft: { type: "folder", parentId: null },
  handleStartCreate: () => {},
  handleCreateItem: () => {},
};

export const FileExplorerContext =
  createContext<FileExplorerContext>(initialState);
