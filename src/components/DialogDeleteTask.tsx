import { toast } from "sonner";
import { useApi } from "../services/useTaskApi";
import { useTaskStore } from "../store/task-store";
import { useNavigate } from "react-router-dom";

interface AlertDialogProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AlertDialogDeleteTask({ open, onOpenChange, id }: AlertDialogProps) {
  const { taskApi } = useApi()
  const { deleteTask } = useTaskStore()
  const navigate = useNavigate()

  console.log("ID", id)

  if (!open) return null;

  async function handleDeleteTask() {
    console.log("Chegou aqui ?")
    const { status } = await taskApi.deleteTask(id)
    if (status === 204) {
      deleteTask(id)
      toast.success(`Tarefa excluida: ${id}`)
      navigate("/")
      onOpenChange(false)
    } else {
      toast.error(`Impossível deletar tarefa: ${id}`)
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
            onClick={() => onOpenChange(false)}
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
