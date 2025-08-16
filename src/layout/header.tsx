import { LucideBell, LucideUser } from "lucide-react"

export const Header = () => {
    return (
        <header className="bg-white shadow-md pl-64">

            <div className="flex justify-between items-start">

                <h1 className="text-2xl font-bold text-gray-900">Hello Header</h1>

                <div className="flex justify-end">
                    <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <LucideBell size={20} />
                    </button>
                    <button className=" p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <LucideUser size={20} />
                    </button>
                </div>
            </div>


        </header>
    )
}