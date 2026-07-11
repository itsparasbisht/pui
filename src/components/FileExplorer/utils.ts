import React, { type ReactNode } from "react";
import { Folder, FolderOpen, File } from "lucide-react";

export type ItemType = "folder" | "file";

export type FileExplorerItem = {
  id: string;
  name: string;
  type: "folder" | "file";
  parentId: string | null;
};

export type FileExplorerIcons = {
  file?: ReactNode;
  folderClosed?: ReactNode;
  folderOpen?: ReactNode;
  nameMap?: Record<string, ReactNode>;
  extensionMap?: Record<string, ReactNode>;
};

export function getFileExtension(name: string): string {
  const dotIndex = name.lastIndexOf(".");
  if (dotIndex <= 0) return "";
  return name.slice(dotIndex + 1).toLowerCase();
}

export function resolveIcon({
  name,
  type,
  isExpanded = false,
  icons,
}: {
  name: string;
  type: "folder" | "file";
  isExpanded?: boolean;
  icons?: FileExplorerIcons;
}): ReactNode {
  const isFolder = type === "folder";
  const normalizedName = name.trim();

  if (isFolder) {
    if (normalizedName && icons?.nameMap && normalizedName in icons.nameMap) {
      return icons.nameMap[normalizedName];
    }
    if (isExpanded) {
      return icons?.folderOpen ?? React.createElement(FolderOpen, { size: 16 });
    }
    return icons?.folderClosed ?? React.createElement(Folder, { size: 16 });
  } else {
    if (normalizedName && icons?.nameMap && normalizedName in icons.nameMap) {
      return icons.nameMap[normalizedName];
    }
    const ext = getFileExtension(normalizedName);
    if (ext && icons?.extensionMap && ext in icons.extensionMap) {
      return icons.extensionMap[ext];
    }
    return icons?.file ?? React.createElement(File, { size: 16 });
  }
}

export type CreateItemNameValidationParams = {
  name: string;
  parentId: string | null;
  items: FileExplorerItem[];
};

const MAX_ITEM_NAME_LENGTH = 255;

export function validateCreateItemName({
  name,
  parentId,
  items,
}: CreateItemNameValidationParams) {
  const normalizedName = name.trim();

  if (normalizedName.length === 0) {
    return "Name is required";
  }

  if (normalizedName.length > MAX_ITEM_NAME_LENGTH) {
    return `Name must be ${MAX_ITEM_NAME_LENGTH} characters or fewer`;
  }

  if (/[\\/:*?"<>|]/.test(normalizedName)) {
    return 'Name cannot contain \\ / : * ? " < > or |';
  }

  const hasControlCharacter = Array.from(normalizedName).some(
    (character) => character.charCodeAt(0) <= 31,
  );

  if (hasControlCharacter) {
    return "Name cannot contain control characters";
  }

  if (/[. ]$/.test(normalizedName)) {
    return "Name cannot end with a space or period";
  }

  const hasDuplicateSibling = items.some(
    (item) =>
      item.parentId === parentId &&
      item.name.trim().toLowerCase() === normalizedName.toLowerCase(),
  );

  if (hasDuplicateSibling) {
    return "An item with this name already exists";
  }

  return null;
}

export function createUniqueItemId(totalItems: number) {
  return `pui-${Date.now().toString(36)}-${totalItems.toString(36)}`;
}

export type TreeNode = {
  children: TreeNode[];
} & FileExplorerItem;

export function buildTree(items: FileExplorerItem[]) {
  const mappedItems: Record<string, TreeNode> = {};

  const tree: TreeNode[] = [];

  const sortedItems = [...items].sort((a, b) => {
    if (a.type === "folder" && b.type === "file") {
      return -1;
    } else if (a.type === "file" && b.type === "folder") {
      return 1;
    } else {
      return a.name > b.name ? 1 : -1;
    }
  });

  sortedItems.forEach(
    (item) => (mappedItems[item.id] = { ...item, children: [] }),
  );

  sortedItems.forEach((item) => {
    if (item.parentId === null) {
      tree.push(mappedItems[item.id]);
    } else {
      const parent = mappedItems[item.parentId];

      if (parent) {
        parent.children?.push(mappedItems[item.id]);
      }
    }
  });

  return tree;
}
