import { toast } from "sonner";
import { useApi } from "../services/useTaskApi";
import { useTaskStore } from "../store/task-store";
import { useNavigate } from "react-router-dom";


export function AlertDialogDeleteTask() {
  const { taskApi } = useApi()
  const { deleteTask, setCurrentTaskId, setOpenModal, taskId } = useTaskStore()
  const navigate = useNavigate()

  if (!open) return null;

  async function handleDeleteTask() {
    const { status } = await taskApi.deleteTask(taskId!)
    if (status === 204) {
      deleteTask(taskId!)
      toast.success(`Tarefa excluida: ${taskId}`)
      setCurrentTaskId(null)
      navigate("/")
      setOpenModal("delete", false)
    } else {
      toast.error(`Impossível deletar tarefa: ${taskId}`)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-2">Excluir tarefas</h2>
        <p className="text-sm text-gray-600 mb-4">
          Tem certeza que deseja excluir a(s) tarefa(s) selecionada(s)?
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setOpenModal("delete", false)}
            className="px-4 py-2 border rounded-md hover:bg-gray-100 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleDeleteTask}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}
