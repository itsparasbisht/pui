# FileExplorer Code Review

## Review scope

Reviewed the current FileExplorer implementation in:

- `src/components/FileExplorer/FileExplorer.tsx`
- `src/components/FileExplorer/ItemNode.tsx`
- `src/components/FileExplorer/AddItemInput.tsx`
- `src/components/FileExplorer/utils.ts`
- `src/components/FileExplorer/context/FileExplorerContext.ts`
- `src/components/FileExplorer/context/FileExplorerProvider.tsx`
- `src/components/FileExplorer/FileExplorer.stories.tsx`
- `src/index.ts`
- library build setup in `vite.config.ts` and `package.json`

I also ran:

- `cmd /c npm run lint` - passed
- `cmd /c npm run build` - passed

The component is a solid learning start: it has a flat data model, recursive rendering, folder/file creation, selection, and expansion. The biggest opportunity now is to turn it from a working demo into a component-library-quality primitive with a clean public API, predictable state ownership, accessibility, customization points, and tests.

## Executive summary

Before adding more explorer features, I would prioritize these changes:

1. Design the public API first: `items`, `defaultItems`, `onItemsChange`, `selectedId`, `expandedIds`, `onCreateItem`, `validateItemName`, render customization, and class/style hooks.
2. Move module-level mutable state into React state or a reducer. `itemType` and `getNextId` currently live outside component instances.
3. Separate selection from expansion. Selecting a folder currently toggles expansion, which will become awkward once keyboard navigation, context menus, rename, and multi-select exist.
4. Store IDs in state instead of full derived nodes. `activeNode` currently stores a `TreeNode`, which can become stale after future rename/delete/move operations.
5. Make `buildTree` immutable. It currently mutates the input array with `items.sort(...)`.
6. Improve accessibility before the component grows: labelled icon buttons, tree roles, keyboard navigation, focus management, and visible validation errors.
7. Export the FileExplorer from the package entrypoint. Right now `src/index.ts` only exports `Button`.
8. Add tests around tree building and user interactions before implementing rename/delete/move.

## Strengths

- The flat item shape with `id`, `name`, `type`, and `parentId` is a reasonable internal representation for create, move, delete, and lookup operations.
- `buildTree` is separated from rendering, which is the right direction.
- Recursive rendering through `ItemNode` matches the mental model of a file tree.
- CSS Modules are already in use, which is a good base for component-library styling.
- TypeScript is enabled with declaration output, and the project builds as both ESM and CJS.
- Storybook is already present, which is exactly where complex component behavior should be documented and tested visually.

## Highest-priority issues

### 1. FileExplorer is not exported from the library

`src/index.ts` only exports `Button`:

```ts
export { Button } from "./components/button";
```

For a library consumer, the FileExplorer does not currently exist at the package entrypoint.

Recommended direction:

- Add `src/components/FileExplorer/index.ts`.
- Export `FileExplorer`, public types, and any intentional subcomponents/hooks.
- Re-export from `src/index.ts`.
- Avoid exporting internal implementation pieces unless they are part of the intended customization API.

Example:

```ts
export { FileExplorer } from "./FileExplorer";
export type {
  FileExplorerItem,
  FileExplorerItemType,
  FileExplorerProps,
  FileExplorerTreeItem,
} from "./FileExplorer.types";
```

### 2. The component needs a consumer-facing API

`FileExplorer` currently accepts no props and owns all explorer data internally:

```ts
export function FileExplorer() {
  const [explorerData, setExplorerData] = useState<ExplorerData[]>([]);
}
```

That is fine for a prototype, but a component-library consumer will usually need to:

- Provide initial data.
- Control data from app state.
- Save changes to a backend.
- Prevent or customize creation.
- Render custom icons, labels, badges, actions, or metadata.
- Control selected and expanded nodes.
- Validate names according to product rules.
- React to selection, expansion, creation, rename, delete, and move events.

