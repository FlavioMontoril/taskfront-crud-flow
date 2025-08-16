import { Handle, Position } from "reactflow";
import { Button } from "../ui/button";
import { useState } from "react";
import { TaskUploadFile } from "./UploadTaskForm";

export function ButtonUploadTask(){

    const [open, setIsOpen] = useState<boolean>(false)

    const handleOpenModal = () => {
        setIsOpen(prev => !prev)
    }

    return(
        <div>
        <Button
        className="bg-white shadow"
        variant="secondary"
        onClick={() => handleOpenModal()}
        > 
        Upload
        </Button>
             {/* Connection handles */}
        {open && (
            <TaskUploadFile isOpen={open} onClose={handleOpenModal}/>
        )}
                <Handle id="right" type="target" position={Position.Right} />
                <Handle id="left" type="source" position={Position.Left} />
        </div>
    )
}