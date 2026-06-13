import { useState } from "react";

type AddItemInputProps = {
  onEnterItem: (name: string) => void;
};

export function AddItemInput({ onEnterItem }: AddItemInputProps) {
  const [inputValue, setInputValue] = useState("");

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onEnterItem(inputValue);
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
      />
    </div>
  );
}
