# @paras.in/pui

[![NPM Version](https://img.shields.io/npm/v/@paras.in/pui.svg?style=flat-square)](https://www.npmjs.com/package/@paras.in/pui)
[![License](https://img.shields.io/npm/l/@paras.in/pui.svg?style=flat-square)](https://github.com/itsparasbisht/pui/blob/main/LICENSE)
[![Storybook Demo](https://img.shields.io/badge/Storybook-Demo-FF4785?style=flat-square&logo=storybook)](https://main--6a46985e273c71987463da96.chromatic.com)

A React and TypeScript component library focused on complex workspace UI components.

---

## Live Documentation

Explore the interactive component playground and API documentation:
[Chromatic Storybook Demo](https://main--6a46985e273c71987463da96.chromatic.com)

---

## Features

- Dual Output: Bundled in both ES Modules (index.js) and CommonJS (index.cjs) formats.
- TypeScript Support: Native, auto-generated type declarations.
- Vanilla CSS Styling: Zero-dependency styling for maximum performance and control.
- Robust Testing: Verified using Vitest and Storybook Test runners.
- Visual Documentation: Fully interactive playground using Storybook.
- Automated Publishing: Versioned and published via Changesets and GitHub Actions.

---

## Installation

Install the package via your preferred package manager:

```bash
npm install @paras.in/pui
```

### Setup Styles

Import the CSS file in your main application entry point (e.g., main.tsx or App.tsx):

```tsx
import "@paras.in/pui/style.css";
```

---

## Usage

Here is an example of implementing the FileExplorer component:

```tsx
import React, { useState } from "react";
import { FileExplorer, type FileExplorerItem } from "@paras.in/pui";

const App = () => {
  const [items, setItems] = useState<FileExplorerItem[]>([]);

  return (
    <div style={{ width: "300px", height: "100vh" }}>
      <FileExplorer items={items} onItemsChange={setItems} />
    </div>
  );
};

export default App;
```

---

## Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Storybook

Launch the interactive Storybook playground:

```bash
npm run storybook
```

### 3. Run Tests

Execute unit tests using Vitest:

```bash
npm run test
```

### 4. Build the Library

Build ESM and CommonJS bundles and generate type definitions:

```bash
npm run build
```

---

## Contribution and Release Workflow

This repository uses Changesets to automate versioning and publishing.

### When introducing a change:

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
2. Write your code and tests.
3. Before opening or merging a Pull Request, run the changeset command:
   ```bash
   npm run changeset
   ```
4. Follow the interactive prompts to select the version bump type (major, minor, or patch) and write a summary of the change.
5. Commit the generated changeset file and merge it into main.
