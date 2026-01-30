import { InitialNode } from "@/components/Workflows/initial-nodes";
import { GeminiNode } from "@/features/executions/ai-nodes/gemini/node";
import { HttpRequestNode } from "@/features/executions/http-request/node";
import { GoogleFormTrigger } from "@/features/g-form-trigger/node";
import { ManualTriggerNode } from "@/features/manual-triggers/node";
import { StripeTriggerNode } from "@/features/stripe-trigger/node";
import { NodeType } from "@prisma/client";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
    [NodeType.INITIAL]: InitialNode,
    [NodeType.HTTP_REQUEST]: HttpRequestNode,
    [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
    [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTrigger,
    [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
    [NodeType.GEMINI]: GeminiNode
} as const satisfies NodeTypes

export type RegisteredNodeType = keyof typeof nodeComponents;