Recommended direction: support controlled and uncontrolled usage.

Example API shape:

```ts
type FileExplorerProps<TId extends string | number = string> = {
  items?: FileExplorerItem<TId>[];
  defaultItems?: FileExplorerItem<TId>[];
  onItemsChange?: (items: FileExplorerItem<TId>[]) => void;

  selectedId?: TId | null;
  defaultSelectedId?: TId | null;
  onSelectionChange?: (item: FileExplorerItem<TId> | null) => void;

  expandedIds?: TId[];
  defaultExpandedIds?: TId[];
  onExpandedChange?: (expandedIds: TId[]) => void;

  onCreateItem?: (draft: CreateFileExplorerItem<TId>) => void | FileExplorerItem<TId>;
  validateItemName?: (name: string, context: ValidationContext<TId>) => string | null;
  sortComparator?: (a: FileExplorerItem<TId>, b: FileExplorerItem<TId>) => number;

  renderItem?: (item: FileExplorerTreeItem<TId>, state: FileExplorerItemState) => React.ReactNode;
  className?: string;
  classNames?: Partial<FileExplorerClassNames>;
};
```

This does not need to be implemented all at once, but having the target API in mind will prevent internal state from growing in a direction that is hard to expose later.

### 3. Module-level mutable state will break multiple instances

In `FileExplorer.tsx`:

```ts
const getNextId = generateId();
let itemType: ItemType = "folder";
```

These values are shared by every `FileExplorer` instance imported from the module. That creates subtle bugs:

- Two explorers on the same page share the ID counter.
- Starting a file creation in one explorer can affect another explorer through `itemType`.
- State changes are invisible to React, so behavior depends on mutation outside React's render model.
- Tests can leak state across cases.

Recommended direction:

- Replace `itemType` with component state such as `pendingCreateType`.
- Replace `showAddItemInput` plus `itemType` with a single draft object.
- Let consumers provide IDs, or accept an `idFactory` prop for uncontrolled creation.

Example:

```ts
type CreateDraft<TId> = {
  type: FileExplorerItemType;
  parentId: TId | null;
} | null;

const [createDraft, setCreateDraft] = useState<CreateDraft<number>>(null);
```

### 4. Selection and expansion are coupled

In `FileExplorerProvider.tsx`, selecting a folder also toggles expansion:

```ts
function changeActiveNode(node: TreeNode | null) {
  setActiveNode(node);

  if (node !== null && node.type === "folder") updateExpandedNodes(node.id);
}
```

This makes simple selection destructive: clicking an already-expanded folder collapses it. That will become especially hard to reason about when you add:

- Keyboard navigation.
- Rename mode.
- Context menus.
- Multi-select.
- Drag and drop.
- Open-on-single-click vs open-on-double-click options.

Recommended direction:

- `selectItem(id)` should only select.
- `toggleExpanded(id)` should only expand/collapse.
- Folder row clicks can call both if you want that default behavior, but the state operations should remain separate.

### 5. `activeNode` should probably be `selectedId`

The context stores a full `TreeNode`:

```ts
activeNode: TreeNode | null;
```

`TreeNode` is derived from `explorerData`. Once rename, delete, or move exists, the selected object can become stale. It also stores `children`, which is view data rather than selection data.

Recommended direction:

- Store `selectedId: ItemId | null`.
- Derive the selected item from the current item map.
- Use the selected ID to style rows and decide where creation should happen.

This will make future features easier because ID state survives immutable item updates cleanly.

### 6. `buildTree` mutates React state

In `utils.ts`:

```ts
const sortedItems = items.sort((a, b) => {
```

`Array.prototype.sort` mutates the original array. Since `buildTree(explorerData)` receives the React state array, the memoized selector mutates state during render. That is one of the most important correctness issues in the current code.

Recommended fix:

```ts
const sortedItems = [...items].sort((a, b) => {
  if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
  return a.name.localeCompare(b.name);
});
```

