import { useApi } from "../../services/useTaskApi";
import { toast } from "sonner";

interface TaskDownloadFileProps {
  fileId: string;
  fileName?: string; // opcional para exibir
}

export function TaskDownloadFile({ fileId, fileName }: TaskDownloadFileProps) {
  const { fileApi } = useApi();

  const handleDownload = async () => {
    try {
      const { status, url } = await fileApi.getFileById(fileId);

      if (status === 200 && url) {
        // Inicia download abrindo a URL retornada pelo backend
        window.location.href = url;
      } else {
        toast.error("Arquivo não encontrado");
      }
    } catch (err: any) {
      console.error(err);
      toast.error("Erro ao baixar o arquivo");
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    >
      {fileName || "Download"}
    </button>
  );
}
