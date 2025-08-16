import { create } from "zustand";
import type { TaskProps } from "../types/taskType";
import { TaskModel } from "../model/taskModel";

interface TaskStoreProps {
    task: TaskModel[],
    currentTaskId: string;
    setTasks: (task: TaskProps[] | null) => void,
    addTask: (task: TaskProps) => void,
    updateTask: (id: string, task: TaskProps) => void
    deleteTask: (id: string)=>void
    findOneTask: (id: string) => TaskModel | null;
    setCurrentTaskId:(currentTaskId: string)=>void
}

export const useTaskStore = create<TaskStoreProps>((set, get) => {

    function handleSetTasks(task: TaskProps[] | null) {
        const taskAll = task ? task.map((item) => TaskModel.build(item)) : []
        set(() => ({ task: taskAll }))
    }
    function handleAddTask(task: TaskProps) {
        const newTask = TaskModel.build(task)
        set((state) => ({ task: state.task ? [...state.task, newTask] : [newTask] }))
    }
    function handleUpdateTask(id: string, task: TaskProps) {
        const newUpdate = TaskModel.build(task)
        // set((state)=>{
        //     return {task: state.task?.filter(item => item.getId() === id ? newUpdate : item)}
        // })
        set((state) => ({
            task: state.task?.map(item => item.getId() === id ? newUpdate : item) || []
        }))
    }
    function handleDeleteTask(id: string){
        set((state)=> ({task: state.task?.filter(item => item.getId() !== id)}))
    }
    function handleFindOneTask(id: string): TaskModel | null {
        return get().task?.find(item => item.getId() === id) || null
    }
    function handleSetCurrentTaskId(id: string) {
        set(()=> ({currentTaskId: id}))
    }


    return {
        task: [],
        currentTaskId: "",
        setTasks: handleSetTasks,
        addTask: handleAddTask,
        updateTask: handleUpdateTask,
        findOneTask: handleFindOneTask,
        deleteTask: handleDeleteTask,
        setCurrentTaskId: handleSetCurrentTaskId,
    }
})