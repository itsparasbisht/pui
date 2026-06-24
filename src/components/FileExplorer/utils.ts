export type ItemType = "folder" | "file";

export type FileExplorerItem = {
  id: string;
  name: string;
  type: "folder" | "file";
  parentId: string | null;
};

export function generateId() {
  let id = 0;

  return function () {
    return id++;
  };
}

export type TreeNode = {
  children: TreeNode[];
} & FileExplorerItem;

export function buildTree(items: FileExplorerItem[]) {
  const mappedItems: Record<string, TreeNode> = {};

  const tree: TreeNode[] = [];

  const sortedItems = items.sort((a, b) => {
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
