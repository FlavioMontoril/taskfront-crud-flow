import { Route, Routes } from "react-router-dom";
import { AppLayout } from "./layout/app-layout";
import { ResizableTask } from "./components/ResizableTask";
import { TaskCreate } from "./pages/TaskCreate";
import { TaskEdit } from "./pages/EditTask";
import { NotFoundPage } from "./pages/PageNotFound";

export function AppRoutes() {
   return (
      <Routes>
         <Route element={<AppLayout />}>
            <Route path="/" element={<ResizableTask/>} />
            <Route path="/task-create" element={<TaskCreate />} />
            <Route path="/task-update/:id" element={<TaskEdit/>}/>
            <Route path="*" element={<NotFoundPage/>}/>
         </Route>
      </Routes>
   )
}