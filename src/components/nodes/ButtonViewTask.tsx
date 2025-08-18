import { Handle, Position } from "reactflow";
import { Button } from "../ui/button";
import { useState } from "react";
import { ViewFileNode } from "./ViewFileNode";

export function ButtonViewFile({data}: any){

    console.log("View Id Data", data)

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
        View File
        </Button>
             {/* Connection handles */}
        {open && (
            <ViewFileNode data={data} isOpen={open} onClose={handleOpenModal}/>
        )}
                <Handle id="right" type="target" position={Position.Right} />
                <Handle id="left" type="source" position={Position.Left} />
        </div>
    )
}