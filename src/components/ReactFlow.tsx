import { useCallback, useEffect } from 'react';
import 'reactflow/dist/style.css';
import { zinc } from "tailwindcss/colors"
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useEdgesState,
    useNodesState,
    addEdge,
    ConnectionMode,
    ControlButton,
} from 'reactflow';
import type { Connection, Node, NodeTypes } from 'reactflow';
import type { TaskModel } from '../model/taskModel';
import { TaskCardNode } from './nodes/TaskCardNode';
import { X } from 'lucide-react';
import { TaskDescriptionNode } from './nodes/TaskCardDescription';
import { ButtonUploadTask } from './nodes/ButtonUploadTask';
import { FileDataNode } from './nodes/FileDataNodes';
import type { FileResponse } from '../types/fileTypes';

type FlowProps = {
    task: TaskModel;
    onClose: () => void;
    data: FileResponse;
};

const nodeTypes: NodeTypes = {
    taskCard: TaskCardNode,
    taskDescriptionCard: TaskDescriptionNode,
    fileUpload: ButtonUploadTask,
    fileData: FileDataNode,
};
export function Flow({ task, onClose, data }: FlowProps) {

    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);


    const onConnect = useCallback((connection: Connection) => {
        return setEdges(edges => addEdge(connection, edges))
    }, [])


    // Atualiza o node sempre que task mudar
    useEffect(() => {

        const newNode: Node[] =
            [
                {
                    id: task.getId(),
                    type: 'taskCard',
                    position: { x: 1, y: 100 },
                    data: {
                        assignee: task.getAssignee(),
                        summary: task.getSummary(),
                        type: task.getType(),
                        description: task.getDescription(),
                        createdAt: new Date(task.getCreatedAt()).toLocaleDateString('pt-BR'),
                    },
                },
                {
                    id: `task-desc-${task.getId()}`,
                    type: 'taskDescriptionCard',
                    position: { x: 600, y: 400 },
                    data: {
                        description: task.getDescription(),
                    },
                },
                {
                    id: 'upload-btn',
                    type: 'fileUpload', // usa seu ButtonCreateTask
                    position: { x: 5, y: 30 },
                    data: {taskId: task.getId() }
                },
            ];

        if (data) {
            newNode.push({
                id: data?.file?.id,
                type: 'fileData',
                position: { x: 200, y: 400 },
                data: {
                    fileUrl: data?.fileUrl,
                    original_name: data?.file?.original_name,
                    file_path: data?.file?.file_path,
                    taskId: task.getId(),
                    createdAt: new Date(data?.file?.created_at ?? new Date()).toLocaleDateString('pt-BR'),
                },
            });
        }

        const newEdges = [
            {
                id: `edge-${task.getId()}`,
                source: task.getId(),
                target: `task-desc-${task.getId()}`,
                type: 'smoothstep', // ou 'straight' se quiser linha reta
                animated: true,
            },
            {
                id: `edgebtn-${task.getId()}`,
                source: 'upload-btn',
                target: task.getId(),
                type: 'smoothstep', // ou 'straight' se quiser linha reta
                animated: true,
            },
        ];

        if (data) {
            newEdges.push({
                id: `edgefiledata-${data?.file?.id}`,
                source: task.getId(),
                target: data?.file?.id,
                type: 'smoothstep',
                animated: true,
            });
        }


        setNodes(newNode);
        setEdges(newEdges); // limpa edges se necessário
    }, [task, data, setNodes, setEdges]);


    return (
        <div style={{ right: '300px', width: '1060px', height: '730px', bottom: '180px' }} className="relative rounded-md">

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                connectionMode={ConnectionMode.Loose}
                fitView
                fitViewOptions={{ padding: 0.8 }}
                nodesDraggable={true}
            >
                <Background
                    gap={12}
                    size={2}
                    color={zinc[300]} />
            </ReactFlow>
            <MiniMap />
            <Controls>
                <ControlButton
                    title='Fechar'
                    onClick={onClose}>
                    <X color='black' />
                </ControlButton>
            </Controls>
        </div>
    );
}
