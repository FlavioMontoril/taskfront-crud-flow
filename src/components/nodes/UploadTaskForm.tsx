import { useRef } from "react";
import ReactDOM from "react-dom";
import { X } from "lucide-react";

interface TaskUploadFileProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload?: (file: File) => void;
}

export function TaskUploadFile({ isOpen, onClose, onUpload }: TaskUploadFileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onUpload?.(event.target.files[0]);
    }
  };

  const handleClose = () => {
    if (fileInputRef.current) fileInputRef.current.value = "";
    onClose();
  };

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
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
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
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
            onClick={() => {
              if (fileInputRef.current?.files?.[0]) {
                onUpload?.(fileInputRef.current.files[0]);
                handleClose();
              }
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
