import { useContext, useState } from "react";
import { FileExplorerContext } from "../context/FileExplorerContext";

export function AddItemInput() {
  const [inputValue, setInputValue] = useState("");

  const { handleCreateItem } = useContext(FileExplorerContext);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleCreateItem(inputValue);
      setInputValue("");
    }
  }

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    </div>
  );
}
