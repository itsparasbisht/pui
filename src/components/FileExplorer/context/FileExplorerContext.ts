import { createContext } from "react";
import type { FileExplorerItem, TreeNode, FileExplorerIcons } from "../utils";

export type FileExplorerContext = {
  items: FileExplorerItem[];
  tree: TreeNode[];
  visibleNodes: TreeNode[];
  icons?: FileExplorerIcons;
  readOnly: boolean;

  selectedId: string | null;
  selectedItem: FileExplorerItem | null;
  handleSelectItem: (id: string | null) => void;

  focusedId: string | null;
  handleFocusItem: (id: string | null) => void;

  isExpanded: (id: string) => boolean;
  handleToggleExpand: (id: string) => void;

  createDraft: {
    type: "file" | "folder";
    parentId: string | null;
  } | null;
  handleStartCreate: (type: "file" | "folder", targetParentId?: string | null) => void;
  handleCancelCreate: () => void;
  handleCreateItem: (name: string) => string | null;
  shouldShowCreateInputAt: (parentId: string | null) => boolean;
  handleDeleteItem: (id: string) => void;
  handleRenameItem: (id: string, name: string) => string | null;

  handleKeyDown: (e: React.KeyboardEvent, node: TreeNode) => void;
};

const initialState: FileExplorerContext = {
  items: [],
  tree: [],
  visibleNodes: [],
  icons: undefined,
  readOnly: false,
  selectedId: null,
  selectedItem: null,
  handleSelectItem: () => {},
  focusedId: null,
  handleFocusItem: () => {},
  isExpanded: () => false,
  handleToggleExpand: () => {},
  createDraft: null,
  handleStartCreate: () => {},
  handleCancelCreate: () => {},
  handleCreateItem: () => null,
  shouldShowCreateInputAt: () => false,
  handleDeleteItem: () => {},
  handleRenameItem: () => null,
  handleKeyDown: () => {},
};

export const FileExplorerContext =
  createContext<FileExplorerContext>(initialState);
