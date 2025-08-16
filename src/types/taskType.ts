export enum TaskStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    UNDER_REVIEW = "UNDER_REVIEW",
    DONE = "DONE"
}
export enum TaskType {
    BUG = 'BUG',
    TASK = 'TASK',
    SUB_TASK = 'SUB_TASK',
    EPIC = 'EPIC',
}
export interface TaskDto {
    summary: string;
    description: string;
    type: TaskType;
    createdAt?: string;
    assignee?: string;
    reporter: string;
}
export interface UpdateTaskDto {
    summary: string;
    description: string;
    type: TaskType;
    status?: TaskStatus;
    assignee?: string;
    reporter: string;
}
export interface TaskProps {
    readonly id: string;
    summary: string;
    description: string;
    type: TaskType;
    status?: TaskStatus;
    createdAt?: string;
    updatedAt?: string;
    assignee?: string;
    reporter: string;
}