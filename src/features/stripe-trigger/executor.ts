
import type { NodeExecutor } from "../executions/types";
import { googleFormTriggerChannel } from "@/inngest/channels/google-form-trigger-channel";

type GoogleFormTriggerData = Record<string, unknown>

export const googleFormExecutor: NodeExecutor<GoogleFormTriggerData> = async({
    nodeId, context, step ,publish})=>
{

    //loading state for google form trigger
    await publish(
        googleFormTriggerChannel().status({
            nodeId,
            status: "loading"
        })
    )

    const result = await step.run("google-form-trigger" , async() => context)

    //Success state for google form trigger

     await publish(
        googleFormTriggerChannel().status({
            nodeId,
            status: "success"
        })
    )


    return result

}