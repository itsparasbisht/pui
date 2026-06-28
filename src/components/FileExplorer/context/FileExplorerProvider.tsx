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

  function handleStartCreate(
    type: "file" | "folder",
    targetParentId?: string | null,
  ) {
    let draftParentId: string | null;

    if (targetParentId !== undefined) {
      draftParentId = targetParentId;
    } else if (selectedItem && selectedItem.type === "folder") {
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
    setSelectedId(null);
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

  function handleDeleteItem(id: string) {
    const idsToDelete = new Set<string>([id]);
    let addedNew = true;
    while (addedNew) {
      addedNew = false;
      for (const item of items) {
        if (item.parentId && idsToDelete.has(item.parentId) && !idsToDelete.has(item.id)) {
          idsToDelete.add(item.id);
          addedNew = true;
        }
      }
    }

    const remainingItems = items.filter((item) => !idsToDelete.has(item.id));
    onItemsChange(remainingItems);

    if (selectedId && idsToDelete.has(selectedId)) {
      handleSelectItem(null);
    }
  }

  function handleRenameItem(id: string, name: string): string | null {
    const trimmedName = name.trim();
    const itemToRename = items.find((item) => item.id === id);
    if (!itemToRename) return "Item not found";

    if (itemToRename.name.trim().toLowerCase() === trimmedName.toLowerCase()) {
      return null;
    }

    const validationError = validateCreateItemName({
      name: trimmedName,
      parentId: itemToRename.parentId,
      items: items.filter((item) => item.id !== id),
    });

    if (validationError) return validationError;

    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, name: trimmedName } : item
    );
    onItemsChange(updatedItems);

    return null;
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
        handleDeleteItem,
        handleRenameItem,
      }}
    >
      {children}
    </FileExplorerContext.Provider>
  );
}
