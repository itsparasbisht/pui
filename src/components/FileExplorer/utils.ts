export type ExplorerData = {
  id: number;
  name: string;
  type: "folder" | "file";
  parentId: number | null;
};

export function generateId() {
  let id = 0;

  return function () {
    return id++;
  };
}
