import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../modules/hook/useAuth";
import { useAuthApi } from "../services/useAuthApi";

export interface AuthResponse {
  token: string;
}

export function Login() {
  const { login } = useAuth();
  const { login: loginApi } = useAuthApi();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { token } = await loginApi(email, password);

      if (typeof token !== "string") {
        throw new Error("Token inválido");
      }

      await login(token)
      navigate("/");

    } catch (error) {
      console.error(error);
      alert("Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        className="bg-white p-6 rounded shadow-md w-80"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-4">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
