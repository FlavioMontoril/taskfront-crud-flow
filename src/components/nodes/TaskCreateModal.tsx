import { AlertCircle, FileText, Plus, Tag, User, X } from "lucide-react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TaskStatus, TaskType } from "../../types/taskType"
import { useApi } from "../../services/useTaskApi"
import { useTaskStore } from "../../store/task-store"
import { toast } from "sonner"
import { createTaskSchema, type CreateTaskSchema } from "../../schemas.ts/createTaskSchema"
import { useAuthStore } from "../../store/useAuthStore"
import { useUserApi } from "../../services/useUserApi"
import type { UserProps } from "../../types/userTypes"


export function TaskCreateModal() {

    const [isSubmitting, setIsSubmitting] = useState(false)
    const { taskApi } = useApi()
    const { findAllUsers } = useUserApi();
    const { addTask, setOpenModal, isOpenModalCreateTask } = useTaskStore()
    const { user } = useAuthStore();
    const [users, setUsers] = useState<UserProps[]>([])

    const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateTaskSchema>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            code: "",
            summary: "",
            description: "",
            assigneeId: undefined,
            status: TaskStatus.OPEN,
            type: TaskType.TASK,
        },
    })

    useEffect(() => {
        async function fetchUsers() {
            const response = await findAllUsers()
            setUsers(response)
        }
        fetchUsers()
    }, []);

    const onSubmit = async (data: CreateTaskSchema) => {
        setIsSubmitting(true)

        const response = await taskApi.createTask(data)
        if (response) {
            const findTask = await taskApi.getTaskById(response)
            addTask(findTask)
            toast.success("Tarefa criada com sucesso")
            setOpenModal("create", false)
        }
        setIsSubmitting(false)
    }

    const handleClose = () => {
        reset()
        setOpenModal("create", false)
    }

    if (!isOpenModalCreateTask) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center  ">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity " onClick={handleClose} />

            {/* Modal */}
            <div className="relative w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl transform transition-all max-h-[90vh] overflow-hidden">
                {/* Header */}
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white ">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Plus className="h-6 w-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Nova Tarefa</h2>
                            <p className="text-blue-100 mt-1">Crie uma nova tarefa para sua equipe</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* Code */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <FileText className="h-4 w-4 text-blue-600" />
                                Código*
                            </label>
                            <Input
                                placeholder="Digite um resumo claro da tarefa"
                                {...register("code")}
                                className={`transition-all ${errors.code ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
                            />
                            {errors.code && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                    <span className="text-sm text-red-700">{errors.code?.message}</span>
                                </div>
                            )}
                        </div>

                        {/* Summary */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <FileText className="h-4 w-4 text-blue-600" />
                                Resumo *
                            </label>
                            <Input
                                placeholder="Digite um resumo claro da tarefa"
                                {...register("summary")}
                                className={`transition-all ${errors.summary ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
                            />
                            {errors.summary && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                    <span className="text-sm text-red-700">{errors.summary.message}</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <FileText className="h-4 w-4 text-blue-600" />
                                Descrição:
                            </label>
                            <Input
                                placeholder="Digite um resumo claro da tarefa"
                                {...register("description")}
                                className={`transition-all ${errors.description ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}`}
                            />
                            {errors.description && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                    <span className="text-sm text-red-700">{errors.description.message}</span>
                                </div>
                            )}
                        </div>

                        {/* Type */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Tag className="h-4 w-4 text-purple-600" />
                                Tipo *
                            </label>
                            <select
                                className="flex items-center gap-3"
                                {...register("type")}>
                                <option>Selecione um tipo de tarefa</option>
                                <option>{TaskType.TASK}</option>
                                <option>{TaskType.SUB_TASK}</option>
                                <option>{TaskType.EPIC}</option>
                                <option>{TaskType.BUG}</option>
                            </select>
                        </div>

                        {/* Type */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <Tag className="h-4 w-4 text-purple-600" />
                                Status *
                            </label>
                            <select
                                className="flex items-center gap-3"
                                {...register("status")}>
                                <option value="">Selecione um status</option>
                                <option>{TaskStatus.OPEN}</option>
                                <option>{TaskStatus.DONE}</option>
                                <option>{TaskStatus.IN_PROGRESS}</option>
                                <option>{TaskStatus.UNDER_REVIEW}</option>
                                <option>{TaskStatus.CANCELED}</option>

                            </select>
                        </div>

                        {/* Assignees */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <User className="h-4 w-4 text-green-600" />
                                Assignees
                            </label>

                            <select {...register("assigneeId")} className="w-full border rounded-md p-2">
                                <option value="">Nenhum responsável</option>

                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-500">
                                Selecione um ou nenhum usuario para receber a tarefa
                            </p>
                        </div>


                        {/* Reporter */}
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <User className="h-4 w-4 text-green-600" />
                                Relator *
                            </label>
                            <Input
                                value={user?.name}
                                disabled

                            />
                        </div>


                        {/* Actions */}
                        <div className="flex gap-3 pt-6 border-t border-gray-200">
                            <Button type="button" variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            >
                                {isSubmitting ? "Criando..." : "Criar Tarefa"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}