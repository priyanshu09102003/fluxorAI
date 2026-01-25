import { NodeType } from "@prisma/client";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/manual-triggers/executor";
import { HTTPRequestExecutor } from "../http-request/executor";

export const executorRegistry: Record<NodeType, NodeExecutor>={
    [NodeType.INITIAL] : manualTriggerExecutor,
    [NodeType.MANUAL_TRIGGER] : manualTriggerExecutor,
    [NodeType.HTTP_REQUEST] : HTTPRequestExecutor,

}

export const getExecutor = (type: NodeType):NodeExecutor => {
    const executor = executorRegistry[type];
    if(!executor){
        throw new Error(`No executor found for the node type: ${type}`);
    }

    return executor;
}