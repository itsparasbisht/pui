import { useContext, useState } from "react";
import { FileExplorerContext } from "../context/FileExplorerContext";

export function AddItemInput() {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const { handleCreateItem, handleCancelCreate } =
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
    <div onClick={(e) => e.stopPropagation()}>
      <input
        type="text"
        aria-label="Item name"
        aria-invalid={error !== null}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
        onKeyDown={handleKeyDown}
        autoFocus
      />
      {error && <div role="alert">{error}</div>}
    </div>
  );
}
