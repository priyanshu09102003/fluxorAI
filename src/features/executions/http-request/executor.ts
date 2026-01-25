import { NonRetriableError } from "inngest";
import { NodeExecutor } from "../types"
import ky, {type Options as KyOptions} from "ky"

type HTTPRequestData = {
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string
}

export const HTTPRequestExecutor: NodeExecutor<HTTPRequestData> = async({
    data,
    nodeId, 
    context, 
    step})=>
{

    //loading state for http-request


    if(!data.endpoint){
        //Error Statte

        throw new NonRetriableError("HTTP Request Node: No Endpoint Configured")
    }

    

    const result = await step.run("http-request", async() => {
        const endpoint = data.endpoint!;
        const method = data.method || "GET";

        const options: KyOptions = {method};

        if(["POST" , "PUT", "PATCH"].includes(method)){
            options.body = data.body
        }

        const response = await ky(endpoint, options);
        const contentType = response.headers.get("content-type")
        const responseData = contentType?.includes("application/json") ? await response.json() : await response.text()


        return{
            ...context,
            httpResponse:{
                status: response.status,
                statusText: response.statusText,
                data: responseData
            }
        }


    })

    //Success state for http-request


    return result

}