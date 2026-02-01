"use client"

import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/Workflows/entity-components";
import {useRemoveCredential, useSuspenseCredentials } from "../hooks/use-credentials"
import { useRouter } from "next/navigation";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { CredentialType , Credential} from "@prisma/client";
import { formatDistanceToNow} from "date-fns"
import Image from "next/image";

export const CredentialsSearch = () => {
    const [params , setParams] = useCredentialsParams()
    const {searchValue, onSearchChange} = useEntitySearch({
        params,
        setParams
    }) 

    return(
        <EntitySearch
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Search credentials..."
        />
    )
}

export const CredentialsList = () => {
    const credentials = useSuspenseCredentials();
   
    return (
        <EntityList
        items={credentials.data.items}
        getKey={(credential) => credential.id}
        renderItems={(credential) => <CredentialItem data={credential}/>}
        emptyView = {<CredentialsEmpty/>}
        />
    )
}

export const CredentialsHeader = ({disabled}: {disabled?:boolean}) => {
    return(
            <EntityHeader 
            title="Credentials"
            description="Create and manage your Credentials"
            newButtonHref="/credentials/new"
            newButtonLabel="New Credential"
            disabled= {disabled}
            />
        
    )
}

export const CredentialsPagiantions = () => {
    const workflows = useSuspenseCredentials();
    const [params, setParams] = useCredentialsParams()

    return(
        <EntityPagination
        disabled = {workflows.isFetching}
        totalPages={workflows.data.totalPages}
        page = {workflows.data.page}
        onPageChange = {(page) => setParams({...params, page})}
         />
    )
}

export const CredentialsContainer = (
    {
        children
    } : {
        children: React.ReactNode;
    }
) => {
    return(
        <EntityContainer
        header = {<CredentialsHeader />}
        search = {<CredentialsSearch />}
        pagination = {<CredentialsPagiantions/>}
        >
            {children}
        </EntityContainer>
    )
}

export const CredentialsLoading = () => {
    return <LoadingView message="Loading Credentials..." />
}

export const CredentialsError = () => {
    return <ErrorView message="Error Loading Credentials..." />
}


export const CredentialsEmpty = () => {

    const router = useRouter();
    
    const handleCreate = () => {
                router.push(`/credentials/new`)
    }

    return(
            <EmptyView
            message="You don't have any active credentials. Get started by storing your first credential"
            onNew={handleCreate}
            />
    )
}

const credentialLogos: Record<CredentialType, string> = {
    [CredentialType.OPENAI]: "/openai.svg",
    [CredentialType.ANTHROPIC]: "/anthropic.svg",
    [CredentialType.GEMINI]: "/gemini.svg",
}


export const CredentialItem = ({data}:{data:Credential}) =>{

    const removeCredential = useRemoveCredential()

    const handleRemove = () => {
        removeCredential.mutate({id: data.id})
    }

    const logo = credentialLogos[data.type] || "/openai.svg"


    return(
        <EntityItem
            href={`/credentials/${data.id}`}
            title={data.name}
            subtitle = {
                <>
                    Updated {formatDistanceToNow(data.updatedAt)} {" "}
                    &bull; Created{" "}
                    {formatDistanceToNow(data.createdAt, {addSuffix: true})}
                </>
            }

            image={
                <div className="size-8 flex items-center justify-center">

                    <Image src={logo} alt={data.type} width={20} height={20} />

                </div>
            }

            onRemove={handleRemove}
            isRemoving={removeCredential.isPending}
        />
    )
}