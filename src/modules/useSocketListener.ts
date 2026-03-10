import { useEffect } from "react";
import { eventBus, SOCKET_EVENTS } from "./eventBus";
import { useNotificationStore } from "./notification/useNotificationStore";
import type { Notification } from "../types/notificationTypes";
import { useTaskStore } from "../store/task-store";
import { useApi } from "../services/useTaskApi";
import { useAuth } from "./hook/useAuth";


export const useSocketListeners = () => {
  const { user } = useAuth();
  const { taskApi } = useApi();
  const { pushRealtimeNotification } = useNotificationStore();
  const { updateTask } = useTaskStore()

  useEffect(() => {
    const handleSocketEvent = async (data: Notification) => {
      if (!user || data?.triggeredId === user?.id) return
      console.log("[SocketListener]", data);

      pushRealtimeNotification(data);

      await handleTaskEvent(data)
    };

    const unsubscribers = eventBus.on(SOCKET_EVENTS.GENERIC, handleSocketEvent);

    return unsubscribers;
  }, [user]);


  const handleTaskEvent = async (data: any) => {
    try {
      const task = await taskApi.getTaskById(data?.task?.id);
      updateTask(task);
    } catch (error) {
      console.error("[SocketListeners] Erro ao buscar produto:", error);
    }
  };
};