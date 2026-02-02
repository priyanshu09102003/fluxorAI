import { NonRetriableError } from "inngest";
import {decode} from "html-entities"
import ky, {type Options as KyOptions} from "ky"
import Handlebars from "handlebars"
import { NodeExecutor } from "../../types";
import prisma from "@/lib/db";
import { slackChannel } from "@/inngest/channels/slack";



Handlebars.registerHelper("json" , (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString)

    return safeString
});

type SlackData = {
    variableName?: string;
    webhookUrl?: string;
    content?: string;
}

export const slackExecutor: NodeExecutor<SlackData> = async({
    data,
    nodeId, 
    context,
    step,
    publish
})=>
    
{

    //loading state for http-request

    await publish(
        slackChannel().status({
            nodeId,
            status: "loading"
        }),
    );

    if(!data.content){
        await publish(
            slackChannel().status({
                nodeId,
                status: "error"
            })
        )

        throw new NonRetriableError("Slack Node: MessageContent is missing")
    }


    const rawContent = Handlebars.compile(data.content)(context)

    const content = decode(rawContent)

    try {

        const result = await step.run("slack-webhook" , async() => {
                if(!data.webhookUrl){
                    await publish(
                        slackChannel().status({
                            nodeId,
                            status: "error",
                        })
                    )

                    throw new NonRetriableError("Slack Node: WebhookUrl is required")
                }

                await ky.post(data.webhookUrl, {
                    json:{
                       content: content
                    }
                });

            
            if(!data.variableName){
                await publish(
                slackChannel().status({
                    nodeId,
                    status: "error"
                }))

                throw new NonRetriableError("Slack Node: Variable Name is missing")
            }

            return{
                ...context,
                [data.variableName]:{
                    messageContent: content.slice(0, 2000)
                }
            }
        });


        await publish(
            slackChannel().status({
                nodeId,
                status: "success"
            })
        );


        return result

    } catch (error) {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error"
            }),
        )

        throw error
    }



}