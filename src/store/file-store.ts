
// import { create } from "zustand";
// import type { FileResponse } from "../types/fileTypes";

// interface FileStoreProps {
//     file: FileResponse | null;
//     addFile: (file: FileResponse, message: string) => void;
// }

// export const useFileStore = create<FileStoreProps>((set) => {

//     function handleAddFile(file: FileResponse, message: string){
//         set(()=> ({file: file, message}))
//     }

//     return {
//         file: null,
//         addFile: handleAddFile,
//     }
// })

// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import type { FileUploadResponse } from "../types/fileTypes";

// interface FileStoreProps {
//     file: FileUploadResponse | null;
//     message: string | null;
//     fileUrl: string | null;
//     addFile: (file: FileUploadResponse, message: string) => void;
//     addFileUrl: (fileUrl: string) => void;
// }

// export const useFileStore = create<FileStoreProps>()(
//     persist(
//         (set) => ({
//             file: null,
//             message: null,
//              fileUrl: null,
//             addFile: (file: FileUploadResponse, message: string) =>
//                 set(() => ({ file, message })),
//             addFileUrl: (fileUrl: string)=>
//                 set(()=>({fileUrl})),
//         }),
//         {
//             name: "file-storage", // chave do localStorage
//         }
//     )
// );

import { create } from "zustand";
import type {  FileUploadResponse } from "../types/fileTypes";

interface FileStoreProps {
  file: FileUploadResponse | null;
  message: string | null;
  fileUrl: string | null;
  addFile: (file: FileUploadResponse, message: string) => void;
  addFileUrl: (fileUrl: string) => void;
}

export const useFileStore = create<FileStoreProps>((set) => ({
  file: null,
  message: null,
  fileUrl: null,
  addFile: (file: FileUploadResponse, message: string) => set({ file, message }),
  addFileUrl: (fileUrl: string) => set({ fileUrl }),
}));
