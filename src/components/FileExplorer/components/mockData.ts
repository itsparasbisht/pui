import type { FileExplorerItem } from "../utils";

export const standardItems: FileExplorerItem[] = [
  { id: "1", name: "src", type: "folder", parentId: null },
  { id: "2", name: "components", type: "folder", parentId: "1" },
  { id: "3", name: "FileExplorer.tsx", type: "file", parentId: "2" },
  { id: "4", name: "FileExplorer.module.css", type: "file", parentId: "2" },
  { id: "5", name: "utils.ts", type: "file", parentId: "1" },
  { id: "6", name: "public", type: "folder", parentId: null },
  { id: "7", name: "favicon.ico", type: "file", parentId: "6" },
  { id: "8", name: "package.json", type: "file", parentId: null },
];

export const deepItems: FileExplorerItem[] = [
  { id: "1", name: "root", type: "folder", parentId: null },
  { id: "2", name: "level-1-folder", type: "folder", parentId: "1" },
  { id: "3", name: "level-2-folder", type: "folder", parentId: "2" },
  { id: "4", name: "level-3-folder", type: "folder", parentId: "3" },
  { id: "5", name: "level-4-folder", type: "folder", parentId: "4" },
  { id: "6", name: "deeply-nested-file.json", type: "file", parentId: "5" },
];

export const longNameItems: FileExplorerItem[] = [
  { id: "1", name: "extremely-long-folder-name-that-should-be-truncated-using-ellipsis-properly", type: "folder", parentId: null },
  { id: "2", name: "nested-file-with-excessively-long-filename-which-might-break-flexbox-if-not-configured-carefully.tsx", type: "file", parentId: "1" },
  { id: "3", name: "normal-file.txt", type: "file", parentId: null },
];
