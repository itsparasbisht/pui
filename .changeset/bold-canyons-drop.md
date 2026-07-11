---
"@paras.in/pui": minor
---

Added custom icon support

- Implemented a simplified `icons` prop supporting custom default file/folder icons, exact filename mappings (e.g. `package.json`), and extension-based mappings (e.g. `ts`).

- Added native hover tooltips (`title` attribute) to display full names for long items.

- Unified and centralized icon resolution logic under a shared, type-safe `resolveIcon` helper.

- Exported the `FileExplorerIcons` type from the package entry point.
