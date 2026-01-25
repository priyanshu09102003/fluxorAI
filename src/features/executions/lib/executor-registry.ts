import { NodeType } from "@prisma/client";

export const executorRegistry: Record<NodeType, unknown>={
    [NodeType.MANUAL_TRIGGER] : () => {},
    [NodeType.INITIAL]: () => {},
    [NodeType.HTTP_REQUEST]: () => {}
}

export const getExecutor = (type: NodeType):unknown => {
    const executor = executorRegistry[type];
    if(!executor){
        throw new Error(`No executor found for the node type: ${type}`);
    }

    return executor;
}