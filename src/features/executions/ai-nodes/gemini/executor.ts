import { NonRetriableError } from "inngest";
import {createGoogleGenerativeAI} from "@ai-sdk/google"
import {generateText} from "ai"
import ky, {type Options as KyOptions} from "ky"
import Handlebars from "handlebars"
import { NodeExecutor } from "../../types";
import { geminiChannel } from "@/inngest/channels/gemini";


Handlebars.registerHelper("json" , (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString)

    return safeString
});

type GeminiData = {
    variableName?: string;
    systemPrompt?: string;
    userPrompt?: string;
}

export const geminiExecutor: NodeExecutor<GeminiData> = async({
    data,
    nodeId, 
    context, 
    step,
    publish
})=>
    
{

    //loading state for http-request

    await publish(
        geminiChannel().status({
            nodeId,
            status: "loading"
        }),
    );


    if(!data.variableName){
        await publish(
        geminiChannel().status({
            nodeId,
            status: "error"
        }))

        throw new NonRetriableError("Gemini Node: Variable Name is missing")
    }

    if(!data.userPrompt){
        await publish(
            geminiChannel().status({
                nodeId,
                status: "error"
            })
        )

        throw new NonRetriableError("Gemini Node: User Prompt is missing")
    }

    //Throw error if credential is missing


    const systemPrompt = data.systemPrompt?Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant. Help me to do ...";

    const userPrompt = Handlebars.compile(data.userPrompt)(context)


    //FETCH CREDENTIAL USER SELECTED


    const credentialValue = process.env.GOOGLE_GENERATIVE_AI_API_KEY

    const google = createGoogleGenerativeAI({
        apiKey: credentialValue,
    })

    try {

        const {steps} = await step.ai.wrap(
            "gemini-generate-text",
            generateText,
            {
                model: google("gemini-2.0-flash"),
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
            geminiChannel().status({
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
            geminiChannel().status({
                nodeId,
                status: "error"
            }),
        )

        throw error
    }



}