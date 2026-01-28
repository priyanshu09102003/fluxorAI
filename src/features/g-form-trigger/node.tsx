import { BaseTriggerNode } from "@/components/NodeSelector/base-trigger-nodes";
import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { GoogleFormTriggerDialog } from "./dialog";
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/google-form-trigger-channel";
import { useNodeStatus } from "@/hooks/use-node-status";
import { fetchGoogleFormTriggerRealtimeToken } from "./actions";




export const GoogleFormTrigger = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const handleOpenSettings = () => setDialogOpen(true);



        const nodeStatus = useNodeStatus({
                    nodeId: props.id,
                    channel: GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
                    topic: "status",
                    refreshToken: fetchGoogleFormTriggerRealtimeToken
        });
        
    return(
        <>
            <GoogleFormTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />

            <BaseTriggerNode 
                {...props}
                icon="/googleform.svg"
                name="Google Form"
                description="Triggered when a Google Form is submitted"
                status={nodeStatus}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        
        </>
    )
})