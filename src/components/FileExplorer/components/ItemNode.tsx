import { MoreVertical, ChevronRight } from "lucide-react";
import { type TreeNode, resolveIcon } from "../utils";
import styles from "./ItemNode.module.css";
import { useContext, useState, useRef, useEffect } from "react";
import { FileExplorerContext } from "../context/FileExplorerContext";
import { AddItemInput } from "./AddItemInput";

type ItemNodeProps = {
  node: TreeNode;
};

export function ItemNode({ node }: ItemNodeProps) {
  const {
    createDraft,
    selectedId,
    handleSelectItem,
    handleCancelCreate,
    isExpanded,
    handleToggleExpand,
    shouldShowCreateInputAt,
    handleStartCreate,
    handleDeleteItem,
    handleRenameItem,
    focusedId,
    handleFocusItem,
    visibleNodes,
    handleKeyDown,
    icons,
    readOnly,
  } = useContext(FileExplorerContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(node.name);
  const [renameError, setRenameError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const elementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (focusedId === node.id && elementRef.current) {
      elementRef.current.focus();
    }
  }, [focusedId, node.id]);

  const isSelected = selectedId === node.id;
  const isFolder = node.type === "folder";

  const nodeIcon = (
    <span
      className={`${styles.iconWrapper} pui-item-icon ${
        isFolder
          ? `${styles.folderIcon} pui-folder-icon`
          : `${styles.fileIcon} pui-file-icon`
      }`}
    >
      {resolveIcon({
        name: node.name,
        type: node.type,
        isExpanded: isExpanded(node.id),
        icons,
      })}
    </span>
  );

  const isFirstVisibleNode = visibleNodes.length > 0 && visibleNodes[0].id === node.id;
  const isTabFocusable =
    focusedId === node.id ||
    (focusedId === null &&
      (selectedId === node.id || (selectedId === null && isFirstVisibleNode)));
  const tabIndex = isTabFocusable ? 0 : -1;

  function submitRename() {
    const error = handleRenameItem(node.id, renameValue);
    if (error) {
      setRenameError(error);
      return false;
    }
    setIsRenaming(false);
    setRenameError(null);
    return true;
  }

  function handleRenameKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.stopPropagation();
      submitRename();
    }
    if (e.key === "Escape") {
      e.stopPropagation();
      setIsRenaming(false);
      setRenameValue(node.name);
      setRenameError(null);
    }
  }

  function handleRenameBlur() {
    const trimmed = renameValue.trim();
    if (trimmed === node.name.trim()) {
      setIsRenaming(false);
      setRenameError(null);
      return;
    }
    const error = handleRenameItem(node.id, renameValue);
    setIsRenaming(false);
    setRenameError(null);
    if (error) {
      setRenameValue(node.name);
    }
  }

  return (
    <div style={{ marginLeft: node.parentId === null ? 0 : "16px" }}>
      <div>
        {isFolder && (
          <details open={isExpanded(node.id)}>
            <summary
              ref={elementRef as React.RefObject<HTMLElement>}
              tabIndex={tabIndex}
              role="treeitem"
              aria-selected={isSelected}
              aria-expanded={isExpanded(node.id)}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSelectItem(node.id);
                handleToggleExpand(node.id);
                if (createDraft) {
                  handleCancelCreate();
                }
              }}
              onKeyDown={(e) => handleKeyDown(e, node)}
              onFocus={(e) => {
                e.stopPropagation();
                handleFocusItem(node.id);
              }}
              className={`${styles.item} ${isSelected && styles.selectedItem}`}
            >
              {isRenaming ? (
                <div
                  className={styles.renameContainer}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                >
                  <div className={styles.renameRow}>
                    <ChevronRight className={`${styles.chevron} ${isExpanded(node.id) ? styles.chevronExpanded : ""}`} size={14} />
                    {nodeIcon}
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onKeyDown={handleRenameKeyDown}
                      onBlur={handleRenameBlur}
                      className={styles.renameInput}
                      autoFocus
                    />
                  </div>
                  {renameError && (
                    <div className={styles.renameError} role="alert">
                      {renameError}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className={styles.itemContent} title={node.name}>
                    <ChevronRight className={`${styles.chevron} ${isExpanded(node.id) ? styles.chevronExpanded : ""}`} size={14} />
                    {nodeIcon}
                    <span className={styles.itemName}>{node.name}</span>
                  </div>
                  {!readOnly && (
                    <div className={styles.menuContainer} ref={menuRef}>
                      <button
                        type="button"
                        className={`${styles.menuButton} ${isMenuOpen ? styles.menuButtonOpen : ""}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setIsMenuOpen((prev) => !prev);
                        }}
                        aria-label="More options"
                      >
                        <MoreVertical size={16} />
                      </button>
                      {isMenuOpen && (
                        <div className={styles.dropdownMenu}>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleStartCreate("file", node.id);
                              setIsMenuOpen(false);
                            }}
                          >
                            Add File
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleStartCreate("folder", node.id);
                              setIsMenuOpen(false);
                            }}
                          >
                            Add Folder
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              setRenameValue(node.name);
                              setIsRenaming(true);
                              setIsMenuOpen(false);
                            }}
                          >
                            Rename
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              handleDeleteItem(node.id);
                              setIsMenuOpen(false);
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </summary>

            {shouldShowCreateInputAt(node.id) && <AddItemInput />}

            <div role="group">
              {node.children.map((child) => (
                <ItemNode key={child.id} node={child} />
              ))}
            </div>
          </details>
        )}

        {!isFolder && (
          <div
            ref={elementRef as React.RefObject<HTMLDivElement>}
            tabIndex={tabIndex}
            role="treeitem"
            aria-selected={isSelected}
            className={`${styles.item} ${isSelected && styles.selectedItem}`}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectItem(node.id);
              if (createDraft) {
                handleCancelCreate();
              }
            }}
            onKeyDown={(e) => handleKeyDown(e, node)}
            onFocus={(e) => {
              e.stopPropagation();
              handleFocusItem(node.id);
            }}
          >
            {isRenaming ? (
              <div
                className={styles.renameContainer}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <div className={styles.renameRow}>
                  <div className={styles.spacer} />
                  {nodeIcon}
                  <input
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={handleRenameKeyDown}
                    onBlur={handleRenameBlur}
                    className={styles.renameInput}
                    autoFocus
                  />
                </div>
                {renameError && (
                  <div className={styles.renameError} role="alert">
                    {renameError}
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className={styles.itemContent} title={node.name}>
                  <div className={styles.spacer} />
                  {nodeIcon} <span className={styles.itemName}>{node.name}</span>
                </div>
                {!readOnly && (
                  <div className={styles.menuContainer} ref={menuRef}>
                    <button
                      type="button"
                      className={`${styles.menuButton} ${isMenuOpen ? styles.menuButtonOpen : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setIsMenuOpen((prev) => !prev);
                      }}
                      aria-label="More options"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {isMenuOpen && (
                      <div className={styles.dropdownMenu}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setRenameValue(node.name);
                            setIsRenaming(true);
                            setIsMenuOpen(false);
                          }}
                        >
                          Rename
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            handleDeleteItem(node.id);
                            setIsMenuOpen(false);
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
