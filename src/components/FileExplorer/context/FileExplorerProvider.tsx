import { useMemo, useState, type ReactNode } from "react";
import { FileExplorerContext } from "./FileExplorerContext";
import {
  buildTree,
  validateCreateItemName,
  createUniqueItemId,
  type TreeNode,
  type FileExplorerItem,
} from "../utils";
import type { BaseFileExplorerProps } from "../components/FileExplorer";

type FileExplorerProviderProps = {
  children: ReactNode;
} & Omit<BaseFileExplorerProps, "className"> & {
  onItemsChange: (items: FileExplorerItem[]) => void;
  readOnly?: boolean;
};

export function FileExplorerProvider({
  children,
  items,
  onItemsChange,
  onSelectionChange,
  expandedIds,
  onExpandedChange,
  icons,
  readOnly = false,
}: FileExplorerProviderProps) {
  const tree = useMemo(() => buildTree(items), [items]);

  const [createDraft, setCreateDraft] =
    useState<FileExplorerContext["createDraft"]>(null);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [internalExpandedIds, setInternalExpandedIds] = useState<string[]>([]);

  const currentExpandedIds = expandedIds ?? internalExpandedIds;

  const selectedItem = useMemo(() => {
    if (selectedId === null) return null;

    return items.find((item) => item.id === selectedId) ?? null;
  }, [items, selectedId]);

  const visibleNodes = useMemo(() => {
    const visible: TreeNode[] = [];
    function traverse(node: TreeNode) {
      visible.push(node);
      if (node.type === "folder" && currentExpandedIds.includes(node.id)) {
        node.children.forEach(traverse);
      }
    }
    tree.forEach(traverse);
    return visible;
  }, [tree, currentExpandedIds]);

  function handleSelectItem(id: string | null) {
    setSelectedId(id);
    if (id !== null) {
      setFocusedId(id);
    }

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

  function collapseItem(id: string) {
    if (!isExpanded(id)) return;

    setNextExpandedIds(currentExpandedIds.filter((expandedId) => expandedId !== id));
  }

  function handleKeyDown(e: React.KeyboardEvent, node: TreeNode) {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLButtonElement
    ) {
      return;
    }

    const currentIndex = visibleNodes.findIndex((n) => n.id === node.id);

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        if (currentIndex !== -1 && currentIndex < visibleNodes.length - 1) {
          setFocusedId(visibleNodes[currentIndex + 1].id);
        } else if (visibleNodes.length > 0) {
          setFocusedId(visibleNodes[0].id);
        }
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        if (currentIndex > 0) {
          setFocusedId(visibleNodes[currentIndex - 1].id);
        }
        break;
      }
      case "ArrowRight": {
        e.preventDefault();
        if (node.type === "folder") {
          if (!isExpanded(node.id)) {
            expandItem(node.id);
          } else if (node.children.length > 0) {
            setFocusedId(node.children[0].id);
          }
        }
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        if (node.type === "folder" && isExpanded(node.id)) {
          collapseItem(node.id);
        } else if (node.parentId !== null) {
          setFocusedId(node.parentId);
        }
        break;
      }
      case "Home": {
        e.preventDefault();
        if (visibleNodes.length > 0) {
          setFocusedId(visibleNodes[0].id);
        }
        break;
      }
      case "End": {
        e.preventDefault();
        if (visibleNodes.length > 0) {
          setFocusedId(visibleNodes[visibleNodes.length - 1].id);
        }
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        handleSelectItem(node.id);
        if (node.type === "folder") {
          handleToggleExpand(node.id);
        }
        break;
      }
      case "*": {
        e.preventDefault();
        if (node.type === "folder" || node.parentId !== null) {
          const siblings = items.filter(
            (item) => item.parentId === node.parentId && item.type === "folder"
          );
          const nextExpanded = [...currentExpandedIds];
          let changed = false;
          siblings.forEach((sibling) => {
            if (!nextExpanded.includes(sibling.id)) {
              nextExpanded.push(sibling.id);
              changed = true;
            }
          });
          if (changed) {
            setNextExpandedIds(nextExpanded);
          }
        }
        break;
      }
      default: {
        const key = e.key.toLowerCase();
        if (/^[a-zA-Z0-9]$/.test(key)) {
          e.preventDefault();
          const searchIndex = currentIndex === -1 ? 0 : currentIndex;
          const itemsToSearch = [
            ...visibleNodes.slice(searchIndex + 1),
            ...visibleNodes.slice(0, searchIndex + 1),
          ];
          const match = itemsToSearch.find((n) =>
            n.name.toLowerCase().startsWith(key)
          );
          if (match) {
            setFocusedId(match.id);
          }
        }
        break;
      }
    }
  }

  function handleStartCreate(
    type: "file" | "folder",
    targetParentId?: string | null,
  ) {
    if (readOnly) return;
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
    if (readOnly) return null;
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
    if (readOnly) return;
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
    if (readOnly) return null;
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
        visibleNodes,
        icons,
        readOnly,
        selectedId,
        selectedItem,
        handleSelectItem,
        focusedId,
        handleFocusItem: setFocusedId,
        isExpanded,
        handleToggleExpand,
        createDraft,
        handleStartCreate,
        handleCancelCreate,
        handleCreateItem,
        shouldShowCreateInputAt,
        handleDeleteItem,
        handleRenameItem,
        handleKeyDown,
      }}
    >
      {children}
    </FileExplorerContext.Provider>
  );
}
