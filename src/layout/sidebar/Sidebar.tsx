import type { ElementType } from "react"
import { SideLink } from "./SideLink"
import { LucideFileText, LucideHouse, LucideSettings, LucideSettings2 } from "lucide-react"

interface SidebarOptions { id: string, to: string, icon: ElementType, text: string }

export const Sidebar: React.FC = () => {

    const sideOptions: SidebarOptions[] = [
        { id: "dashboard", to: "/", icon: LucideHouse, text: "Dashboard" },
        { id: "documents", to: "/documents", icon: LucideFileText, text: "Documents" },
        { id: "createMachine", to: "/task-create", icon: LucideSettings, text: "TaskCreate" },
        { id: "updateMachine", to: "/task-update", icon: LucideSettings2, text: "TaskUpdate" },

    ]

    return (

        <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2">

            <nav>
                {sideOptions.map((option) =>
                    <SideLink
                        key={option.id}
                        to={option.to}
                        icon={option.icon}
                        text={option.text}
                    />
                )}
            </nav>
        </div>

    )
}