Also consider making the sort configurable. Some consumers will want custom ordering, manual ordering, or no sorting.

### 7. Validation is not yet enforced in the code shown

`AddItemInput` calls `onAddItem(inputValue)` whenever Enter is pressed:

```ts
if (e.key === "Enter") {
  onAddItem(inputValue);
  setInputValue("");
}
```

The current implementation allows empty strings, whitespace-only names, duplicate sibling names, and names that differ only by casing unless validation exists somewhere outside the reviewed code.

Recommended direction:

- Trim names before submission.
- Keep the input open when validation fails.
- Show an error message associated with the input.
- Validate duplicate names within the target parent folder.
- Let consumers provide a `validateItemName` prop.
- Support `Escape` to cancel.
- Decide what happens on blur: cancel, commit, or configurable.

Example validation return shape:

```ts
type FileExplorerValidationResult =
  | { valid: true; value: string }
  | { valid: false; message: string };
```

## State management recommendation

As the component grows, many tiny `useState` calls will become harder to coordinate. This component is a strong candidate for a reducer.

Possible reducer state:

```ts
type FileExplorerState<TId> = {
  items: FileExplorerItem<TId>[];
  selectedId: TId | null;
  expandedIds: Set<TId>;
  createDraft: {
    type: FileExplorerItemType;
    parentId: TId | null;
  } | null;
  editingId: TId | null;
};
```

Possible actions:

```ts
type FileExplorerAction<TId> =
  | { type: "select"; id: TId | null }
  | { type: "toggleExpanded"; id: TId }
  | { type: "startCreate"; itemType: FileExplorerItemType; parentId: TId | null }
  | { type: "cancelCreate" }
  | { type: "commitCreate"; name: string }
  | { type: "startRename"; id: TId }
  | { type: "commitRename"; id: TId; name: string }
  | { type: "delete"; id: TId };
```

This makes behavior easier to test because most logic can be validated without rendering React.

## Context design

The current context type makes `changeActiveNode` optional:

```ts
changeActiveNode?: (node: TreeNode | null) => void;
```

The component then calls it with a non-null assertion:

```ts
changeActiveNode!(null);
```

That is a smell: either the value is always present, or consumers need a safe failure mode.

Recommended direction:

- Make context values non-optional.
- Use a custom hook that throws if the provider is missing.
- Consider making `FileExplorer` include its provider internally so consumers do not need to wrap it manually.

Example:

```ts
function useFileExplorerContext() {
  const context = useContext(FileExplorerContext);
  if (!context) {
    throw new Error("useFileExplorerContext must be used inside FileExplorerProvider.");
  }
  return context;
}
```

For library ergonomics, I would avoid making consumers import `FileExplorerProvider` unless you are intentionally offering a compound component API.

## Rendering and accessibility

Current rendering uses native `details`/`summary`, but prevents summary's default click behavior:

```tsx
<summary onClick={(e) => e.preventDefault()}>
```

Because expansion is controlled elsewhere, this is understandable, but it removes much of the native behavior that made `details` useful in the first place.

Recommended direction:

- Use explicit tree semantics:
  - Container: `role="tree"`.
  - Rows: `role="treeitem"`.
  - Nested children: `role="group"`.
  - Expanded folders: `aria-expanded`.
  - Selected row: `aria-selected`.
- Add keyboard navigation:
  - Up/Down moves between visible items.
  - Right expands a folder or moves into children.
  - Left collapses a folder or moves to parent.
  - Enter starts rename or opens/selects, depending on your design.
  - Escape cancels create/rename.
- Use a roving `tabIndex` so the tree has predictable keyboard focus.
- Add `aria-label` or `title` to icon-only buttons.
- Mark decorative icons with `aria-hidden`.
- Give the create input an accessible label.
- Keep focus stable after create/cancel.

Example button improvement:

```tsx
<button type="button" aria-label="New folder">
  <FolderPlus aria-hidden="true" />
</button>
```

