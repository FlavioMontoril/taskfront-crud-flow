interface Task {
  id: string;
  summary: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  read: boolean;
  occurredOn: string; // ISO date string
  triggeredId: string;
  task: Task;
}
