import type { Meta, StoryObj } from "@storybook/react-vite";
import { FileExplorer } from "./FileExplorer";
import "../../styles/index.css";

const meta = {
  component: FileExplorer,
} satisfies Meta<typeof FileExplorer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