Accessibility is much easier to add now than after the component has rename, delete, context menus, drag and drop, and async loading.

## Styling and customization

There are several inline styles and hardcoded colors:

```tsx
backgroundColor: activeNode?.id === node.id ? "#c4c4c4" : "white"
```

There is also `!important` in `ItemNode.module.css`:

```css
background-color: #e4e4e4 !important;
```

For a component library, this makes theming and consumer overrides harder.

Recommended direction:

- Move visual styles into CSS modules.
- Use the existing design tokens in `src/styles/token.css`.
- Expose stable CSS variables for component-specific styling.
- Expose `className` for the root.
- Optionally expose `classNames` for slots.
- Avoid `!important`.

Example slot names:

```ts
type FileExplorerClassNames = {
  root: string;
  toolbar: string;
  item: string;
  itemSelected: string;
  itemExpanded: string;
  itemIcon: string;
  itemLabel: string;
  createInput: string;
};
```

This lets consumers modify the component without forking it.

## Naming recommendations

Current names are understandable for a prototype, but a library benefits from names that communicate public vs internal concepts.

Suggested renames:

| Current name | Suggested name | Why |
| --- | --- | --- |
| `ExplorerData` | `FileExplorerItem` | It represents one item, not all explorer data. |
| `TreeNode` | `FileExplorerTreeItem` | Makes clear it is the derived nested form. |
| `ItemType` | `FileExplorerItemType` | More explicit when exported. |
| `itemType` | `pendingCreateType` or `createDraft.type` | Describes transient create state. |
| `explorerData` | `items` | Shorter and closer to library API naming. |
| `showAddItemInput` | `createDraft` or `isCreatingItem` | Current name only covers visibility, not intent. |
| `activeNode` | `selectedId` or `selectedItem` | "Active" can mean focused, selected, or open. |
| `changeActiveNode` | `selectItem` | More action-oriented. |
| `expandedNodes` | `expandedIds` | State contains IDs, not nodes. |
| `updateExpandedNodes` | `toggleExpanded` | More precise behavior. |
| `ItemNode` | `FileExplorerItem` or `FileExplorerNode` | Avoids generic names in stack traces and imports. |
| `AddItemInput` | `CreateItemInput` | Better describes intent. |
| `FileEx` | Remove or `FileExplorerDemo` | `FileEx` reads like a temporary wrapper. |
| `fileExplorerContext` | `FileExplorerContextValue` | Type names should be PascalCase. |

Suggested folder structure:

```txt
src/components/FileExplorer/
  index.ts
  FileExplorer.tsx
  FileExplorer.types.ts
  FileExplorer.reducer.ts
  FileExplorer.utils.ts
  FileExplorerItem.tsx
  CreateItemInput.tsx
  FileExplorerContext.tsx
  FileExplorer.module.css
  FileExplorer.stories.tsx
  FileExplorer.test.tsx
```

## Data model recommendations

The flat model is a good internal default:

```ts
type FileExplorerItem<TId extends string | number = string> = {
  id: TId;
  parentId: TId | null;
  name: string;
  type: "file" | "folder";
};
```

For a reusable library, consider:

- Use `string | number` IDs, not only `number`.
- Do not force the library to generate IDs unless using uncontrolled mode.
- Allow metadata through generics if you want richer consumer data.
- Decide whether root items can be files, folders, or both.
- Decide how to handle orphaned items.
- Decide how to handle cycles defensively.
- Decide whether sorting is automatic, configurable, or fully consumer-controlled.

If this is meant to be a "complex component" library, the component should be resilient when consumers pass imperfect data.

## Creation flow recommendations

Current creation behavior:

- Toolbar button sets a global item type.
- Input appears based on selected node.
- Enter always creates.
- New folders become active.
- New files do not become active.

Recommended behavior decisions:

