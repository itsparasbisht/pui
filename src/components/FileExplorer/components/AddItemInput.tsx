import { useContext, useState } from "react";
import { FileExplorerContext } from "../context/FileExplorerContext";
import { resolveIcon } from "../utils";
import styles from "./AddItemInput.module.css";

export function AddItemInput() {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { handleCreateItem, handleCancelCreate, createDraft, icons } =
    useContext(FileExplorerContext);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const errorMessage = handleCreateItem(inputValue);

      if (errorMessage) {
        setError(errorMessage);
        return;
      }

      setInputValue("");
      setError(null);
    }

    if (e.key === "Escape") {
      handleCancelCreate();
    }
  }

  return (
    <div className={styles.container} onClick={(e) => e.stopPropagation()}>
      <div className={styles.inputWrapper}>
        <div className={styles.spacer} />
        <span
          className={`${styles.iconWrapper} pui-item-icon ${
            createDraft?.type === "folder" ? "pui-folder-icon" : "pui-file-icon"
          }`}
        >
          {resolveIcon({
            name: inputValue,
            type: createDraft?.type ?? "file",
            isExpanded: false,
            icons,
          })}
        </span>
        <div className={styles.inputContainer}>
          <input
            type="text"
            className={styles.input}
            aria-label="Item name"
            aria-invalid={error !== null}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleCancelCreate}
            autoFocus
          />
          {error && <div className={styles.error} role="alert">{error}</div>}
        </div>
      </div>
    </div>
  );
}
