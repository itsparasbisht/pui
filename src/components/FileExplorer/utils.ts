export type ItemType = "folder" | "file";

export type ExplorerData = {
  id: number;
  name: string;
  type: ItemType;
  parentId: number | null;
};

export function generateId() {
  let id = 7;

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

  items.forEach((item) => (mappedItems[item.id] = { ...item, children: [] }));

  items.forEach((item) => {
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
