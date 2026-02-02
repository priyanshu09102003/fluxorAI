import { NonRetriableError } from "inngest";
import {createOpenAI} from "@ai-sdk/openai"
import {generateText} from "ai"
import ky, {type Options as KyOptions} from "ky"
import Handlebars from "handlebars"
import { NodeExecutor } from "../../types";
import { openaiChannel } from "@/inngest/channels/openai";
import prisma from "@/lib/db";


Handlebars.registerHelper("json" , (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString)

    return safeString
});

type OpenAIData = {
    variableName?: string;
    systemPrompt?: string;
    userPrompt?: string;
    credentialId?: string;
}

export const openAIExecutor: NodeExecutor<OpenAIData> = async({
    data,
    nodeId, 
    context, 
    userId,
    step,
    publish
})=>
    
{

    //loading state for http-request

    await publish(
        openaiChannel().status({
            nodeId,
            status: "loading"
        }),
    );


    if(!data.variableName){
        await publish(
        openaiChannel().status({
            nodeId,
            status: "error"
        }))

        throw new NonRetriableError("OpenAI Node: Variable Name is missing")
    }

     if(!data.credentialId){
                await publish(
                    openaiChannel().status({
                        nodeId,
                        status: "error",
                    })
                )
        
                throw new NonRetriableError("OpenAI Node: Credential is required")
        }

    if(!data.userPrompt){
        await publish(
            openaiChannel().status({
                nodeId,
                status: "error"
            })
        )

        throw new NonRetriableError("OpenAI Node: User Prompt is missing")
    }



    const systemPrompt = data.systemPrompt?Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant. Help me to do ...";

    const userPrompt = Handlebars.compile(data.userPrompt)(context)


    //FETCH CREDENTIAL USER SELECTED
        const credential = await step.run("get-credential", () => {
            return prisma.credential.findUnique({
                where:{
                    id: data.credentialId,
                    userId
                }
            })
        })
    
        if(!credential){
            throw new NonRetriableError("Anthropic Node: Credential not found")
        }


    const openAI = createOpenAI({
        apiKey: credential.value,
    })

    try {

        const {steps} = await step.ai.wrap(
            "openai-generate-text",
            generateText,
            {
                model: openAI("gpt-4"),
                system: systemPrompt,
                prompt: userPrompt,
                experimental_telemetry:{
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true
                }
            },
        )
        
        const text = steps[0].content[0].type === "text" ? steps[0].content[0].text : "";


        await publish(
            openaiChannel().status({
                nodeId,
                status: "success"
            })
        );


        return {
            ...context,
            [data.variableName]:{
                text
            }
        }

    } catch (error) {
        await publish(
            openaiChannel().status({
                nodeId,
                status: "error"
            }),
        )

        throw error
    }



}