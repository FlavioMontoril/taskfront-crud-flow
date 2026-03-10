import type { TaskDto, TaskProps } from "../types/taskType";
import type { FileResponse, UploadFileResponse } from "../types/fileTypes";
import { apiClient } from "../lib/apiClient";

type TaskUpdateDto = Omit<TaskProps, "id" | "createAd" | "updatedAt">;

export const useApi = () => {
  return {
    taskApi: {
      getAllTasks: async (): Promise<TaskProps[] | null> => {
        try {
          return await apiClient.get<TaskProps[]>("/v1/tasks");
        } catch (error) {
          console.error("Task not found", error);
          throw error;
        }
      },

      getTaskById: async (id: string): Promise<TaskProps> => {
        try {
          return await apiClient.get<TaskProps>(`/v1/tasks/${id}`);
        } catch (error) {
          console.error("Find one task not found", error);
          throw error;
        }
      },

      createTask: async (data: TaskDto): Promise<string> => {
        try {
          const response = await apiClient.post<{ id: string }>("/v1/tasks", data);
          return response.id
        } catch (error) {
          console.error("Task not created", error);
          throw error;
        }
      },

      updateTask: async (id: string, task: TaskUpdateDto): Promise<TaskProps> => {
        try {
          return await apiClient.put<TaskProps>(`/v1/tasks/${id}`, task);
        } catch (error) {
          console.error("Task not found", error);
          throw error;
        }
      },

      deleteTask: async (id: string): Promise<void> => {
        try {
          await apiClient.delete<void>(`/v1/tasks/${id}`);
        } catch (error) {
          console.error("Task not found", error);
          throw error;
        }
      },
    },

    fileApi: {
      getFileById: async (id: string): Promise<FileResponse> => {
        try {
          return await apiClient.get<FileResponse>(`/v1/files/${id}`);
        } catch (error) {
          console.error("File not found", error);
          throw error;
        }
      },

      postFile: async (formData: FormData): Promise<UploadFileResponse> => {
        try {
          return await apiClient.post<UploadFileResponse>(
            "/v1/files",
            formData
          );
        } catch (error) {
          console.error("File not uploaded", error);
          throw error;
        }
      },
    },
  };
};
