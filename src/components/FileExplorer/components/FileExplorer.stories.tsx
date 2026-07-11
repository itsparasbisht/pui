import type { Meta, StoryObj } from "@storybook/react-vite";
import "../../../styles/index.css";
import { FileExplorer } from "./FileExplorer";
import { useState } from "react";
import type { FileExplorerItem } from "../utils";
import { standardItems, deepItems, longNameItems } from "./mockData";

const meta = {
  title: "Components/FileExplorer",
  component: FileExplorer,
  parameters: {
    docs: {
      description: {
        component: `
\`FileExplorer\` is a production-ready, interactive tree component for managing files and folders.

### Key Features
- **File & Folder Creation:** Add new files or folders via the header toolbar or nested context menus.
- **Selection:** Interactive selection of files and folders, triggering events with selected item details.
- **Expansion / Collapse:** Supports uncontrolled or fully controlled folder expansion state.
- **Validation:** Built-in naming validation (prevents duplicates in the same directory, invalid characters, trailing dots/spaces).
- **Themes:** Supports \`light\` and \`dark\` modes natively.
- **Context Actions:** Built-in context menu for nested operations (Add file/folder inside, rename, delete).
- **Custom Icons Mapping:** Override default folder/file icons, target specific file extensions (e.g. \`.ts\`, \`.css\`), or map exact filenames (e.g. \`package.json\`). Custom icons automatically scale and align correctly, maintaining explorer indentation.
        `,
      },
    },
  },
  argTypes: {
    theme: {
      control: "radio",
      options: ["light", "dark"],
      description: "Color theme for the file explorer UI",
      table: {
        defaultValue: { summary: "dark" },
      },
    },
    items: {
      description:
        "Array of file explorer items matching the flat FileExplorerItem type",
    },
    expandedIds: {
      control: "object",
      description: "Controlled array of expanded folder item IDs",
    },
    onItemsChange: {
      description: "Callback fired when items are added, renamed, or deleted",
      action: "itemsChanged",
    },
    onSelectionChange: {
      description: "Callback fired when selection changes",
      action: "selectionChanged",
    },
    onExpandedChange: {
      description: "Callback fired when folders are expanded or collapsed",
      action: "expandedChanged",
    },
    className: {
      control: "text",
      description: "Custom CSS class applied to the root container",
    },
    icons: {
      control: "object",
      description: "Custom file and folder icons configuration (mappings for extensions, names, and defaults)",
      table: {
        type: { summary: "FileExplorerIcons" },
      },
    },
  },
  args: {
    items: [],
    onItemsChange: () => {},
  },
} satisfies Meta<typeof FileExplorer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The default configuration of the File Explorer, seeded with a standard Workspace structure. Interactive controls allow adding, renaming, and deleting items.",
      },
    },
  },
  render: () => {
    const [items, setItems] = useState<FileExplorerItem[]>(standardItems);
    const [expandedIds, setExpandedIds] = useState<string[]>(["1", "2"]);

    return (
      <div
        style={{ padding: "20px", height: "500px" }}
      >
        <FileExplorer
          items={items}
          onItemsChange={setItems}
          expandedIds={expandedIds}
          onExpandedChange={setExpandedIds}
          theme="dark"
        />
      </div>
    );
  },
};

export const EmptyState: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates the blank state when no files or folders exist in the workspace. Useful for first-time usage guides. Includes call-to-actions to create files/folders.",
      },
    },
  },
  render: () => {
    const [items, setItems] = useState<FileExplorerItem[]>([]);
    const [expandedIds, setExpandedIds] = useState<string[]>([]);

    return (
      <div
        style={{ padding: "20px", height: "400px" }}
      >
        <FileExplorer
          items={items}
          onItemsChange={setItems}
          expandedIds={expandedIds}
          onExpandedChange={setExpandedIds}
          theme="dark"
        />
      </div>
    );
  },
};

