import { FileExplorerProvider } from "./context/FileExplorerProvider";
import { FileExplorer } from "./FileExplorer";

export function FileEx() {
  return (
    <>
      <FileExplorerProvider>
        <FileExplorer />
      </FileExplorerProvider>
    </>
  );
}
