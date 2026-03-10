import z from "zod"
import { TaskStatus, TaskType } from "../types/taskType"
export const createTaskSchema = z.object({
    code: z
        .string()
        .min(1, { message: "O código deve ter no mínimo 3 caracteres" }),
    summary: z.string(),
    description: z.string(),
    assigneeId: z
        .string()
        .transform((val) => (val === "" ? undefined : val))
        .optional(),
    type: z.nativeEnum(TaskType),
    status: z.nativeEnum(TaskStatus).optional(),
})

export type CreateTaskSchema = z.infer<typeof createTaskSchema>