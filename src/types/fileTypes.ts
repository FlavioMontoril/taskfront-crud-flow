export interface FileData {
  id?: string;
  taskId?: string;
  original_name: string;
  file_path: string;
  createdAt?: Date;
}

export interface ElementProps{
    file: FileData;
    message: string
}