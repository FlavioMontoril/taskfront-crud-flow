import { useParams } from "react-router-dom"
import { useTaskStore } from "../store/task-store"
import { TaskEditForm } from "../components/TaskEditForm"
import { useCallback, useEffect } from "react"
import type { TaskProps } from "../types/taskType"
import { useApi } from "../services/useTaskApi"

export function TaskEdit() {
  const { setTask, task, findOneTask } = useTaskStore()
  const { id } = useParams()
  const { taskApi } = useApi()

  const handlefindOneTask = useCallback(async (_id: string) => {
    const { status, data } = await taskApi.getTaskById(_id)
    if (status === 200 && data) {
      setTask(data)
    }
  }, [id])

  useEffect(() => {
    if (!id) return
    const hasTask = findOneTask(id)
    if (hasTask) {
      setTask(hasTask as unknown as TaskProps)
    }
    handlefindOneTask(id)
  }, [id])


  if (!id) return <p>ID da tarefa não fornecido.</p>
  if (!task) return <p>Carregando tarefa...</p>


  return (
    <div className="h-[80vh] overflow-auto bg-gray-50 mt-0">
      <TaskEditForm />
    </div>
  )
}
