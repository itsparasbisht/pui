import { FileExplorerProvider } from "../context/FileExplorerProvider";
import { FileExplorerTree } from "./FileExplorerTree";
import type { FileExplorerItem } from "../utils";

export type FileExplorerProps = {
  items: FileExplorerItem[];
  onItemsChange: (items: FileExplorerItem[]) => void;
  onSelectionChange?: (item: FileExplorerItem | null) => void;

  expandedIds?: string[];
  onExpandedChange?: (expandedIds: string[]) => void;

  className?: string;
};

export function FileExplorer({
  items,
  onItemsChange,
  onSelectionChange,
  expandedIds,
  onExpandedChange,
}: FileExplorerProps) {
  return (
    <>
      <FileExplorerProvider
        items={items}
        onItemsChange={onItemsChange}
        onSelectionChange={onSelectionChange}
        expandedIds={expandedIds}
        onExpandedChange={onExpandedChange}
      >
        <FileExplorerTree />
      </FileExplorerProvider>
    </>
  );
}
