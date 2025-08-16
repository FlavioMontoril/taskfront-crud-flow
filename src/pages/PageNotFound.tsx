import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-9xl font-extrabold text-gray-300">404</h1>
      <p className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
        Página não encontrada
      </p>
      <p className="text-gray-500 mb-8">
        Ops! A página que você está procurando não existe.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Voltar para Home
      </button>
    </div>
  );
}
