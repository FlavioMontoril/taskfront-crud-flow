import { useEffect, useState } from "react"
import { X, FileText, Loader2 } from "lucide-react"
import { useApi } from "../../services/useTaskApi"
import { createPortal } from "react-dom"

interface ViewFileProps {
  isOpen: boolean
  onClose: (isOpen: boolean) => void
  data: any
}

export function ViewFileNode({ data, isOpen, onClose }: ViewFileProps) {
  console.log("Dt", data)
  const { fileApi } = useApi()
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    async function fetchFile() {
      setLoading(true)
      try {
        const { status, url } = await fileApi.getFileById(data.taskId)
        if (status === 200 && url) {
          setFileUrl(url)
        }
      } catch (err) {
        console.error("Erro ao buscar arquivo:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchFile()
  }, [isOpen, data.taskId, fileApi])

  if (!isOpen) return null

  return createPortal (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Visualização de Arquivo</h2>
              <p className="text-sm text-white/80">Arquivo da tarefa</p>
            </div>
          </div>
          <button
            className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
            onClick={() => onClose(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 h-[calc(100%-80px)]">
          {loading && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin mb-4" />
              <p className="text-lg font-medium">Carregando arquivo...</p>
              <p className="text-sm text-gray-400">Por favor, aguarde</p>
            </div>
          )}

          {!loading && fileUrl && (
            <iframe
              src={fileUrl}
              title="Visualização do arquivo"
              className="w-full h-full border border-gray-200 rounded-lg shadow-sm"
            />
          )}

          {!loading && !fileUrl && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <FileText className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg font-medium">Arquivo não encontrado</p>
              <p className="text-sm text-gray-400">O arquivo solicitado não pôde ser carregado</p>
            </div>
          )}
        </div>
      </div>
    </div>,
      document.body
  )
}
