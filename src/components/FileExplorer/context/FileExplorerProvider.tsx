import { useMemo, useState, type ReactNode } from "react";
import { FileExplorerContext } from "./FileExplorerContext";
import { buildTree, generateId, type FileExplorerItem } from "../utils";
import type { FileExplorerProps } from "../components/FileExplorer";

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

  const [createDraft, setCreateDraft] =
    useState<FileExplorerContext["createDraft"]>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedItem = useMemo(() => {
    if (selectedId === null) return null;

    return items.find((item) => item.id === selectedId) ?? null;
  }, [items, selectedId]);

  function handleSelectItem(id: string | null) {
    setSelectedId(id);

    const item = id ? (items.find((item) => item.id === id) ?? null) : null;

    onSelectionChange?.(item);
  }

  function handleStartCreate(type: "file" | "folder") {
    if (type === "file") {
      setCreateDraft({ type: "file", parentId: null });
    } else {
      setCreateDraft({ type: "folder", parentId: null });
    }
  }

  function handleCreateItem(name: string) {
    const newId = getNextId().toString();

    if (createDraft) {
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
  }

  return (
    <FileExplorerContext.Provider
      value={{
        items,
        tree,
        selectedId,
        selectedItem,
        handleSelectItem,
        // expandedIds,
        // isExpanded,
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
