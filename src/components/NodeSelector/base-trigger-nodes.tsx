"use client";

import { type NodeProps , Position, useReactFlow} from "@xyflow/react";
import { LucideIcon } from "lucide-react";
import Image from "next/image";
import { memo, type ReactNode, useCallback } from "react";
import { BaseNode , BaseNodeContent } from "../base-node";
import { BaseHandle } from "../base-handle";
import { WorkflowNode } from "../Workflows/workflow-node";

interface BaseTriggerNodeProps extends NodeProps{
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: ReactNode;
    onSettings?: () => void;
    onDoubleClick?:() => void;
    // status?: NodeStatus
}

export const BaseTriggerNode = memo(
    ({  id,
        icon: Icon,
        name,
        description,
        children,
        onSettings,
        onDoubleClick,

    } : BaseTriggerNodeProps) => {

        const {setNodes, setEdges} = useReactFlow();


        const handleDelete = () => {
            setNodes((currentNodes) => {
                const updatedNodes = currentNodes.filter((node) => node.id !== id);
                return updatedNodes;
            })

            setEdges((currentEdges) => {
                const updatedEdges = currentEdges.filter(
                    (edge) => edge.source !== id && edge.target !== id
                );
                return updatedEdges;
            })
        }


        return(
            <WorkflowNode name={name} description={description}  onDelete={handleDelete} onSettings={onSettings}>
                <BaseNode onDoubleClick={onDoubleClick} className="rounded-l-2xl relative group">
                    <BaseNodeContent>
                        {typeof Icon === "string" ? (
                            <Image 
                            src={Icon} 
                            alt={name} 
                            width={16} 
                            height={16} />
                        ): (
                            <Icon className="size-4 text-muted-foreground" />
                        )}
                        {children}
                        <BaseHandle 
                            id="source-1"
                            type="source"
                            position={Position.Right}
                        />
                    </BaseNodeContent>
                </BaseNode>
            </WorkflowNode>
        )
    }
)

BaseTriggerNode.displayName = "BaseTriggerNode"