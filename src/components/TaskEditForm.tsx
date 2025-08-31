import { AlertCircle, ArrowLeft } from "lucide-react";
import { TaskType } from "../types/taskType";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateTaskSchema, type UpdatedTaskSchema } from "../validators/updateTaskSchema";
import { useApi } from "../services/useTaskApi";
import { useTaskStore } from "../store/task-store";
import { toast } from "sonner";
import { useEffect } from "react";

export function TaskEditForm() {
    const { taskApi } = useApi()
    const { updateTask, task, setCurrentTaskId } = useTaskStore()
    const { id } = useParams()

    const navigate = useNavigate()

    const form = useForm<UpdatedTaskSchema>({
        resolver: zodResolver(updateTaskSchema),
        mode: "onChange",
    });

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = form;
    useEffect(() => {
        if (task) {
            reset({
                summary: task.getSummary(),
                description: task.getDescription(),
                assignee: task.getAssignee(),
                status: task.getStatus(),
                type: task.getType(),
                reporter: task.getReporter(),
            });
        }
    }, [task, reset]);

    const onSubmit = async (task: UpdatedTaskSchema) => {
        if (!id) return toast.error(`Tarefa não econtrada: ${id}`)
        const { status, data } = await taskApi.updateTask(id, task)
        if (status === 200 && data) {
            updateTask(id, data)
            setCurrentTaskId(null)
            navigate("/")
            toast.success("Tarefa editada com sucesso")
        } else {
            toast.error("Não foi possivel editar tarefa")
        }
    }

    return (

        // <div className="flex w-[150vh] max-h-[100vh] bg-gray-50 p-6 mt-6 overflow-y-hidden">
        <div className="w-[150vh] p-6 mx-auto mt-0">
            {/* Header */}
            <div className="flex justify-end gap-4 mb-6">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Voltar
                </button>
            </div>
            <div className="flex justify-start mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Editar Tarefa</h1>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Detalhes da Tarefa</h2>
                    <p className="text-sm text-gray-600 mt-1">
                        Forneça as informações necessárias para editar a tarefa
                    </p>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Summary */}
                        <div className="space-y-2">
                            <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                                Resumo *
                            </label>
                            <input
                                id="summary"
                                type="text"
                                placeholder="Digite um resumo claro da tarefa"
                                {...register("summary")}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.summary ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.summary && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                    <span className="text-sm text-red-700">{errors.summary.message}</span>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Descrição
                            </label>
                            <textarea
                                id="description"
                                placeholder="Descreva os detalhes da tarefa..."
                                rows={4}
                                {...register("description")}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical ${errors.description ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.description && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                    <span className="text-sm text-red-700">{errors.description.message}</span>
                                </div>
                            )}
                        </div>

                        {/*Assignee*/}
                        <div className="space-y-2">
                            <label htmlFor="reporter" className="block text-sm font-medium text-gray-700">
                                Assignee *
                            </label>
                            <input
                                id="reporter"
                                type="text"
                                placeholder="Nome do relator"
                                {...register("assignee")}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.reporter ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.reporter && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                    <span className="text-sm text-red-700">{errors.reporter.message}</span>
                                </div>
                            )}
                        </div>

                        {/* Reporter */}
                        <div className="space-y-2">
                            <label htmlFor="reporter" className="block text-sm font-medium text-gray-700">
                                Relator *
                            </label>
                            <input
                                id="reporter"
                                type="text"
                                placeholder="Nome do relator"
                                {...register("reporter")}
                                className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.reporter ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300"
                                    }`}
                            />
                            {errors.reporter && (
                                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                                    <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                    <span className="text-sm text-red-700">{errors.reporter.message}</span>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo</label>
                            <select
                                className="w-48"
                                {...register("type")}
                            >
                                <option>Selecione um status</option>
                                <option>{TaskType.TASK}</option>
                                <option>{TaskType.SUB_TASK}</option>
                                <option>{TaskType.EPIC}</option>
                                <option>{TaskType.BUG}</option>
                            </select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors sm:w-auto"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors sm:w-auto sm:ml-auto"
                            >
                                {isSubmitting ? "Editando..." : "Editar Tarefa"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        // </div>
    )
}