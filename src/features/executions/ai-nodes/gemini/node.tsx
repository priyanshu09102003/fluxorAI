"use client";

import { Node , NodeProps, useReactFlow } from "@xyflow/react";


import { memo , useState } from "react";
import { BaseExecutionNode } from "@/components/NodeSelector/base-execution-node";

import { useNodeStatus } from "@/hooks/use-node-status";
import { fetchHttpRequestRealtimeToken } from "./actions";
import { HTTP_REQUEST_CHANNEL_NAME } from "@/inngest/channels/http-request";
import { GeminiDialog, GeminiFormValues } from "./gemini-dialog";



type GeminiNodeData = {
    variableName?: string;
    model?:  "gemini-1.5-flash" | "gemini-1.5-flash-8b" |"gemini-1.5-pro" | "gemini-1.0-pro" | "gemini-pro" 
    systemPrompt: string;
    userPrompt: string
}

type GeminiNodeType = Node<GeminiNodeData>;

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const {setNodes} = useReactFlow()

    const handleOpenSettings = () => setDialogOpen(true)

    const handleSubmit = (values: GeminiFormValues) => {
        setNodes((nodes) => nodes.map((node) => {
            if(node.id === props.id){
                return{
                    ...node,
                    data:{
                        ...node.data,
                        ...values
                    }
                }
            }

            return node
        }))
    }

    const nodeData = props.data;
    const description = nodeData?.userPrompt
    ? `${nodeData.model || "gemini-1.5-flash"}:${nodeData.userPrompt.slice(0,50)}...`:"Not Configured";

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: HTTP_REQUEST_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchHttpRequestRealtimeToken
    });

    return(
        <>
            <GeminiDialog 
            open = {dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={handleSubmit}
            defaultValues={nodeData}
            />

            <BaseExecutionNode
                {...props}
                id={props.id}
                icon="/gemini.svg"
                name="Gemini"
                status={nodeStatus}
                description={description}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        
        </>
    )
})
GeminiNode.displayName = "GeminiNode"