# @paras.in/pui

A React + TypeScript component library built with Vite, styled with CSS, and documented with Storybook.

---

## 🚀 Features

- 📦 **Dual Output**: Bundled in both ES Modules (`.js`) and CommonJS (`.cjs`) formats.
- 🛡️ **TypeScript Support**: Native, auto-generated `.d.ts` type declarations.
- 🎨 **Vanilla CSS Styling**: Zero-dependency styling for maximum speed and control.
- 🧪 **Robust Testing**: Fully tested using Vitest and Storybook Test runners.
- 📖 **Visual Documentation**: Fully interactive playground using Storybook.
- 🦋 **Automated Publishing**: Streamlined versioning and releases with Changesets.

---

## 📦 Installation

To install the library, run:

```bash
npm install @paras.in/pui
```

### Setup styles

Make sure to import the CSS file in your main application entry point (e.g., `main.tsx` or `App.tsx`):

```tsx
import "@paras.in/pui/style.css";
```

---

## 🛠️ Usage

```tsx
import React from "react";
import { Button, FileExplorer } from "@paras.in/pui";

const App = () => {
  return (
    <div>
      <Button variant="primary">Click Me</Button>
      <FileExplorer data={/* folder structure data */} />
    </div>
  );
};
```

---

## 💻 Local Development

### 1. Install dependencies

```bash
npm install
```

### 2. Run Storybook

Launch the interactive Storybook playground to view and design components:

```bash
npm run storybook
```

### 3. Run Tests

Run unit tests with Vitest:

```bash
npm run test
```

### 4. Build the Library

Build both commonjs/esm bundles and generate type files in the `dist` folder:

```bash
npm run build
```

---

## 🦋 Release & Contribution Workflow

This repository uses **Changesets** to automate version bumps and release logs.

### When making a code contribution:

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
2. Write your code and tests.
3. Before opening/merging a Pull Request, run the changeset command:
   ```bash
   npm run changeset
   ```
4. Follow the interactive prompts to choose the version bump type (`major`, `minor`, or `patch`) and write a summary of the change.
5. Commit the generated `.changeset/xxxx.md` file along with your code and merge it into `main`!
