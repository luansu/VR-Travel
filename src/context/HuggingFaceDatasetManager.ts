import { listFiles,uploadFile, } from "@huggingface/hub";
export class HuggingFaceDatasetManager {
  private repoId: string;
  private accessToken: string;
  
  constructor() {
    this.repoId = "XuanHuy224/GaussianSample";
    this.accessToken = import.meta.env.VITE_HUGGING_FACE_API_KEY;
  }

  async listAllFiles(): Promise<{ path: string, size: number }[]> {
    try {
      const files = await listFiles({
        repo: { type: "dataset", name: this.repoId },
        accessToken: this.accessToken,
        recursive: true,
      });

      const fileList = [];
      for await (const file of files) {
        fileList.push(file);
      }
      return fileList;
    } catch (error) {
      console.error("Error listing files:", error);
      throw error;
    }
  }
  async ListFolderFile (folderName: string): Promise<{ path: string, size: number }[]> {
    try {
      const files = await listFiles({
        repo: { type: "dataset", name: this.repoId },
        accessToken: this.accessToken,
        recursive: true,
        path: folderName,
      });
      const fileList = [];
      for await (const file of files) {
        fileList.push(file);
      }
      return fileList;
    } catch (error) { 
      console.error(`Error listing files in folder ${folderName}:`, error);
      throw error;

    }
  }
  async uploadFile(filePath: string, fileContent: Blob): Promise<void> {
    try {
      await uploadFile({
        repo: { type: "dataset", name: this.repoId },
        accessToken: this.accessToken,
        file: {
          path: filePath,
          content: fileContent
        }
      });
      console.log(`File ${filePath} uploaded successfully.`);
    } catch (error) {
      console.error(`Error uploading file ${filePath}:`, error);
      throw error;
    }
  }


        
}