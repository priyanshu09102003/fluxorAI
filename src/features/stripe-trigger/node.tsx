import { BaseTriggerNode } from "@/components/NodeSelector/base-trigger-nodes";
import { NodeProps } from "@xyflow/react";
import { memo, useState } from "react";
import { useNodeStatus } from "@/hooks/use-node-status";
import { StripeTriggerDialog } from "./dialog";
import { fetchStripeTriggerRealtimeToken } from "./actions";
import { STRIPE_TRIGGER_CHANNEL_NAME } from "@/inngest/channels/stripe-trigger-channel";




export const StripeTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const handleOpenSettings = () => setDialogOpen(true);



        const nodeStatus = useNodeStatus({
                    nodeId: props.id,
                    channel: STRIPE_TRIGGER_CHANNEL_NAME,
                    topic: "status",
                    refreshToken: fetchStripeTriggerRealtimeToken
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