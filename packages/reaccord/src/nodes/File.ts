import { BaseNode } from "./_Base"
import type { EmbedNode } from "./Embed/Embed"
import type { ReaccordElement } from "../jsx"

export class FileNode extends BaseNode<"File", EmbedNode> {
  constructor() {
    super("File")
  }

  render(): ReaccordElement["File"]["file"] {
    if (!this.attr.file) {
      throw new Error("FileNode: file attribute is required")
    }
    return this.attr.file
  }
}
