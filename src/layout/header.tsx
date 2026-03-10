import Cookies from "js-cookie";
import { LogOut, LucideBell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../modules/hook/useAuth";
import { Button } from "../components/ui/button";

export const Header = () => {
  const { user } = useAuth()
  console.log("TUTU", user)
  const navigate = useNavigate();

  const handleLogout = async () => {
    Cookies.remove("token")
    // clearUser();
    navigate("/login");
  };


  return (
    <header className="bg-white shadow-md px-6 py-4">
      <div className="flex justify-between items-center">

        <h1 className="text-2xl font-bold text-gray-900">
          Olá{user ? `, ${user?.name}` : ""}
        </h1>

        <div className="flex items-center">
          <span className="text-sm text-gray-600">
            {user?.role?.name}
          </span>
          <Button className="p-2 rounded-full text-gray-700 hover:bg-gray-100">
            <LucideBell size={16} />
          </Button>
          <Button
            className="flex items-center py-2 text-sm text-gray-400 hover:text-gray-500"
            title="Encerrar sessão"
            onClick={handleLogout}
          >
            <LogOut size={16} />
          </Button>

          {/* <div className="relative group">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <LucideUser size={20} />
            </button>
          </div> */}
        </div>

      </div>
    </header>
  );
};
