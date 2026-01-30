
import { stripeTriggerChannel } from "@/inngest/channels/stripe-trigger-channel";
import type { NodeExecutor } from "../executions/types";


type StripeTriggerData = Record<string, unknown>

export const stripeTriggerExecutor: NodeExecutor<StripeTriggerData> = async({
    nodeId, context, step ,publish})=>
{

    //loading state for google form trigger
    await publish(
        stripeTriggerChannel().status({
            nodeId,
            status: "loading"
        })
    )

    const result = await step.run("stripe-trigger" , async() => context)

    //Success state for google form trigger

     await publish(
        stripeTriggerChannel().status({
            nodeId,
            status: "success"
        })
    )


    return result

}