import { File, Folder, MoreVertical, ChevronRight, FolderOpen } from "lucide-react";
import { type TreeNode } from "../utils";
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
  } = useContext(FileExplorerContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(node.name);
  const [renameError, setRenameError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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

  const isSelected = selectedId === node.id;
  const isFolder = node.type === "folder";

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
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSelectItem(node.id);
                handleToggleExpand(node.id);
                if (createDraft) {
                  handleCancelCreate();
                }
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
                    {isExpanded(node.id) ? <FolderOpen size={16} /> : <Folder size={16} />}
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
                  <div className={styles.itemContent}>
                    <ChevronRight className={`${styles.chevron} ${isExpanded(node.id) ? styles.chevronExpanded : ""}`} size={14} />
                    {isExpanded(node.id) ? <FolderOpen size={16} /> : <Folder size={16} />}
                    <span className={styles.itemName}>{node.name}</span>
                  </div>
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
                </>
              )}
            </summary>

            {shouldShowCreateInputAt(node.id) && <AddItemInput />}

            {node.children.map((child) => (
              <ItemNode key={child.id} node={child} />
            ))}
          </details>
        )}

        {!isFolder && (
          <div
            className={`${styles.item} ${isSelected && styles.selectedItem}`}
            onClick={(e) => {
              e.stopPropagation();
              handleSelectItem(node.id);
              if (createDraft) {
                handleCancelCreate();
              }
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
                  <File size={16} />
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
                <div className={styles.itemContent}>
                  <div className={styles.spacer} />
                  <File size={16} /> <span className={styles.itemName}>{node.name}</span>
                </div>
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
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
