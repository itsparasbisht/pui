import { useMemo, useState, type ReactNode } from "react";
import { FileExplorerContext } from "./FileExplorerContext";
import { buildTree, generateId } from "../utils";
import type { FileExplorerProps } from "../FileExplorer";

type FileExplorerProviderProps = {
  children: ReactNode;
} & Omit<FileExplorerProps, "className">;

const getNextId = generateId();

export function FileExplorerProvider({
  children,
  items,
  onItemsChange,
  onSelectionChange,
  expandedIds,
  onExpandedChange,
}: FileExplorerProviderProps) {
  const tree = useMemo(() => buildTree(items), [items]);

  const [createDraft, setCreateDraft] = useState<
    FileExplorerContext["createDraft"]
  >({ type: "folder", parentId: null });

  const [selectedId, setSelectedId] = useState(null);

  function handleStartCreate(type: "file" | "folder") {
    if (type === "file") {
      setCreateDraft({ type: "file", parentId: null });
    } else {
      setCreateDraft({ type: "folder", parentId: null });
    }
  }

  function handleCreateItem(name: string) {
    const newId = getNextId().toString();

    onItemsChange([
      ...items,
      {
        id: newId,
        name,
        type: createDraft?.type,
        parentId: createDraft?.parentId,
      },
    ]);
  }

  return (
    <FileExplorerContext.Provider
      value={{
        items,
        tree,
        selectedId,
        // selectedItem,
        // handleSelectItem,
        // expandedIds,
        // handleToggleExpand,
        createDraft,
        handleStartCreate,
        handleCreateItem,
      }}
    >
      {children}
    </FileExplorerContext.Provider>
  );
}
