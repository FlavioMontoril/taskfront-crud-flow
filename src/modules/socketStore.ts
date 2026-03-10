// socketStore.ts - Focado APENAS em gerenciar conexão
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { io, Socket } from 'socket.io-client';
import { eventBus, SOCKET_EVENTS } from './eventBus';

interface SocketState {
    socket: Socket | null;
    connected: boolean;
    socketToken: string | null;
    isConnecting: boolean;

    connect: () => void;
    disconnect: () => void;
    setSocketToken: (token: string) => void;
    reconnectWithToken: (token: string) => void;
}

const SOCKET_URL = import.meta.env.VITE_PUBLIC_SOCKET_URL!;


export const useSocketStore = create<SocketState>()(
    persist(
        (set, get) => ({
            socket: null,
            connected: false,
            socketToken: null,
            isConnecting: false,

            setSocketToken: (token) => {
                set({ socketToken: token });
            },

            reconnectWithToken: (token) => {
                const { disconnect } = get();
                disconnect();
                set({ socketToken: token });
                setTimeout(() => get().connect(), 100);
            },

            connect: () => {
                const { socket, connected, isConnecting, socketToken } = get();

                if (isConnecting || socket?.connected || connected || !socketToken) {
                    return;
                }

                set({ isConnecting: true });

                if (socket) {
                    socket.removeAllListeners();
                    socket.disconnect();
                }

                const newSocket = io(SOCKET_URL, {
                    autoConnect: true,
                    reconnection: true,
                    reconnectionAttempts: 5,
                    reconnectionDelay: 1000,
                    timeout: 10000,
                    auth: { token: socketToken },
                });

                // Eventos de conexão
                newSocket.on('connect', () => {
                    console.log('[Socket] Conectado');
                    set({ connected: true, isConnecting: false, socket: newSocket });
                });

                newSocket.on('disconnect', () => {
                    console.log('[Socket] Desconectado');
                    set({ connected: false, isConnecting: false });
                });

                newSocket.on('connect_error', (error) => {
                    console.error('[Socket] Erro de conexão:', error);
                    set({ connected: false, isConnecting: false });
                });

                // 🔥 Backend manda QUALQUER evento
                newSocket.onAny((event, data) => {
                    console.log('[Socket] Evento recebido:', event, data);
                    eventBus.emit(SOCKET_EVENTS.GENERIC, data);
                });
            },

            disconnect: () => {
                const { socket } = get();
                if (socket) {
                    socket.removeAllListeners();
                    socket.disconnect();
                    set({ socket: null, connected: false, isConnecting: false });
                }
            },
        }),
        {
            name: 'socket-store',
            partialize: (state) => ({ socketToken: state.socketToken }),
            skipHydration: false,
        }
    )
);

// Hook simplificado
export const useSocketConnection = () => {
    const { connect, disconnect, connected, isConnecting, setSocketToken, reconnectWithToken } = useSocketStore();

    const connectWithToken = (token: string) => {
        setSocketToken(token);
        setTimeout(() => connect(), 50);
    };

    return { connect, disconnect, connected, isConnecting, connectWithToken, reconnectWithToken };
};

export const useSocketEmit = () => {
    const socket = useSocketStore((state) => state.socket);
    const connected = useSocketStore((state) => state.connected);

    const emit = (event: string, data?: any) => {
        if (!connected || !socket) {
            console.warn('[Socket] Não conectado');
            return false;
        }
        socket.emit(event, data);
        return true;
    };

    return { emit, connected };
};