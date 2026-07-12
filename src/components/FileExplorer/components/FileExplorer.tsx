import { FileExplorerProvider } from "../context/FileExplorerProvider";
import { FileExplorerTree } from "./FileExplorerTree";
import type { FileExplorerItem, FileExplorerIcons } from "../utils";

export type BaseFileExplorerProps = {
  items: FileExplorerItem[];
  onSelectionChange?: (item: FileExplorerItem | null) => void;

  expandedIds?: string[];
  onExpandedChange?: (expandedIds: string[]) => void;

  className?: string;
  theme?: "light" | "dark";
  icons?: FileExplorerIcons;
};

export type ReadWriteFileExplorerProps = BaseFileExplorerProps & {
  readOnly?: false;
  onItemsChange: (items: FileExplorerItem[]) => void;
};

export type ReadOnlyFileExplorerProps = BaseFileExplorerProps & {
  readOnly: true;
  onItemsChange?: (items: FileExplorerItem[]) => void;
};

export type FileExplorerProps = ReadWriteFileExplorerProps | ReadOnlyFileExplorerProps;

export function FileExplorer({
  items,
  onItemsChange,
  onSelectionChange,
  expandedIds,
  onExpandedChange,
  className,
  theme = "dark",
  icons,
  readOnly = false,
}: FileExplorerProps) {
  return (
    <>
      <FileExplorerProvider
        items={items}
        onItemsChange={onItemsChange ?? (() => {})}
        onSelectionChange={onSelectionChange}
        expandedIds={expandedIds}
        onExpandedChange={onExpandedChange}
        icons={icons}
        readOnly={readOnly}
      >
        <FileExplorerTree className={className} theme={theme} />
      </FileExplorerProvider>
    </>
  );
}
