import { NonRetriableError } from "inngest";
import { NodeExecutor } from "../types"
import ky, {type Options as KyOptions} from "ky"
import Handlebars from "handlebars"
import { httpRequestChannel } from "@/inngest/channels/http-request";


Handlebars.registerHelper("json" , (context) => {
    const jsonString = JSON.stringify(context, null, 2);
    const safeString = new Handlebars.SafeString(jsonString)

    return safeString
});

type HTTPRequestData = {
    variableName?: string;
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string
}

export const HTTPRequestExecutor: NodeExecutor<HTTPRequestData> = async({
    data,
    nodeId, 
    context, 
    step,
    publish
})=>
    
{

    //loading state for http-request

    await publish(
        httpRequestChannel().status({
            nodeId,
            status: "loading"
        }),
    );
    

    try{
        const result = await step.run("http-request", async() => {

            
                if(!data.endpoint){
                    //Error State

                    await publish(
                        httpRequestChannel().status({
                            nodeId,
                            status: "error"
                        }),
                    );

                    throw new NonRetriableError("HTTP Request Node: No Endpoint Configured")
                }

                if(!data.method){
                    //Error Statte

                    await publish(
                        httpRequestChannel().status({
                            nodeId,
                            status: "error"
                        }),
                    );

                    throw new NonRetriableError("Method not Configured")
                }

                if(!data.variableName){
                    //Error Statte

                    await publish(
                        httpRequestChannel().status({
                            nodeId,
                            status: "error"
                        }),
                    );

                    throw new NonRetriableError("No variable detected")
                }




            const endpoint = Handlebars.compile(data.endpoint)(context);
            const method = data.method;

            const options: KyOptions = {method};

            if(["POST" , "PUT", "PATCH"].includes(method)){
                const resolved = Handlebars.compile(data.body || "{}")(context);
                JSON.parse(resolved)
                options.body = resolved;
                options.headers = {
                    "Content-Type": "application/jsonf"
                }
            }

            const response = await ky(endpoint, options);
            const contentType = response.headers.get("content-type")
            const responseData = contentType?.includes("application/json") ? await response.json() : await response.text()

            const responsePayload = {

                httpResponse:{
                    status: response.status,
                    statusText: response.statusText,
                    data: responseData
                }

            }


                return{
                    ...context,
                    [data.variableName]:responsePayload
                }
            


        })

        //Success state for http-request

        await publish(
                httpRequestChannel().status({
                    nodeId,
                    status: "success"
                }),
        );


        return result

    }catch(error){


        await publish(
                httpRequestChannel().status({
                    nodeId,
                    status: "error"
                }),
        );

        throw error;
    }

}