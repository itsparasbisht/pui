import { useState } from "react";
import type { TreeNode } from "./utils";

type AddItemInputProps = {
  onAddItem: (name: string) => void;
  currentNode: TreeNode | null;
};

export function AddItemInput({ onAddItem, currentNode }: AddItemInputProps) {
  const [inputValue, setInputValue] = useState("");

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onAddItem(inputValue);
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
        style={{
          marginLeft: currentNode === null ? 0 : "30px",
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        autoFocus
      />
    </div>
  );
}
