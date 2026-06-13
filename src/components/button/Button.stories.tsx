import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";
import { Heart } from "lucide-react";
import "../../styles/index.css";

const meta = {
  component: Button,
  args: {
    children: "Hello UI",
  },
  argTypes: {
    children: {
      description: "Button content here",
      table: {
        type: { summary: "React.ReactNode" },
      },
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
    className: {
      description: "Additional CSS classes for custom styling",
      table: {
        type: { summary: "string" },
      },
    },
    variant: {
      control: "radio",
      options: ["primary", "secondary", "outline", "ghost", "link"],
      description: "Change button variant",
      table: {
        defaultValue: { summary: "primary" },
        type: { summary: "primary | secondary | outline | ghost | link" },
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

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

export const WithIcon: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Button>
        <Heart size={18} /> Like
      </Button>
      <Button variant="outline">
        <Heart size={18} />
      </Button>
    </div>
  ),
};
