import { useContext, useState } from "react";
import { FileExplorerContext } from "../context/FileExplorerContext";
import { Folder, File } from "lucide-react";
import styles from "./AddItemInput.module.css";

export function AddItemInput() {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { handleCreateItem, handleCancelCreate, createDraft } =
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
        {createDraft?.type === "folder" ? (
          <Folder size={16} className={styles.icon} />
        ) : (
          <File size={16} className={styles.icon} />
        )}
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