- Should newly created files also become selected?
- Should creating inside a collapsed folder expand it?
- Should empty folders show an inline create input inside the folder?
- Should validation errors keep the input open?
- Should create be async?
- Should consumers be able to veto creation?

Possible API:

```ts
onCreateItem?: (request: {
  type: FileExplorerItemType;
  parentId: TId | null;
  name: string;
}) => void | Promise<FileExplorerItem<TId>>;
```

If `onCreateItem` is async, the component may need pending/error UI.

## Storybook recommendations

The current story only renders `FileEx`, which wraps the component in the provider. For a library, Storybook should document states and usage patterns.

Add stories for:

- Empty explorer.
- Seeded explorer with nested folders.
- Deeply nested folders.
- Long names and overflow behavior.
- Duplicate/invalid name validation.
- Controlled selected item.
- Controlled expanded folders.
- Custom icons.
- Custom item renderer.
- Dark theme.
- Disabled/read-only mode.
- Large tree performance smoke test.

Storybook should become the first place a consumer learns how to use the component.

## Testing recommendations

Before adding more features, add tests for the logic that will become expensive to debug later.

Unit tests:

- `buildTree` does not mutate input.
- Folders sort before files.
- Siblings sort by name.
- Orphan handling is defined.
- Duplicate validation works per parent folder.
- Creating an item chooses the expected parent ID.

React interaction tests:

- Create root folder.
- Create file inside selected folder.
- Create sibling file when a file is selected.
- Cancel creation with Escape.
- Invalid input shows an error and does not create.
- Selecting a folder does not accidentally collapse unless intended.
- Toolbar buttons have accessible names.

Accessibility tests:

- Tree has expected roles.
- Keyboard navigation works.
- Focus moves predictably after create/cancel.

## Packaging recommendations

Since this is a component library, `package.json` should eventually expose the built files explicitly.

Consider adding:

```json
{
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./style.css": "./dist/style.css"
  },
  "files": ["dist"]
}
```

Also consider moving `react` and `react-dom` from `dependencies` to `peerDependencies` for a published library, while keeping them in `devDependencies` for local development.

## Suggested implementation order

1. Fix correctness issues:
   - Replace module-level `itemType`.
   - Make `buildTree` immutable.
   - Rename types and state to clearer names.
   - Remove `console.log`.
   - Remove commented-out blocks in `ItemNode.tsx`.
2. Create the public API:
   - Add `FileExplorerProps`.
   - Support `defaultItems`.
   - Add `onItemsChange`.
   - Export the component and types.
3. Refactor state:
   - Store `selectedId`, not `activeNode`.
   - Split selection and expansion.
   - Move interaction logic into a reducer or helper functions.
4. Improve accessibility:
   - Label buttons and inputs.
   - Add tree semantics.
   - Add keyboard navigation.
5. Improve customization:
   - Move inline styles to CSS modules.
   - Use design tokens.
   - Add `className`, `classNames`, and optional render props.
6. Add tests and stories:
   - Cover current behavior before adding rename/delete/move.
   - Expand Storybook into real documentation.
7. Add richer explorer features:
   - Rename.
   - Delete.
   - Context menu.
   - Drag and drop.
   - Search/filter.
   - Multi-select.
   - Async loading.
   - Read-only/disabled states.

## A good target mental model

Aim for this split:

- Data utilities: pure functions for tree building, validation, move/delete operations.
- State layer: reducer or controlled/uncontrolled state helpers.
- Headless behavior: selection, expansion, creation, keyboard navigation.
- Styled UI: the default FileExplorer users can import and use immediately.
- Customization API: render props, slot class names, icons, validators, and callbacks.

That structure gives you the best of both worlds: a polished default component and enough escape hatches for users to adapt it without modifying your source.

## Final recommendation

Do not add many new FileExplorer features yet. First stabilize the foundation: API, state model, naming, immutability, accessibility, styling hooks, and tests. Once those are in place, features like rename, delete, context menus, drag/drop, and search will be much easier to add without rewriting the component every time.
