import { create } from "zustand";
import type { Notification } from "../../types/notificationTypes";

interface NotificationState {
    realtimeQueue: Notification[];
    notifications: Notification[];
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
    isLoading: boolean;

    pushRealtimeNotification: (notification: Notification) => void;
    mergeRealtimeIntoList: () => void;
    setLoading: (loading: boolean) => void;
    setNotifications: ({
        data,
        // total,
        // page,
        // limit,
    }: {
        data: Notification[];
        // total: number;
        // page: number;
        // limit: number;
    }) => void;
    removeNotification: (id: string) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    resetPagination: () => void;
}

export const useNotificationStore = create<NotificationState>()((set, get) => ({
    notifications: [],
    realtimeQueue: [],
    page: 1,
    limit: 5,
    total: 0,
    hasMore: true,
    isLoading: false,

    pushRealtimeNotification: (notification) => {

        const { realtimeQueue, notifications } = get();

        const exists =
            realtimeQueue.some((n) => n.id === notification.id) ||
            notifications.some((n) => n.id === notification.id);

        if (exists) return;

        set((state) => ({
            realtimeQueue: [notification, ...state.realtimeQueue],
            total: state.total + 1,
        }));

    },

    mergeRealtimeIntoList: () => {
        set((state) => {
            if (state.realtimeQueue.length === 0) return state;

            const existingIds = new Set(state.notifications.map((n) => n.id));

            const newOnes = state.realtimeQueue.filter((n) => !existingIds.has(n.id));

            if (newOnes.length === 0) {
                return { realtimeQueue: [] };
            }
            const maxItems = Math.max(state.page, 1) * state.limit;

            return {
                notifications: [...newOnes, ...state.notifications].slice(0, maxItems),
                realtimeQueue: [],
            };
        });
    },

    setLoading: (loading) => set({ isLoading: loading }),

    setNotifications: ({ data,
        //  total, page, limit 
        }) => {
        set(() => {

            // const hasMore = data.length < total;

            return {
                notifications: data,
                // total,
                // page,
                // limit,
                // hasMore,
                isLoading: false,
            };
        });
    },

    removeNotification: (id) => {
        set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            return {
                notifications: state.notifications.filter((n) => n.id !== id),
                total:
                    notification && !notification?.read
                        ? Math.max(0, state.total - 1)
                        : state.total,
            };
        });
    },

    markAsRead: (id: string) => {
        set((state) => ({
            notifications: state.notifications.map((n) =>
                n.id === id ? { ...n, read: true } : n,
            ),
            total: Math.max(state.total - 1, 0),
        }));
    },

    markAllAsRead: () => {
        set(() => ({
            notifications: [],
            realtimeQueue: [],
            page: 0,
            total: 0,
            hasMore: false,
        }));
    },

    resetPagination: () => {
        set((state) => ({
            notifications: state.notifications.slice(0, state.limit),
            page: 1,
            hasMore: true,
            isLoading: false,
        }));
    },
}));