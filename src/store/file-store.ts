
import { create } from "zustand";
import type { FileResponse, UploadFileResponse } from "../types/fileTypes";

interface FileStoreProps {
  upload: UploadFileResponse | null;
  fileUrl: string | null;
  download: FileResponse | null
  addUpload: (data: UploadFileResponse) => void;
  addFileUrl: (fileUrl: string) => void;
  addDownload: (data: FileResponse)=>void
  // addDataFile: (data: FileResponse) => void
}

export const useFileStore = create<FileStoreProps>((set) => ({
  upload: null,
  fileUrl: null,
  download: null,
  addUpload: (upload: UploadFileResponse) => set({ upload }),
  addFileUrl: (fileUrl: string) => set({ fileUrl }),
  addDownload: (download: FileResponse)=> set({download})
  // addDataFile: (data: FileResponse) => set({ data })
}));
