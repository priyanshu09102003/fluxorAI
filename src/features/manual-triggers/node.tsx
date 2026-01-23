import { BaseTriggerNode } from "@/components/NodeSelector/base-trigger-nodes";
import { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";
import { memo } from "react";

export const ManualTriggerNode = memo((props: NodeProps) => {
    return(
        <>
            <BaseTriggerNode 
                {...props}
                icon={MousePointerIcon}
                name="On clicking 'Execute Workflow'"
                // status={nodeStatus}
                // onSettings={handleOpenSettings}
                // onDoubleClick={handleOpenSettings}
            />
        
        </>
    )
})