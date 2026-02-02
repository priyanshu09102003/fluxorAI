import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { NodeType } from "@prisma/client";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger-channel";
import { googleFormTriggerChannel } from "./channels/google-form-trigger-channel";
import { stripeTriggerChannel } from "./channels/stripe-trigger-channel";
import { geminiChannel } from "./channels/gemini";
import { openaiChannel } from "./channels/openai";
import { anthropicChannel } from "./channels/anthropic";



export const executeWorkflow = inngest.createFunction(
  { id: "execute-workflow" },
  { 
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiChannel(),
      openaiChannel(),
      anthropicChannel()
    ]
  },
  
  async ({ event, step, publish }) => {

    const workflowId = event.data.workflowId;

    if(!workflowId){
      throw new NonRetriableError("Workflow ID is missing")
    }
    const sortedNodes = await step.run("prepare-workflow" , async() => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where:{id: workflowId},
        include:{
          nodes: true,
          connections: true
        }
      });

      return topologicalSort(workflow.nodes , workflow.connections);
    })

    const userId = await step.run("find-user-id" , async() => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where:{id: workflowId},
        select:{
          userId: true
        }
      })

      return workflow.userId
    })

    //Initialise the context from any initial data from the trigger

    let context = event.data.initialData || {};

    //Execution of each node

    for(const node of sortedNodes){
      const executor = getExecutor(node.type as NodeType)

      context = await executor({
        data: node.data as Record<string, unknown>,
        nodeId: node.id,
        userId,
        context,
        step,
        publish
      })
    }

    return {workflowId , result: context};
  }
);