import z from "zod";
import { TaskStatus, TaskType } from "../types/taskType";

export const updateTaskSchema = z.object({
    summary: z.string().min(3, "Necessário o mínimo de 3 caracteres"),
    description: z.string().min(3, "Necessário o mínimo de 3 caracteres"),
    assignee: z.string().min(1, "Necessário preencher o campo").optional(),
    status: z.enum(TaskStatus),
    type: z.enum(TaskType),
    reporter: z.string().min(3, "Necessário o mínimo de 3 caracteres"),
})
export type UpdatedTaskSchema = z.infer<typeof updateTaskSchema>