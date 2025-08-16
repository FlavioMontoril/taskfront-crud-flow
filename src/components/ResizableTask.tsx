import { useState } from "react";
import { Flow } from "./ReactFlow";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import type { TaskModel } from "../model/taskModel";
import { ReactFlowProvider } from "reactflow";
import { TaskTable } from "../pages/Home";



export function ResizableTask() {
    const [selectedTask, setSelectedTask] = useState<TaskModel | null>(null);
    
    return (
        <ReactFlowProvider>
            <ResizablePanelGroup
                direction="horizontal"
                className="min-h-[200px] rounded-lg border md:min-w-[1000px] border-none"
            >
                <ResizablePanel defaultSize={selectedTask ? 20 : 100} className="px-2">
                    <TaskTable onSelectTask={setSelectedTask} />
                </ResizablePanel>
                <ResizableHandle withHandle />
                {selectedTask && (
                    
                    <ResizablePanel defaultSize={80} className="py-6">
                        <div className="flex h-full  items-center justify-center p-6">
                            <Flow task={selectedTask} onClose={() => setSelectedTask(null)} />
                        </div>
                    </ResizablePanel>
                )}
            </ResizablePanelGroup>
        </ReactFlowProvider>
    )
}
