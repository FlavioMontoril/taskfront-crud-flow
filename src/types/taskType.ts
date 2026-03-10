export enum TaskStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    UNDER_REVIEW = "UNDER_REVIEW",
    DONE = "DONE",
    CANCELED = "CANCELED",
    ASSIGNED = "ASSIGNED",
}
export enum TaskType {
    BUG = 'BUG',
    TASK = 'TASK',
    SUB_TASK = 'SUB_TASK',
    EPIC = 'EPIC',
}
export interface TaskDto {
    code: string;
    summary: string;
    description: string;
    type: TaskType;
    status?: TaskStatus;
    assigneeId?: string;
    createdAt?: string;
}
export interface UpdateTaskDto {
    summary: string;
    description: string;
    type: TaskType;
    status?: TaskStatus;
    reporter: string;
    assignee?: string;
}
export interface TaskProps {
    id: string,
    code: string,
    summary: string,
    description: string,
    type: TaskType,
    status?: TaskStatus,
    createdAt?: Date,
    updatedAt?: Date | null,
    reporterId: string,
    assigneeId?: string | null,
    archived: boolean,
}