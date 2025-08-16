    import { clsx, type ClassValue } from "clsx"
    import { twMerge } from "tailwind-merge"
    import { format } from 'date-fns'

    export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
    }

    export function formatDateToPtBr(dateString:string) {
    return format(new Date(dateString), 'dd/MM/yyyy')
    }