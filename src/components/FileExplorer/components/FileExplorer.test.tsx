import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileExplorer } from "./FileExplorer";
import { buildTree, validateCreateItemName } from "../utils";
import type { FileExplorerItem } from "../utils";
import "@testing-library/jest-dom";

describe("FileExplorer Utilities", () => {
  describe("buildTree", () => {
    it("should build a nested tree from flat items list", () => {
      const items: FileExplorerItem[] = [
        { id: "1", name: "src", type: "folder", parentId: null },
        { id: "2", name: "components", type: "folder", parentId: "1" },
        { id: "3", name: "Button.tsx", type: "file", parentId: "2" },
        { id: "4", name: "index.html", type: "file", parentId: null },
      ];

      const tree = buildTree(items);
      expect(tree).toHaveLength(2); // src and index.html at root

      const srcNode = tree.find((n) => n.id === "1");
      expect(srcNode).toBeDefined();
      expect(srcNode?.children).toHaveLength(1);

      const componentsNode = srcNode?.children[0];
      expect(componentsNode?.id).toBe("2");
      expect(componentsNode?.children).toHaveLength(1);
      expect(componentsNode?.children[0].id).toBe("3");
    });

    it("should sort folders before files, then sort alphabetically within groups", () => {
      const items: FileExplorerItem[] = [
        { id: "1", name: "zeta.txt", type: "file", parentId: null },
        { id: "2", name: "alpha.txt", type: "file", parentId: null },
        { id: "3", name: "bravo-folder", type: "folder", parentId: null },
        { id: "4", name: "delta-folder", type: "folder", parentId: null },
      ];

      const tree = buildTree(items);
      expect(tree).toHaveLength(4);
      // Expected order: folders first (bravo-folder, delta-folder) then files (alpha.txt, zeta.txt)
      expect(tree[0].name).toBe("bravo-folder");
      expect(tree[1].name).toBe("delta-folder");
      expect(tree[2].name).toBe("alpha.txt");
      expect(tree[3].name).toBe("zeta.txt");
    });

    it("should not mutate the input array", () => {
      const items: FileExplorerItem[] = [
        { id: "1", name: "b.txt", type: "file", parentId: null },
        { id: "2", name: "a.txt", type: "file", parentId: null },
      ];
      const clonedItems = [...items];

      buildTree(items);
      expect(items).toEqual(clonedItems); // Items order did not change
    });
  });

  describe("validateCreateItemName", () => {
    const items: FileExplorerItem[] = [
      { id: "1", name: "src", type: "folder", parentId: null },
      { id: "2", name: "index.html", type: "file", parentId: null },
    ];

    it("should reject empty names", () => {
      expect(validateCreateItemName({ name: "", parentId: null, items })).toBe("Name is required");
      expect(validateCreateItemName({ name: "   ", parentId: null, items })).toBe("Name is required");
    });

    it("should reject names that are too long", () => {
      const longName = "a".repeat(256);
      expect(validateCreateItemName({ name: longName, parentId: null, items })).toBe(
        "Name must be 255 characters or fewer"
      );
    });

    it("should reject invalid system character names", () => {
      const invalidChars = ["\\", "/", ":", "*", "?", '"', "<", ">", "|"];
      invalidChars.forEach((char) => {
        expect(
          validateCreateItemName({ name: `file${char}.txt`, parentId: null, items })
        ).toContain("Name cannot contain");
      });
    });

    it("should reject names ending with a period", () => {
      expect(validateCreateItemName({ name: "file.txt.", parentId: null, items })).toBe(
        "Name cannot end with a space or period"
      );
    });

    it("should reject duplicate sibling names case-insensitively", () => {
      expect(validateCreateItemName({ name: "src", parentId: null, items })).toBe(
        "An item with this name already exists"
      );
      expect(validateCreateItemName({ name: "SRC", parentId: null, items })).toBe(
        "An item with this name already exists"
      );
    });

    it("should accept valid unique names", () => {
      expect(validateCreateItemName({ name: "unique.txt", parentId: null, items })).toBeNull();
      // Duplicates are fine at different directory levels
      expect(validateCreateItemName({ name: "src", parentId: "1", items })).toBeNull();
    });
  });
});

