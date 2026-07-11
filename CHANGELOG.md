# @paras.in/pui

## 0.3.0

### Minor Changes

- 5e1ae83: Added custom icon support

  - Implemented a simplified `icons` prop supporting custom default file/folder icons, exact filename mappings (e.g. `package.json`), and extension-based mappings (e.g. `ts`).

  - Added native hover tooltips (`title` attribute) to display full names for long items.

  - Unified and centralized icon resolution logic under a shared, type-safe `resolveIcon` helper.

  - Exported the `FileExplorerIcons` type from the package entry point.

## 0.2.0

### Minor Changes

- 48bc109: Added full WAI-ARIA compliant keyboard navigation support to the `FileExplorer` component. Users can now navigate the directory tree using Arrow keys, Home, End, Enter, Space, and the Asterisk (`\*`) key, as well as cycle focus using alphanumeric type-ahead character matching.

## 0.1.1

### Patch Changes

- d3c1179: - Fix "Dynamic require of react" runtime error by removing React Compiler from the library build configuration.
  - Adjust FileExplorer height to take 100% of the parent container while preserving the visual heights in Storybook stories.
  - Export utility types (`FileExplorerItem`, `FileExplorerProps`) directly from the package root index.
  - Add package registry discoverability metadata (description, keywords, repository links) refocused on complex workspace UI components.
  - Create open-source LICENSE file (MIT).
