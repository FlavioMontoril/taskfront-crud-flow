// eventBus.ts
type EventCallback<T = any> = (data: T) => void;

class EventBus {
  private events: Map<string, Set<EventCallback>> = new Map();

  on<T>(event: string, callback: EventCallback<T>) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  off(event: string, callback: EventCallback) {
    this.events.get(event)?.delete(callback);
  }

  emit<T>(event: string, data?: T) {
    const callbacks = this.events.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[EventBus] Error in ${event}:`, error);
        }
      });
    }
  }

  clear() {
    this.events.clear();
  }
}

export const eventBus = new EventBus();

export const SOCKET_EVENTS = {
  GENERIC: 'GenericNotificationEvent',
} as const;