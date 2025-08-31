import { useEffect, useState } from "react"
import { useTaskStore } from "../store/task-store"
import { useApi } from "../services/useTaskApi"
import type { TaskModel } from "../model/taskModel";
import { Input } from "../components/ui/input";
import { CheckSquare, Edit3, Search, Square, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RiCheckboxMultipleBlankLine, RiCheckboxMultipleLine } from "react-icons/ri"
import { AlertDialogDeleteTask } from "../components/DialogDeleteTask";
import { TaskCreateModal } from "../components/nodes/TaskCreateModal";
import { Button } from "../components/ui/button";
import { TaskStatus, TaskType } from "../types/taskType";
import type { FileResponse } from "../types/fileTypes";

type TaskTableProps = {
  onSelectTask: (task: TaskModel) => void;
  onSelectFile: (file: FileResponse) => void;
};

export function TaskTable({ onSelectTask, onSelectFile }: TaskTableProps) {
  const { taskApi, fileApi } = useApi()
  const { setTasks, taskList, setCurrentTaskId, taskId } = useTaskStore()

  const [selectType, setSelectedType] = useState<"type" | TaskType>("type")
  const [open, setOpen] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filterTask, setFilterTask] = useState<string>("")
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set())

  const navigate = useNavigate()

  const getStatusColor = (status: TaskStatus | undefined) => {
    switch (status) {
      case TaskStatus.OPEN:
        return "bg-gray-200 text-gray-600 border border-gray-300";
      case TaskStatus.DONE:
        return "bg-green-200 text-green-600 border border-green-300";
      case TaskStatus.IN_PROGRESS:
        return "bg-yellow-200 text-yellow-600 border border-yellow-300";
      case TaskStatus.UNDER_REVIEW:
        return "bg-blue-200 text-blue-600 border border-blue-300";
      default:
        return "bg-purple-200 text-purple-600 border border-purple-300";
    }
  };


  const handleNavigateEditTask = (id: string) => {
    setCurrentTaskId(id)
    navigate(`task-update/${id}`)
  }

  useEffect(() => {

    async function fetchFileDownload(id: string) {
      const { status, data } = await fileApi.getFileById(id)
      if (status === 200 && data) {
        onSelectFile(data)
      }
    }
    fetchFileDownload(taskId!)
  }, [taskId])

  useEffect(() => {
    async function fetchTasks() {
      const { status, data } = await taskApi.getAllTasks()
      if (status === 200 && data) {
        setTasks(data)
      }
    }
    fetchTasks()
  }, [])

  const handleSelectTask = (task: TaskModel) => {
    setCurrentTaskId(task.getId())
    onSelectTask(task)
  }



  const filteredTask = () => {
    const sortedTask = taskList?.sort((a, b) => new Date(b.getCreatedAt()).getTime() - new Date(a.getCreatedAt()).getTime())
    if (filterTask.length > 3) {
      return sortedTask.filter((item) =>
        item.getReporter().toLocaleLowerCase().trim().includes(filterTask.toLocaleLowerCase().trim()) ||
        item.getSummary().toLocaleLowerCase().trim().includes(filterTask.toLocaleLowerCase().trim()))
    }
    const filterType = selectType === "type" ? taskList : taskList.filter(item => item.getType() === selectType as TaskType)

    if (selectType) {
      return filterType
    }
    return taskList
  }


  const toggleTaskSelection = (id: string) => {
    const newSelected = new Set(selectedTasks)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedTasks(newSelected)
  }

  const clearSelection = () => {
    setSelectedTasks(new Set())
    setSelectionMode(false)
  }

  const handleDeleteTasks = (id: string) => {
    setCurrentTaskId(id)
    setIsOpen(true)
    clearSelection()
  }

  return (
    <div className="w-full h-[500px]">
      <div className="flex justify-end mb-6 gap-2">
        <button
          onClick={() => setOpen(true)}
          className="bg-white rounded-md border border-gray-300 shadow-sm w-24"
        >
          Create Task
        </button>
        <button
          onClick={() => {
            setSelectionMode(prev => !prev)
            setSelectedTasks(new Set())
          }}
          className={`rounded-md  px-3 py-1 flex items-center gap-1 border border-gray-200 ${selectionMode ? ' text-gray-500' : 'text-gray-300 hover:text-gray-400'}`}
          title={selectionMode ? "Cancelar Seleção" : "Selecionar"}
        >
          {selectionMode ? <RiCheckboxMultipleLine size={26} /> : <RiCheckboxMultipleBlankLine size={26} />}
          <span className="sr-only">{selectionMode ? "Cancelar Seleção" : "Selecionar"}</span>
        </button>
      </div>

      {selectionMode && (
        <div className="mb-4 flex gap-1">
          {selectedTasks.size === 1 && (
            <button
              onClick={() => {
                const taskId = Array.from(selectedTasks)[0]
                handleNavigateEditTask(taskId)
                clearSelection()
              }}
              title="Editar tarefa"
              className=" text-gray-500 px-4 py-2 rounded"
            >
              <Edit3 />
            </button>
          )}
          {selectedTasks.size > 0 && (
            <button
              onClick={() => {
                const id = Array.from(selectedTasks)[0]
                handleDeleteTasks(id)
              }}
              title="Exluir tarefa(s)"
              className=" text-red-500 px-4 py-2 rounded flex"
            >
              <Trash2 />({selectedTasks.size})
            </button>
          )}
        </div>
      )}

          <div>
            {`Total de: ${taskList.length} ${taskList.length >1 ? "taks" : "task"}` }
          </div>
      <div className="w-full bg-white rounded-sm h-11 border border-gray-200 mb-3 flex justify-between">
        <div className="relative">
          <Search className="mt-3 absolute left-3" size={18} color="gray" />
          <Input
            value={filterTask}
            placeholder="Pesquise tarefa por responsável ou resumo..."
            className="w-[300%] items-center h-7 m-auto ml-2 pl-7 mt-2 focus:outline-none focus:ring-2 focus:ring-gray-300"
            onChange={(e) => setFilterTask(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-y-auto max-h-[400px] border border-gray-200 rounded w-full">
        <table className="w-full">
          <thead className="sticky top-0 bg-white z-10 shadow">
            <tr>
              {selectionMode && <th className="px-4 py-2"></th>}
              <th className="px-4 py-2 text-left">Reporter</th>
              <th className="px-4 py-2 text-left">Assignee</th>
              <th className="px-4 py-2 text-left">Summary</th>
              <tr>
                <th>
                  <select className=" px-0 py-2 text-left font-bold cursor-pointer"
                    title="Filtrar todos os tipos"
                    value={selectType}
                    onChange={(e) => setSelectedType(e.target.value as "type" | TaskType)}
                  >
                    <option value="type">Type</option>
                    <option value={TaskType.BUG}>Bug</option>
                    <option value={TaskType.EPIC}>Epic</option>
                    <option value={TaskType.SUB_TASK}>Sub_Task</option>
                    <option value={TaskType.TASK}>Task</option>
                  </select>
                </th>
              </tr>
              <th className="px-4 py-2 text-left">Criado em</th>
              <th className="px-4 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredTask()?.length > 0 ? (
              filteredTask()?.map((item) => (
                <tr
                  key={item.getId()}
                  onClick={() => {
                    if (!selectionMode) {
                      handleSelectTask(item)
                    }
                  }
                  }
                  className={`${taskId === item.getId() ? "border-l-4 border-l-blue-300" : "border-l-0"} ? h-16 cursor-pointer border-t-2 hover:bg-gray-50`}
                >
                  {selectionMode && (
                    <td className="px-4 py-2 text-center">
                      <Button
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleTaskSelection(item.getId())
                        }}
                      >
                        {selectedTasks?.has(item.getId()) ? <CheckSquare /> : <Square />}
                      </Button>

                    </td>
                  )}
                  <td className="font-bold px-4 py-2">{item.getReporter()}</td>
                  <td className="font-bold px-4 py-2">{item.getAssignee()}</td>
                  <td className="px-4 py-2">{item.getSummary()}</td>
                  <td className="px-4 py-2">{item.getType()}</td>
                  <td className="px-4 py-2">
                    {new Date(item.getCreatedAt()).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-2">
                    <div className={`max-w-max px-3 rounded-full ${getStatusColor(item.getStatus())}`}>
                      {item.getStatus()}
                    </div>
                  </td>
                </tr>

              ))
            ) : (
              <tr>
                <td colSpan={selectionMode ? 6 : 5} className="text-center py-4">
                  Sem tarefas na busca
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {open && <TaskCreateModal isOpen={open} onClose={setOpen} />}
        {/* {open && <DialogCreateTask open={open} onOpenChange={setOpen} />} */}
        <AlertDialogDeleteTask
          id={taskId!}
          open={isOpen}
          onOpenChange={setIsOpen}
        />

      </div>
    </div>
  )
}
