import { File, Folder, MoreVertical } from "lucide-react";
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
  } = useContext(FileExplorerContext);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
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

  return (
    <div style={{ marginLeft: node.parentId === null ? 0 : "20px" }}>
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
              <div className={styles.itemContent}>
                <Folder /> <span>{node.name}</span>
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
                  </div>
                )}
              </div>
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
            <div className={styles.itemContent}>
              <File /> <span>{node.name}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
