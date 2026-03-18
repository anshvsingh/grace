import JSZip from "jszip";
import { saveAs } from "file-saver";

type GeneratedFile = {
  filename: string;
  content: string;
};

export async function downloadZip(files: GeneratedFile[], projectName: string) {
  const zip = new JSZip();

  files.forEach((file) => {
    // Make sure content is always a string
    const content = typeof file.content === "string"
      ? file.content
      : JSON.stringify(file.content, null, 2);

    if (file.filename && content) {
      zip.file(file.filename, content);
    }
  });

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${projectName || "grace-mvp"}.zip`);
}