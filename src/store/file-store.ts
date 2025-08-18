
import { create } from "zustand";
import type { FileData } from "../types/fileTypes";

interface FileStoreProps {
    file: FileData | null;
    addFile: (file: FileData) => void;
}

export const useFileStore = create<FileStoreProps>((set) => {

    function handleAddFile(file: FileData){
        set(()=> ({file: file}))
    }

    return {
        file: null,
        addFile: handleAddFile,
    }
})