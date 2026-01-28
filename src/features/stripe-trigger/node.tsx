import { BaseTriggerNode } from "@/components/NodeSelector/base-trigger-nodes";
import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/google-form-trigger-channel";
import { useNodeStatus } from "@/hooks/use-node-status";
import { fetchGoogleFormTriggerRealtimeToken } from "./actions";
import { StripeTriggerDialog } from "./dialog";




export const StripeTriggerNode = memo((props: NodeProps) => {
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
            <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />

            <BaseTriggerNode 
                {...props}
                icon="/stripe.svg"
                name="STRIPE"
                description="When a Stripe event is captured"
                status={nodeStatus}
                onSettings={handleOpenSettings}
                onDoubleClick={handleOpenSettings}
            />
        
        </>
    )
})