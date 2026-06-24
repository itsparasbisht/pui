import { FileExplorerProvider } from "./context/FileExplorerProvider";
import { FileExplorerTree } from "./FileExplorerTree";
import type { FileExplorerItem } from "./utils";

export type FileExplorerProps = {
  items: FileExplorerItem[];
  onItemsChange: (items: FileExplorerItem[]) => void;

  selectedId?: string | null;
  onSelectionChange?: (item: FileExplorerItem | null) => void;

  expandedIds?: string[];
  onExpandedChange?: (expandedIds: string[]) => void;

  className?: string;
};

export function FileExplorer({
  items,
  onItemsChange,
  selectedId,
  onSelectionChange,
  expandedIds,
  onExpandedChange,
  className,
}: FileExplorerProps) {
  return (
    <>
      <FileExplorerProvider
        items={items}
        selectedId={selectedId}
        onSelectionChange={onSelectionChange}
        expandedIds={expandedIds}
        onExpandedChange={onExpandedChange}
      >
        <FileExplorerTree
          items={items}
          onItemsChange={onItemsChange}
          className={className}
        />
      </FileExplorerProvider>
    </>
  );
}
