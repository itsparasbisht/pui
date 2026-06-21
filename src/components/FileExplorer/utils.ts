export type ItemType = "folder" | "file";

export type ExplorerData = {
  id: number;
  name: string;
  type: ItemType;
  parentId: number | null;
};

export function generateId() {
  let id = 0;

  return function () {
    return id++;
  };
}

export type TreeNode = {
  children: TreeNode[];
} & ExplorerData;

export function buildTree(items: ExplorerData[]) {
  const mappedItems: Record<number, TreeNode> = {};

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
