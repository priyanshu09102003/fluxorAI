import { NodeType } from "@prisma/client";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/manual-triggers/executor";
import { HTTPRequestExecutor } from "../http-request/executor";
import { googleFormExecutor } from "@/features/g-form-trigger/executor";
import { stripeTriggerExecutor } from "@/features/stripe-trigger/executor";
import { geminiExecutor } from "../ai-nodes/gemini/executor";
import { openAIExecutor } from "../ai-nodes/openai/executor";
import { AnthropicExecutor } from "../ai-nodes/anthropic/executor";
import { discordExecutor } from "../messaging-nodes/discord/executor";
import { slackExecutor } from "../messaging-nodes/slack/executor";

export const executorRegistry: Record<NodeType, NodeExecutor>={
    [NodeType.INITIAL] : manualTriggerExecutor,
    [NodeType.MANUAL_TRIGGER] : manualTriggerExecutor,
    [NodeType.HTTP_REQUEST] : HTTPRequestExecutor, 
    [NodeType.GOOGLE_FORM_TRIGGER]: googleFormExecutor,
    [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
    [NodeType.GEMINI]: geminiExecutor,
    [NodeType.ANTHROPIC]: AnthropicExecutor,
    [NodeType.OPENAI]: openAIExecutor,
    [NodeType.DISCORD]: discordExecutor,
    [NodeType.SLACK]: slackExecutor
}

export const getExecutor = (type: NodeType):NodeExecutor => {
    const executor = executorRegistry[type];
    if(!executor){
        throw new Error(`No executor found for the node type: ${type}`);
    }

    return executor;
}