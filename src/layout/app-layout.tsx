import { Outlet } from "react-router-dom";
import { Header } from "./header";
import { Toaster } from "../components/ui/sonner";

export function AppLayout(){
    return(
            <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* <Sidebar /> */}
            <div className="w-full flex flex-col shrink-0">
                <Header />
                <main className="flex-1 mx-auto">
                    <div className="py-10">
                        <Outlet />
                    </div>
                </main>
                <div>
                    <Toaster richColors position="top-center" />
                </div>
            </div>
        </div>
    )
}