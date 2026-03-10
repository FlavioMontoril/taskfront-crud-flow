import { Flow } from "./ReactFlow";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { ReactFlowProvider } from "reactflow";
import { TaskTable } from "../pages/Home";
import { useTaskStore } from "../store/task-store";
import { useFileStore } from "../store/file-store";
import { useSocketListeners } from "../modules/useSocketListener";


export function ResizableTask() {
    const { isOpenFlow, task, setOpenModal } = useTaskStore()
    const { upload } = useFileStore()

    useSocketListeners();

    return (
        <ReactFlowProvider>
            <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[200px] rounded-lg border md:min-w-[1000px] border-none "
            >
                <ResizablePanel defaultSize={isOpenFlow ? 20 : 100} className="px-2">
                    <TaskTable />
                </ResizablePanel>
                <ResizableHandle withHandle />
                {isOpenFlow && (

                    <ResizablePanel defaultSize={80} className="py-6 px-32">
                        <div className="flex h-full  items-center justify-center p-6">
                            <Flow
                                task={task!}
                                data={upload!}
                                onClose={() => setOpenModal("flow", false)}
                            />
                        </div>
                    </ResizablePanel>
                )}
            </ResizablePanelGroup>
        </ReactFlowProvider>
    )
}
