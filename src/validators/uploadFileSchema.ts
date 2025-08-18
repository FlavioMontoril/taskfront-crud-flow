import z from "zod";

export const uploadFileSchema = z.object({
    file: z
        .any()
        .refine((files) => files?.length > 0, "Obrigatório selecionar um arquivo")
        .refine(
            (files) => files && files[0]?.type === "application/pdf",
            "Apenas arquivos PDF são permitidos"
        ),
})

export type UploadFileSchema = z.infer<typeof uploadFileSchema>