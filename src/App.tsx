import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes";
import { AuthProvider } from "./provider/authProvider";
import { SocketProvider } from "./provider/socketProvider";

export function App() {

  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <AppRoutes />
        </SocketProvider>
      </AuthProvider>
    </Router>
  )
}

