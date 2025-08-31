import { Handle, Position } from "reactflow";
import { useState } from "react";
import { Button } from "../ui/button";
import { Eye } from "lucide-react";
import { ViewFileNode } from "./ViewFileNode";

interface FileDataProps {
    data: any;
}

export function FileDataNode({ data }: FileDataProps) {

    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="bg-white shadow-md rounded-md p-4 border border-gray-300 w-80 h-auto">
            <label className="font-bold">Dados do Arquivo</label>
            {/* Description */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4 border-l-4 border-blue-400">
                <p className="text-sm text-gray-700 leading-relaxed break-words">Nome: {data?.original_name}</p>
                <p className="text-sm text-gray-700 leading-relaxed break-words">Criado em: {data?.createdAt}</p>

                {/* Connection handles */}
                <Handle id="right" type="target" position={Position.Right} />
                <Handle id="left" type="source" position={Position.Left} />
            </div>
            <Button onClick={() => setIsOpen(true)}>
                <Eye />
            </Button>

            <ViewFileNode isOpen={isOpen} onClose={() => setIsOpen(false)} fileUrl={data?.fileUrl}/>

        </div>
    )
}