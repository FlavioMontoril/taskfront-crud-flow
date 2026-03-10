'use client';
import Cookies from "js-cookie";
import { useEffect } from 'react';
import { useSocketConnection } from '../modules/socketStore';
import { useAuthStore } from "../store/authStore";

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const { disconnect, connectWithToken } = useSocketConnection();
    const { user } = useAuthStore();

    useEffect(() => {
        const token = Cookies.get("token");

        if (user && token) {
            connectWithToken(token);
        } else {
            disconnect();
        }

        return () => {
            disconnect();
        };
    }, [user]);

    return <>{children}</>;
}