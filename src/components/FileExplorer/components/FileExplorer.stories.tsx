import type { Meta, StoryObj } from "@storybook/react-vite";
import "../../../styles/index.css";
import { FileExplorer } from "./FileExplorer";
import { useState } from "react";
import type { FileExplorerItem } from "../utils";

const meta = {
  title: "components/FileExplorer",
  component: FileExplorer,
  args: {
    items: [],
    onItemsChange: () => {},
  },
} satisfies Meta<typeof FileExplorer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [items, setItems] = useState<FileExplorerItem[]>([]);

    return <FileExplorer items={items} onItemsChange={setItems} />;
  },
};
