import type { TaskProps, TaskStatus, TaskType } from "../types/taskType";

export class TaskModel {

    private id: string;
    private code: string;
    private summary: string;
    private description: string;
    private type: TaskType;
    private status?: TaskStatus;
    private createdAt: Date;
    private updatedAt?: Date;
    private reporterId: string;
    private assigneeId?: string;
    private archived: boolean;

    constructor(data: TaskProps) {
        this.id = data.id;
        this.code = data.code;
        this.summary = data.summary;
        this.description = data.description;
        this.type = data.type;
        this.status = data.status;
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : undefined;
        this.reporterId = data.reporterId;
        this.assigneeId = data.assigneeId ?? undefined;
        this.archived = data.archived;

    }

    static build(data: TaskProps): TaskModel {
        return new TaskModel(data)
    }

    getId(): string {
        return this.id;
    }
    getCode(): string {
        return this.code;
    }
    getSummary(): string {
        return this.summary;
    }
    getDescription(): string {
        return this.description;
    }
    getType(): TaskType {
        return this.type;
    }
    getStatus(): TaskStatus | undefined {
        return this.status;
    }
    getCreatedAt(): Date {
        return this.createdAt
    }
    getUpdatedAt(): Date | undefined {
        return this.updatedAt;
    }
    getReporterId(): string {
        return this.reporterId;
    }
    getAssigneeId(): string | null | undefined {
        return this.assigneeId;
    }
    getArchived(): boolean {
        return this.archived;
    }
}