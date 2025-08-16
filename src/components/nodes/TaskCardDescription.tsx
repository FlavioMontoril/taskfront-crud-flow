import { Handle, Position } from "reactflow";


export function TaskDescriptionNode({ data }: any) {

    return (
        <div className="bg-white shadow-md rounded-md p-4 border border-gray-300 w-80 h-auto">
            <label className="font-bold">Descrição</label>
            {/* Description */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4 border-l-4 border-blue-400">
                <p className="text-sm text-gray-700 leading-relaxed break-words">{data.description}</p>


                {/* Connection handles */}
                <Handle id="right" type="target" position={Position.Right} />
                <Handle id="left" type="source" position={Position.Left} />
            </div>

        </div>
    )
}   