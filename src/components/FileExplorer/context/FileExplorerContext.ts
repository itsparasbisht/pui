import { createContext } from "react";
import type { FileExplorerItem, TreeNode } from "../utils";

export type FileExplorerContext = {
  items: FileExplorerItem[];
  tree: TreeNode[];

  selectedId: string | null;
  selectedItem: FileExplorerItem | null;
  handleSelectItem: (id: string | null) => void;

  isExpanded: (id: string) => boolean;
  handleToggleExpand: (id: string) => void;

  createDraft: {
    type: "file" | "folder";
    parentId: string | null;
  } | null;
  handleStartCreate: (type: "file" | "folder") => void;
  handleCancelCreate: () => void;
  handleCreateItem: (name: string) => string | null;
  shouldShowCreateInputAt: (parentId: string | null) => boolean;
};

const initialState: FileExplorerContext = {
  items: [],
  tree: [],
  selectedId: null,
  selectedItem: null,
  handleSelectItem: () => {},
  isExpanded: () => false,
  handleToggleExpand: () => {},
  createDraft: null,
  handleStartCreate: () => {},
  handleCancelCreate: () => {},
  handleCreateItem: () => null,
  shouldShowCreateInputAt: () => false,
};

export const FileExplorerContext =
  createContext<FileExplorerContext>(initialState);
