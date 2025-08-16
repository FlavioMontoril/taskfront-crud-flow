// import { Handle, Position } from "reactflow"


// export function TaskCardNode({ data }: any) {


//     return (
//         <div className="bg-white shadow-md rounded-md p-4 border border-gray-300 w-80 h-auto">
//             <div className="font-bold mb-2">{data.reporter}</div>
//             <div className="font-bold mb-2">{data.assignee}</div>
//             <div className="text-sm text-gray-700">{data.summary}</div>
//             {/* <div className="text-xs text-gray-700 border border-b-4 border-l-4 border-gray-200 rounded-md p-1 whitespace-normal break-words w-full">{data.description}</div> */}
//             <div className="text-xs text-gray-500 mt-2">Tipo: {data.type}</div>
//             <div className="text-xs text-gray-500 mt-2">Status: {data.type}</div>
//             <div className="text-xs text-gray-400">Criado em: {data.createdAt}</div>

//             {/* Connection handles */}
//             <Handle id="right" type="target" position={Position.Right} />
//             <Handle id="left" type="source" position={Position.Left} />
//         </div>

//     )
// }

import { Handle, Position } from "reactflow"
import { Calendar, User, Tag, Activity } from "lucide-react"


export function TaskCardNode({ data }: any) {
  const safeData = {
    assignee: data?.assignee || "Não atribuído",
    summary: data?.summary || "Sem título",
    description: data?.description || "Sem descrição",
    type: data?.type || "Task",
    status: data?.status || "Pending",
    createdAt: data?.createdAt || new Date().toLocaleDateString(),
  }

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
      case "done":
        return "bg-emerald-100 text-emerald-700 border-emerald-200"
      case "in progress":
      case "active":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "pending":
      case "todo":
        return "bg-amber-100 text-amber-700 border-amber-200"
      case "blocked":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  // Type color mapping
  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "bug":
        return "bg-red-50 text-red-600 border-red-200"
      case "feature":
        return "bg-purple-50 text-purple-600 border-purple-200"
      case "task":
        return "bg-blue-50 text-blue-600 border-blue-200"
      case "improvement":
        return "bg-green-50 text-green-600 border-green-200"
      default:
        return "bg-gray-50 text-gray-600 border-gray-200"
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-200 w-80 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      {/* Header with assignee */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-white" />
        </div>
        <div className="font-semibold text-gray-900 text-sm">{safeData.assignee}</div>
      </div>

      {/* Summary */}
      <h3 className="font-bold text-gray-900 text-base mb-3 leading-tight">{safeData.summary}</h3>

      {/* Tags section */}
      <div className="flex flex-wrap gap-2 mb-4">
        {/* Type badge */}
        <div
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(safeData.type)}`}
        >
          <Tag className="w-3 h-3" />
          {safeData.type}
        </div>

        {/* Status badge */}
        <div
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(safeData.status)}`}
        >
          <Activity className="w-3 h-3" />
          {safeData.status}
        </div>
      </div>

      {/* Footer with creation date */}
      <div className="flex items-center gap-1 text-xs text-gray-500 pt-2 border-t border-gray-100">
        <Calendar className="w-3 h-3" />
        <span>Criado em: {safeData.createdAt}</span>
      </div>

      {/* Connection handles */}
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500 border-2 border-white shadow-md" />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 bg-blue-500 border-2 border-white shadow-md"
      />
    </div>
  )
}
