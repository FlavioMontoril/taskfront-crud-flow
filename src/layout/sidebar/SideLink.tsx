import type { ElementType } from "react";
import { Link } from "react-router-dom"

interface SideLinkProps {
    to: string;
    icon: ElementType;
    text: string;
}

export const SideLink: React.FC<SideLinkProps> = ({ to, icon: Icon, text }) => {
    return (
        <Link to={to}
            className="block py-2.5 px-4 transition duration-200  hover:bg-gray-700 hover:text-white"
        >
            <Icon size={20} className="inline-block mr-2" />
            <span>{text}</span>
        </Link>
    )
}