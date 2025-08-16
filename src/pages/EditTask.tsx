import { useParams } from "react-router-dom"
import { useTaskStore } from "../store/task-store"
import { TaskEditForm } from "../components/TaskEditForm"
import { toast } from "sonner"

export function TaskEdit() {
  const { findOneTask } = useTaskStore()
  const { id } = useParams()
  const loading = () => new Promise((resolve) => setTimeout(() => resolve({ name: 'Sonner' }), 2000));

  if(!id) return null
  const hasIdTask = findOneTask(id)

  if (!id) return <p>ID da tarefa não fornecido.</p>
  if (!hasIdTask) return <p>Carregando tarefa...</p>

  
  toast.promise(loading, { loading: 'Loading...', });
  return (
    <div className="h-[80vh] overflow-auto bg-gray-50 mt-0">
      <TaskEditForm task={hasIdTask} />
    </div>
  )
}
