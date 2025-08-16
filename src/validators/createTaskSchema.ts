import z from "zod";
import { TaskType } from "../types/taskType";

export const taskCreateSchema = z.object({
    summary: z.string().min(3, "Necessário o mínimo de 3 caracteres"),
    description: z.string().min(3, "Necessário o mínimo de 3 caracteres"),
    type: z.enum(TaskType),
    reporter: z.string().min(3, "Necessário o mínimo de 3 caracteres"),
    createdAt: z.string().optional(),
})
export type TaskCreateSchema = z.infer<typeof taskCreateSchema>