export const Themes: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "The file explorer supports both Light and Dark themes via the `theme` prop. Under the hood, this sets the `data-pui-theme` attribute, applying variables from our global design tokens.",
      },
    },
  },
  render: () => {
    const [items, setItems] = useState<FileExplorerItem[]>(standardItems);
    const [expandedIds, setExpandedIds] = useState<string[]>(["1", "2"]);

    return (
      <div
        style={{
          display: "flex",
          gap: "40px",
          padding: "20px",
          background: "var(--pui-color-surface)",
          borderRadius: "8px",
          height: "500px",
        }}
      >
        <div>
          <h4
            style={{
              color: "var(--pui-color-text)",
              marginBottom: "12px",
              textAlign: "center",
            }}
          >
            Light Theme
          </h4>
          <FileExplorer
            items={items}
            onItemsChange={setItems}
            expandedIds={expandedIds}
            onExpandedChange={setExpandedIds}
            theme="light"
          />
        </div>
        <div>
          <h4
            style={{
              color: "var(--pui-color-text)",
              marginBottom: "12px",
              textAlign: "center",
            }}
          >
            Dark Theme
          </h4>
          <FileExplorer
            items={items}
            onItemsChange={setItems}
            expandedIds={expandedIds}
            onExpandedChange={setExpandedIds}
            theme="dark"
          />
        </div>
      </div>
    );
  },
};

export const DeepNesting: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Demonstrates indentation and Chevron scaling when nesting folders several layers deep.",
      },
    },
  },
  render: () => {
    const [items, setItems] = useState<FileExplorerItem[]>(deepItems);
    const [expandedIds, setExpandedIds] = useState<string[]>([
      "1",
      "2",
      "3",
      "4",
      "5",
    ]);

    return (
      <div
        style={{ padding: "20px", height: "500px" }}
      >
        <FileExplorer
          items={items}
          onItemsChange={setItems}
          expandedIds={expandedIds}
          onExpandedChange={setExpandedIds}
          theme="dark"
        />
      </div>
    );
  },
};

export const LongNames: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Shows how the layout handles extremely long names. Text is truncated using CSS ellipsis text-overflow, and tooltips or title attributes are preserved.",
      },
    },
  },
  render: () => {
    const [items, setItems] = useState<FileExplorerItem[]>(longNameItems);
    const [expandedIds, setExpandedIds] = useState<string[]>(["1"]);

    return (
      <div
        style={{ padding: "20px", height: "500px" }}
      >
        <FileExplorer
          items={items}
          onItemsChange={setItems}
          expandedIds={expandedIds}
          onExpandedChange={setExpandedIds}
          theme="dark"
        />
      </div>
    );
  },
};

