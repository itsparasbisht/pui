import type { Meta, StoryObj } from "@storybook/react-vite";
import "../../styles/index.css";
import { FileEx } from "./FileEx";

const meta = {
  component: FileEx,
} satisfies Meta<typeof FileEx>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
