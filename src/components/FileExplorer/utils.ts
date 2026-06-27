export type ItemType = "folder" | "file";

export type FileExplorerItem = {
  id: string;
  name: string;
  type: "folder" | "file";
  parentId: string | null;
};

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
