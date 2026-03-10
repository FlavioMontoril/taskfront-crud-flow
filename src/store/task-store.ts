import { create } from "zustand";
import type { TaskProps } from "../types/taskType";
import { TaskModel } from "../model/taskModel";

interface TaskStoreProps {
    taskList: TaskModel[]
    taskId: string | null
    task: TaskModel | null
    isOpenDialogDelete: boolean
    isOpenModalCreateTask: boolean
    isOpenFlow: boolean
    setTask: (task: TaskProps | null) => void
    setTasks: (task: TaskProps[] | null) => void
    addTask: (task: TaskProps | null) => void
    updateTask: (task: TaskProps) => void
    deleteTask: (id: string) => void
    findOneTask: (id: string) => TaskModel | null
    setCurrentTaskId: (taskId: string | null) => void
    setOpenModal: (mode: "delete" | "create" | "flow", open: boolean) => void
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

    function handleUpdateTask(task: TaskProps) {
        const newTask = TaskModel.build(task);

        set((state) => {
            const exists = state.taskList?.some(
                (item) => item.getId() === newTask.getId()
            );

            if (exists) {
                return {
                    taskList: state.taskList!.map((item) =>
                        item.getId() === newTask.getId() ? newTask : item
                    ),
                };
            }

            return {
                taskList: state.taskList
                    ? [...state.taskList, newTask]
                    : [newTask],
            };
        });
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

    function handleSetOpenModal(mode: "create" | "delete" | "flow", open: boolean) {
        set((state) => {
            if (mode === "create") {
                return { isOpenModalCreateTask: open ?? !state.isOpenModalCreateTask }
            }
            if (mode === "delete") {
                return { isOpenDialogDelete: open ?? !state.isOpenDialogDelete }
            }
            return { isOpenFlow: open ?? !state.isOpenFlow }
        })
    }


    return {
        taskList: [],
        taskId: null,
        task: null,
        isOpenDialogDelete: false,
        isOpenModalCreateTask: false,
        isOpenFlow: false,
        setTask: handleSetTask,
        setTasks: handleSetTasks,
        addTask: handleAddTask,
        updateTask: handleUpdateTask,
        findOneTask: handleFindOneTask,
        deleteTask: handleDeleteTask,
        setCurrentTaskId: handleSetCurrentTaskId,
        setOpenModal: handleSetOpenModal,
    }
})