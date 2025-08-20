export type FileUploadResponse = {
  id: string;
  original_name: string;
  file_path: string;
  taskId: string; // se o backend devolver um objeto aqui, você ajusta
  createdAt: string; // ISO string
};

export type UploadFileResponse = {
  message: string;
  file: FileUploadResponse;
};

export interface FileDownloadResponse {
  id: string;
  original_name: string;
  file_path: string;
  created_at: string; // ou Date se você for converter
  taskId: string;
}

export interface FileResponse {
  fileUrl: string;
  file: FileDownloadResponse;
}


