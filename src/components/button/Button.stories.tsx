import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";
import "../../styles/index.css";

const meta = {
  component: Button,
  args: {
    children: "Hello UI",
  },
  argTypes: {
    children: {
      description: "Button content here",
    },
    size: {
      control: "radio",
      options: ["sm", "md", "lg"],
      description: "Change button size",
      table: {
        defaultValue: { summary: "md" },
        type: { summary: "sm | md | lg" },
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <div data-pui-theme="dark">
        <Story />
      </div>
    ),
  ],
};