describe("FileExplorer Component", () => {
  const seedItems: FileExplorerItem[] = [
    { id: "1", name: "src", type: "folder", parentId: null },
    { id: "2", name: "components", type: "folder", parentId: "1" },
    { id: "3", name: "index.css", type: "file", parentId: "1" },
    { id: "4", name: "package.json", type: "file", parentId: null },
  ];

  it("renders empty state correctly when there are no items", () => {
    const onItemsChange = vi.fn();
    render(<FileExplorer items={[]} onItemsChange={onItemsChange} />);

    expect(screen.getByText("Empty Workspace")).toBeInTheDocument();
    expect(screen.getByText("Create a file or folder from the toolbar above")).toBeInTheDocument();
  });

  it("renders seeded folder items and files correctly", () => {
    render(<FileExplorer items={seedItems} onItemsChange={vi.fn()} />);

    expect(screen.getByText("src")).toBeInTheDocument();
    expect(screen.getByText("package.json")).toBeInTheDocument();
  });

  it("fires onSelectionChange when selecting files or folders", async () => {
    const onSelectionChange = vi.fn();
    render(
      <FileExplorer
        items={seedItems}
        onItemsChange={vi.fn()}
        onSelectionChange={onSelectionChange}
      />
    );

    // Select package.json file
    const fileItem = screen.getByText("package.json");
    await fireEvent.click(fileItem);
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: "4", name: "package.json", type: "file" })
    );

    // Select src folder
    const folderItem = screen.getByText("src");
    await fireEvent.click(folderItem);
    expect(onSelectionChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: "1", name: "src", type: "folder" })
    );
  });

  it("allows starting create item flow and handles cancellation", async () => {
    const user = userEvent.setup();
    render(<FileExplorer items={seedItems} onItemsChange={vi.fn()} />);

    // Click "New file" in toolbar
    const newFileButton = screen.getByLabelText("New file");
    await user.click(newFileButton);

    // An input textbox should appear
    const input = screen.getByRole("textbox", { name: "Item name" });
    expect(input).toBeInTheDocument();

    // Escape should dismiss the input
    await user.type(input, "{Escape}");
    expect(screen.queryByRole("textbox", { name: "Item name" })).not.toBeInTheDocument();
  });

  it("submits create flow and triggers onItemsChange", async () => {
    const user = userEvent.setup();
    const onItemsChange = vi.fn();
    render(<FileExplorer items={seedItems} onItemsChange={onItemsChange} />);

    // Click "New folder" in toolbar
    const newFolderButton = screen.getByLabelText("New folder");
    await user.click(newFolderButton);

    const input = screen.getByRole("textbox", { name: "Item name" });
    await user.type(input, "tests{Enter}");

    expect(onItemsChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: "tests", type: "folder", parentId: null }),
      ])
    );
  });

  it("shows validation error on invalid create name input and keeps input open", async () => {
    const user = userEvent.setup();
    const onItemsChange = vi.fn();
    render(<FileExplorer items={seedItems} onItemsChange={onItemsChange} />);

    // Click "New folder" in toolbar
    const newFolderButton = screen.getByLabelText("New folder");
    await user.click(newFolderButton);

    // Submit duplicate folder name "src"
    const input = screen.getByRole("textbox", { name: "Item name" });
    await user.type(input, "src{Enter}");

    // Should display validation error
    expect(screen.getByRole("alert")).toHaveTextContent("An item with this name already exists");
    // Input remains open
    expect(screen.getByRole("textbox", { name: "Item name" })).toBeInTheDocument();
    expect(onItemsChange).not.toHaveBeenCalled();
  });

  it("supports deleting an item via the options context menu", async () => {
    const user = userEvent.setup();
    const onItemsChange = vi.fn();
    render(<FileExplorer items={seedItems} onItemsChange={onItemsChange} />);

    // Find the options button next to package.json
    const packageText = screen.getByText("package.json");
    const itemContainer = packageText.parentElement?.parentElement as HTMLElement;
    const optionsButton = itemContainer.querySelector(
      'button[aria-label="More options"]'
    ) as HTMLButtonElement;
    fireEvent.click(optionsButton);

    // Click "Delete" in dropdown
    const deleteButton = screen.getByRole("button", { name: "Delete" });
    await user.click(deleteButton);

    expect(onItemsChange).toHaveBeenCalledWith(
      expect.not.arrayContaining([
        expect.objectContaining({ name: "package.json" }),
      ])
    );
  });

  it("supports renaming an item via the options context menu", async () => {
    const user = userEvent.setup();
    const onItemsChange = vi.fn();
    render(<FileExplorer items={seedItems} onItemsChange={onItemsChange} />);

    // Open options menu on package.json
    const packageText = screen.getByText("package.json");
    const itemContainer = packageText.parentElement?.parentElement as HTMLElement;
    const optionsButton = itemContainer.querySelector(
      'button[aria-label="More options"]'
    ) as HTMLButtonElement;
    fireEvent.click(optionsButton);

    // Click "Rename" in dropdown
    const renameButton = screen.getByRole("button", { name: "Rename" });
    await user.click(renameButton);

    // Input should appear with pre-filled name
    const renameInput = screen.getByDisplayValue("package.json");
    expect(renameInput).toBeInTheDocument();

    // Type new name and hit enter
    await user.clear(renameInput);
    await user.type(renameInput, "package.config.json{Enter}");

    expect(onItemsChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ id: "4", name: "package.config.json", type: "file" }),
      ])
    );
  });

  it("supports keyboard navigation following WAI-ARIA Tree View patterns", async () => {
    const user = userEvent.setup();
    const items: FileExplorerItem[] = [
      { id: "1", name: "src", type: "folder", parentId: null },
      { id: "2", name: "components", type: "folder", parentId: "1" },
      { id: "3", name: "package.json", type: "file", parentId: null },
    ];

    render(<FileExplorer items={items} onItemsChange={vi.fn()} />);

    const srcItem = screen.getByRole("treeitem", { name: "src" });
    const packageItem = screen.getByRole("treeitem", { name: "package.json" });

    expect(srcItem).toHaveAttribute("tabindex", "0");
    expect(packageItem).toHaveAttribute("tabindex", "-1");

    act(() => {
      srcItem.focus();
    });
    expect(document.activeElement).toBe(srcItem);

    await user.keyboard("{ArrowRight}");
    expect(srcItem).toHaveAttribute("aria-expanded", "true");

    const componentsItem = screen.getByRole("treeitem", { name: "components" });
    expect(componentsItem).toHaveAttribute("tabindex", "-1");

    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(componentsItem);

    await user.keyboard("{ArrowDown}");
    expect(document.activeElement).toBe(packageItem);

    await user.keyboard("{ArrowUp}");
    expect(document.activeElement).toBe(componentsItem);

    await user.keyboard("{End}");
    expect(document.activeElement).toBe(packageItem);

    await user.keyboard("{Home}");
    expect(document.activeElement).toBe(srcItem);

    await user.keyboard("{ArrowLeft}");
    expect(srcItem).toHaveAttribute("aria-expanded", "false");

    await user.keyboard("p");
    expect(document.activeElement).toBe(packageItem);
  });

  describe("Custom Icons", () => {
    it("should render custom icons based on filename, extension, and default type", () => {
      const items: FileExplorerItem[] = [
        { id: "1", name: "src", type: "folder", parentId: null },
        { id: "2", name: "package.json", type: "file", parentId: null },
        { id: "3", name: "main.ts", type: "file", parentId: null },
        { id: "4", name: "readme.md", type: "file", parentId: null },
      ];

      const customIcons = {
        file: <span data-testid="default-file-icon">DefaultFile</span>,
        folderClosed: <span data-testid="folder-closed-icon">FolderClosed</span>,
        folderOpen: <span data-testid="folder-open-icon">FolderOpen</span>,
        nameMap: {
          "package.json": <span data-testid="package-json-icon">PackageJson</span>,
        },
        extensionMap: {
          ts: <span data-testid="ts-icon">TypeScript</span>,
        },
      };

      const { rerender } = render(
        <FileExplorer
          items={items}
          onItemsChange={() => {}}
          expandedIds={[]}
          onExpandedChange={() => {}}
          icons={customIcons}
        />
      );

      // Check package.json nameMap match
      expect(screen.getByTestId("package-json-icon")).toBeInTheDocument();

      // Check main.ts extensionMap match
      expect(screen.getByTestId("ts-icon")).toBeInTheDocument();

      // Check readme.md default file fallback match
      expect(screen.getByTestId("default-file-icon")).toBeInTheDocument();

      // Check folderClosed match
      expect(screen.getByTestId("folder-closed-icon")).toBeInTheDocument();

      // Expand "src" and check folderOpen match
      rerender(
        <FileExplorer
          items={items}
          onItemsChange={() => {}}
          expandedIds={["1"]}
          onExpandedChange={() => {}}
          icons={customIcons}
        />
      );
      expect(screen.getByTestId("folder-open-icon")).toBeInTheDocument();
    });
  });

  describe("Read-Only Mode", () => {
    const readOnlyItems: FileExplorerItem[] = [
      { id: "1", name: "src", type: "folder", parentId: null },
      { id: "2", name: "package.json", type: "file", parentId: null },
    ];

    it("does not render the creation toolbar (new file/folder buttons)", () => {
      render(<FileExplorer items={readOnlyItems} readOnly={true} />);

      expect(screen.queryByLabelText("New file")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("New folder")).not.toBeInTheDocument();
    });

    it("renders the custom empty state subtext message when the tree is empty", () => {
      render(<FileExplorer items={[]} readOnly={true} />);

      expect(screen.getByText("Empty Workspace")).toBeInTheDocument();
      expect(screen.getByText("No files or folders in this workspace")).toBeInTheDocument();
      expect(screen.queryByText("Create a file or folder from the toolbar above")).not.toBeInTheDocument();
    });

    it("does not render the 'More options' context menu button on items", () => {
      render(<FileExplorer items={readOnlyItems} readOnly={true} />);

      expect(screen.queryByLabelText("More options")).not.toBeInTheDocument();
    });
  });
});

