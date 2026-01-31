import { NodeType } from "@prisma/client";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/manual-triggers/executor";
import { HTTPRequestExecutor } from "../http-request/executor";
import { googleFormExecutor } from "@/features/g-form-trigger/executor";
import { stripeTriggerExecutor } from "@/features/stripe-trigger/executor";
import { geminiExecutor } from "../ai-nodes/gemini/executor";

export const executorRegistry: Record<NodeType, NodeExecutor>={
    [NodeType.INITIAL] : manualTriggerExecutor,
    [NodeType.MANUAL_TRIGGER] : manualTriggerExecutor,
    [NodeType.HTTP_REQUEST] : HTTPRequestExecutor, 
    [NodeType.GOOGLE_FORM_TRIGGER]: googleFormExecutor,
    [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
    [NodeType.GEMINI]: geminiExecutor,
    [NodeType.ANTHROPIC]: geminiExecutor,
    [NodeType.OPENAI]: geminiExecutor,
}

export const getExecutor = (type: NodeType):NodeExecutor => {
    const executor = executorRegistry[type];
    if(!executor){
        throw new Error(`No executor found for the node type: ${type}`);
    }

    return executor;
}