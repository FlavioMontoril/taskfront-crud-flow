export interface RoleData {
  id?: string;
  name: RoleOptions;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date | null;
  user?: User[];
}

export enum RoleOptions {
    MASTER = 'MASTER',
    ADMIN = 'ADMIN',
    COMMON = 'COMMON',
    GUEST = 'GUEST',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: RoleData;
  department: string;
}