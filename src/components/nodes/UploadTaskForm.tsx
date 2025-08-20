import ReactDOM from "react-dom";
import { X } from "lucide-react";
import { useApi } from "../../services/useTaskApi";
import { useForm } from "react-hook-form";
import { uploadFileSchema, type UploadFileSchema } from "../../validators/uploadFileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useFileStore } from "../../store/file-store";

interface TaskUploadFileProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string
}

export function TaskUploadFile({ isOpen, onClose, taskId }: TaskUploadFileProps) {
  const { fileApi } = useApi()
  const {addFile} = useFileStore()


  const { register, handleSubmit, formState: { errors }, } = useForm<UploadFileSchema>({
    resolver: zodResolver(uploadFileSchema),
    defaultValues: {
      file: undefined,
    }
  })

  async function onSubmit(data: UploadFileSchema) {
    console.log("Disparou", data)
    const file = data.file?.[0];
    if (!file) {
      toast.error("Selecione um arquivo");
      return;
    }

    const formData = new FormData()
    formData.append("file", file)
    formData.append("taskId", taskId)
    const { status, data: _data } = await fileApi.postFile(formData)
    if (status === 201 && _data) {
      addFile(_data.file, _data.message)
      toast.success("Arquivo enviado com sucesso")
      onClose();
    }
  }


  if (!isOpen) return null;


  const handleClose = () => {
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl p-6 z-10">
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>

          <h2 className="text-xl font-bold mb-4">Upload de Arquivo</h2>
          <p className="text-gray-600 mb-4">Selecione um arquivo para enviar:</p>

          <input
            {...register("file", { required: true })}
            type="file"
            className="mb-4"
          />

          <div className="flex justify-end gap-2">
            <button
              onClick={handleClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Enviar
            </button>
          </div>
        </div>
      </form>
    </div>,
    document.body
  );
}
