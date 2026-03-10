import type { RoleOptions } from "./tokenType";

export interface UserProps {
    id: string;
    name: string;
    email: string;
    department?: string;
    role: {
        id: string;
        name: RoleOptions;
    };
}
