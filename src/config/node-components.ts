import { InitialNode } from "@/components/Workflows/initial-nodes";
import { HttpRequestNode } from "@/features/executions/http-request/node";
import { ManualTriggerNode } from "@/features/manual-triggers/node";
import { NodeType } from "@prisma/client";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.HTTP_REQUEST]: HttpRequestNode,
    [NodeType.MANUAL_TRIGGER]: ManualTriggerNode
} as const satisfies NodeTypes

export type RegisteredNodeType = keyof typeof nodeComponents;

