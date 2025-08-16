import type { TaskProps, TaskStatus, TaskType } from "../types/taskType";

export class TaskModel {

    private id: string;
    private summary: string;
    private description: string;
    private type: TaskType;
    private status?: TaskStatus;
    private createdAt: Date;
    private updatedAt?: Date;
    private assignee?: string;
    private reporter: string;

    constructor(data: TaskProps) {
        this.id = data.id;
        this.summary = data.summary;
        this.description = data.description;
        this.type = data.type;
        this.status = data.status;
        this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
        this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : undefined;
        this.assignee = data.assignee;
        this.reporter = data.reporter;
    }

    static build(data: TaskProps): TaskModel{
        return new TaskModel(data)
    }

    getId(): string{
        return this.id;
    }
    getSummary(): string{
        return this.summary;
    }
    getDescription(): string{
        return this.description;
    }
    getType(): TaskType{
        return this.type;
    }
    getStatus(): TaskStatus | undefined{
        return this.status;
    }
    getCreatedAt(): Date {
        return this.createdAt
    }
    getUpdatedAt(): Date | undefined{
        return this.updatedAt;
    }
    getAssignee(): string | undefined{
        return this.assignee;
    }
    getReporter(): string{
        return this.reporter;
    }
}