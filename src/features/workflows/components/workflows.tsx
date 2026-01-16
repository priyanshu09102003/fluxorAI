"use client"

import { EntityContainer, EntityHeader } from "@/components/Workflows/entity-components";
import { useSuspenseWorkflows } from "../hooks/use-wrokflows"

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows();

    return (
        <p>
            {JSON.stringify(workflows.data, null, 2)}
        </p>
    )
}

export const WorkflowsHeader = ({disabled}: {disabled?:boolean}) => {
    return(
        <>
            <EntityHeader 
            title="Workflows"
            description="Create and manage your Workflows"
            onNew={() => {}}
            newButtonLabel="New Workflow"
            disabled= {disabled}
            isCreating={false}
            />
        
        </>
    )
}

export const WorkflowsContainer = (
    {
        children
    } : {
        children: React.ReactNode;
    }
) => {
    return(
        <EntityContainer
        header = {<WorkflowsHeader />}
        search = {<></>}
        pagination = {<></>}
        >
            {children}
        </EntityContainer>
    )
}