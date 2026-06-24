import type { Meta, StoryObj } from "@storybook/react-vite";
import "../../styles/index.css";
import { FileExplorer } from "./FileExplorer";

const meta = {
  component: FileExplorer,
} satisfies Meta<typeof FileExplorer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
