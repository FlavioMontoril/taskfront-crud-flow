import { create } from "zustand";
import type { TaskProps } from "../types/taskType";
import { TaskModel } from "../model/taskModel";

interface TaskStoreProps {
    taskList: TaskModel[]
    taskId: string | null
    task: TaskModel | null
    setTask: (task: TaskProps | null) => void
    setTasks: (task: TaskProps[] | null) => void
    addTask: (task: TaskProps | null) => void
    updateTask: (id: string, task: TaskProps) => void
    deleteTask: (id: string) => void
    findOneTask: (id: string) => TaskModel | null
    setCurrentTaskId: (taskId: string | null) => void
}

export const useTaskStore = create<TaskStoreProps>((set, get) => {

    function handleSetTasks(task: TaskProps[] | null) {
        const taskAll = task ? task.map((item) => TaskModel.build(item)) : []
        set(() => ({ taskList: taskAll }))
    }

    function handleAddTask(task: TaskProps | null) {
        const newTask = TaskModel.build(task!)
        set((state) => ({ taskList: state.taskList ? [...state.taskList, newTask] : [newTask] }))
    }

    function handleSetTask(task: TaskProps | null) {
        const newTask = TaskModel.build(task!)
        set(() => ({ task: newTask }))
    }

    function handleUpdateTask(id: string, task: TaskProps) {
        const newUpdate = TaskModel.build(task)
        set((state) => ({
            taskList: state.taskList?.map(item => item.getId() === id ? newUpdate : item) || []
        }))
    }

    function handleDeleteTask(id: string) {
        set((state) => ({ taskList: state.taskList?.filter(item => item.getId() !== id) }))
    }

    function handleFindOneTask(id: string): TaskModel | null {
        return get().taskList?.find(item => item.getId() === id) || null
    }
    
    function handleSetCurrentTaskId(id: string | null) {
        set(() => ({ taskId: id }))
    }


    return {
        taskList: [],
        taskId: null,
        task: null,
        setTask: handleSetTask,
        setTasks: handleSetTasks,
        addTask: handleAddTask,
        updateTask: handleUpdateTask,
        findOneTask: handleFindOneTask,
        deleteTask: handleDeleteTask,
        setCurrentTaskId: handleSetCurrentTaskId,
    }
})