const ControlledExpansionDemo = () => {
  const [items, setItems] = useState<FileExplorerItem[]>(standardItems);
  const [expandedIds, setExpandedIds] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<FileExplorerItem | null>(
    null,
  );

  const folderIds = items.filter((i) => i.type === "folder").map((i) => i.id);

  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        padding: "20px",
        maxWidth: "600px",
      }}
    >
      <div style={{ flex: 1, height: "500px" }}>
        <FileExplorer
          items={items}
          onItemsChange={setItems}
          expandedIds={expandedIds}
          onExpandedChange={setExpandedIds}
          onSelectionChange={setSelectedItem}
          theme="dark"
        />
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          color: "var(--pui-color-text)",
        }}
      >
        <h4 style={{ margin: "0 0 8px 0" }}>Expansion Controls</h4>
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            type="button"
            onClick={() => setExpandedIds(folderIds)}
            style={{
              padding: "6px 12px",
              background: "var(--pui-color-primary)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={() => setExpandedIds([])}
            style={{
              padding: "6px 12px",
              background: "var(--pui-color-secondary)",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Collapse All
          </button>
        </div>
        <div style={{ marginTop: "12px" }}>
          <strong>Active Expanded IDs:</strong>
          <pre
            style={{
              background: "rgba(0,0,0,0.2)",
              padding: "8px",
              borderRadius: "4px",
              fontSize: "11px",
            }}
          >
            {JSON.stringify(expandedIds, null, 2)}
          </pre>
        </div>
        <div style={{ marginTop: "12px" }}>
          <strong>Selected Item:</strong>
          {selectedItem ? (
            <pre
              style={{
                background: "rgba(0,0,0,0.2)",
                padding: "8px",
                borderRadius: "4px",
                fontSize: "11px",
              }}
            >
              {JSON.stringify(selectedItem, null, 2)}
            </pre>
          ) : (
            <span
              style={{ fontSize: "12px", color: "var(--pui-color-text-muted)" }}
            >
              None selected
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export const ControlledExpansion: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Shows how you can fully control the expansion state using the `expandedIds` and `onExpandedChange` props. Use this to sync expansion state with parent routers or custom toolbar buttons like 'Expand All' or 'Collapse All'.",
      },
    },
  },
  render: () => <ControlledExpansionDemo />,
};

export const CustomStyling: Story = {
  parameters: {
    docs: {
      description: {
        story: "Demonstrates custom styling applied via the `className` prop.",
      },
    },
  },
  render: () => {
    const [items, setItems] = useState<FileExplorerItem[]>(standardItems);
    const [expandedIds, setExpandedIds] = useState<string[]>(["1", "2"]);

    return (
      <div
        style={{ padding: "20px" }}
      >
        <style>{`
          div.custom-explorer-sidebar {
            width: 280px;
            max-height: 500px;
            border-radius: 12px;
            border: 2px solid var(--pui-color-primary);
            background: linear-gradient(135deg, #1e1e2e 0%, #11111b 100%);
            box-shadow: 0 8px 32px rgba(0, 122, 204, 0.2);
          }
        `}</style>
        <FileExplorer
          items={items}
          onItemsChange={setItems}
          expandedIds={expandedIds}
          onExpandedChange={setExpandedIds}
          className="custom-explorer-sidebar"
          theme="dark"
        />
      </div>
    );
  },
};

export const CustomIcons: Story = {
  parameters: {
    docs: {
      description: {
        story: `
Demonstrates overriding file and folder icons. You can pass a configuration object containing:
- \`file\`, \`folderClosed\`, and \`folderOpen\` (for default styles).
- \`nameMap\` (for matching specific items like \`package.json\` or \`node_modules\`).
- \`extensionMap\` (for extension-based styling like \`ts\`, \`tsx\`, or \`css\`).

All custom elements are automatically constrained to standard sizing inside the item wrapper, ensuring a clean, aligned, and professional visual tree.
        `,
      },
    },
  },
  render: () => {
    const [items, setItems] = useState<FileExplorerItem[]>(standardItems);
    const [expandedIds, setExpandedIds] = useState<string[]>(["1", "2"]);

    // Simple custom dots/symbols for clean visualization
    const iconsConfig = {
      file: (
        <span style={{ fontSize: "12px", color: "#a6adc8" }}>📄</span>
      ),
      folderClosed: (
        <span style={{ fontSize: "12px", color: "#f9e2af" }}>📁</span>
      ),
      folderOpen: (
        <span style={{ fontSize: "12px", color: "#f9e2af" }}>📂</span>
      ),
      nameMap: {
        "package.json": (
          <span style={{ fontSize: "12px", color: "#f38ba8" }}>📦</span>
        ),
        "node_modules": (
          <span style={{ fontSize: "12px", color: "#a6e3a1" }}>⚙️</span>
        ),
      },
      extensionMap: {
        ts: (
          <span style={{ fontSize: "10px", color: "#89b4fa" }}>🟦</span>
        ),
        tsx: (
          <span style={{ fontSize: "10px", color: "#74c7ec" }}>⚛️</span>
        ),
        css: (
          <span style={{ fontSize: "12px", color: "#cba6f7" }}>🎨</span>
        ),
      },
    };

    return (
      <div
        style={{ padding: "20px" }}
      >
        <FileExplorer
          items={items}
          onItemsChange={setItems}
          expandedIds={expandedIds}
          onExpandedChange={setExpandedIds}
          theme="dark"
          icons={iconsConfig}
        />
      </div>
    );
  },
};
