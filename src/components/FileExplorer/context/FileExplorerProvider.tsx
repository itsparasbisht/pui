import { useMemo, useState, type ReactNode } from "react";
import { FileExplorerContext } from "./FileExplorerContext";
import {
  buildTree,
  validateCreateItemName,
  createUniqueItemId,
} from "../utils";
import type { FileExplorerProps } from "../components/FileExplorer";

type FileExplorerProviderProps = {
  children: ReactNode;
} & Omit<FileExplorerProps, "className">;

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
  const [internalExpandedIds, setInternalExpandedIds] = useState<string[]>([]);

  const currentExpandedIds = expandedIds ?? internalExpandedIds;

  const selectedItem = useMemo(() => {
    if (selectedId === null) return null;

    return items.find((item) => item.id === selectedId) ?? null;
  }, [items, selectedId]);

  function handleSelectItem(id: string | null) {
    setSelectedId(id);

    const item = id ? (items.find((item) => item.id === id) ?? null) : null;

    onSelectionChange?.(item);
  }

  function setNextExpandedIds(nextExpandedIds: string[]) {
    if (expandedIds === undefined) {
      setInternalExpandedIds(nextExpandedIds);
    }

    onExpandedChange?.(nextExpandedIds);
  }

  function isExpanded(id: string) {
    return currentExpandedIds.includes(id);
  }

  function handleToggleExpand(id: string) {
    const nextExpandedIds = isExpanded(id)
      ? currentExpandedIds.filter((expandedId) => expandedId !== id)
      : [...currentExpandedIds, id];

    setNextExpandedIds(nextExpandedIds);
  }

  function expandItem(id: string) {
    if (isExpanded(id)) return;

    setNextExpandedIds([...currentExpandedIds, id]);
  }

  function handleStartCreate(type: "file" | "folder") {
    let draftParentId: string | null;

    if (selectedItem && selectedItem.type === "folder") {
      draftParentId = selectedItem.id;
    } else {
      draftParentId = selectedItem ? selectedItem.parentId : null;
    }

    setCreateDraft({ type, parentId: draftParentId });

    if (draftParentId !== null) {
      expandItem(draftParentId);
    }
  }

  function handleCancelCreate() {
    setCreateDraft(null);
  }

  function handleCreateItem(name: string) {
    const trimmedName = name.trim();

    if (!createDraft) return null;

    const validationError = validateCreateItemName({
      name: trimmedName,
      parentId: createDraft.parentId,
      items,
    });

    if (validationError) return validationError;

    const newId = createUniqueItemId(items.length);

    onItemsChange([
      ...items,
      {
        id: newId,
        name: trimmedName,
        type: createDraft.type,
        parentId: createDraft.parentId,
      },
    ]);

    setCreateDraft(null);

    return null;
  }

  function shouldShowCreateInputAt(parentId: string | null) {
    return createDraft?.parentId === parentId;
  }

  return (
    <FileExplorerContext.Provider
      value={{
        items,
        tree,
        selectedId,
        selectedItem,
        handleSelectItem,
        isExpanded,
        handleToggleExpand,
        createDraft,
        handleStartCreate,
        handleCancelCreate,
        handleCreateItem,
        shouldShowCreateInputAt,
      }}
    >
      {children}
    </FileExplorerContext.Provider>
  );
}
