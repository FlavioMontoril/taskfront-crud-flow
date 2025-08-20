import axios from "axios";
import type { TaskDto, TaskProps } from "../types/taskType";
import type { FileResponse, UploadFileResponse } from "../types/fileTypes";


const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

const api = axios.create({
    baseURL: `http://${HOST}:${PORT}`,
});

type taskUpdateDto = Omit<TaskProps, "id" | "createAd" | "updatedAt">

export const useApi = () => {
    return {
        taskApi: {
            getAllTasks: async () => {
                try {
                    const { status, data } = await api.get<TaskProps[] | null>('/v1/tasks/')
                    return { status, data }
                } catch (error) {
                    console.error("Task not foud", error)
                    throw new Error(`Tarefa não encontrada: ${error}`)
                }
            },
            findOneTask: async (id: string): Promise<{ status: number, data: TaskProps }> => {
                try {
                    const { status, data } = await api.get(`/v1/tasks/${id}`)
                    return { status, data }
                } catch (error) {
                    console.error(`Find one task not found${error}`)
                    throw new Error(`Buscar uma tarefa não encontrada${error}`)
                }
            },
            createTask: async (data: TaskDto) => {
                try {
                    const { status, data: _data } = await api.post<TaskProps>(`/v1/tasks/`, data)
                    return { status, _data }

                } catch (error) {
                    console.error(`Task not created`, error)
                    throw new Error(`Tarefa não foi criada: ${error}`)
                }
            },
            updateTask: async (id: string, task: taskUpdateDto): Promise<{ status: number; data: TaskProps }> => {
                try {
                    const { status, data } = await api.put(`/v1/tasks/${id}`, task)
                    return { status, data }
                } catch (error) {
                    console.error(`Task not found${error}`)
                    throw new Error(`Tarefa não encontrada${error}`)
                }
            },
            deleteTask: async (id: string): Promise<{ status: number }> => {
                try {
                    const { status } = await api.delete(`/v1/tasks/${id}`)
                    return { status }
                } catch (error) {
                    console.error(`Task not foud: ${error}`)
                    throw new Error(`Não econtrado tarafa para deletar: ${error}`)
                }
            }
        },

        fileApi: {
            getFileById: async (id: string): Promise<{ status: number, data: FileResponse }> => {
                try {
                    const { status, data } = await api.get<FileResponse>(`/v1/files/${id}`)
                    return { status, data }
                } catch (error) {
                    console.error(`File not foud: ${error}`)
                    throw new Error(`Não econtrado arquivo: ${error}`)
                }

            },
                postFile: async (formData: FormData): Promise<{ status: number, data: UploadFileResponse}> => {
                    try {
                        const { status, data } = await api.post<UploadFileResponse>("/v1/files/", formData, {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        });
                        return { status, data }

                    } catch (error) {
                        console.error(`File not foud: ${error}`)
                        throw new Error(`Não econtrado arquivo: ${error}`)
                    }
                }
        }
    };
};