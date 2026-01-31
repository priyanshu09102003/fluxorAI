
import { useTRPC } from "@/trpc/client"
import { useMutation, useQuery, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCredentialsParams } from "./use-credentials-params";
import { CredentialType } from "@prisma/client";

export const useSuspenseCredentials = () => {
    const trpc = useTRPC();
    const [params] = useCredentialsParams()

    return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params))
};


// Hook to create a new credential

export const useCreateCredential = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(trpc.credentials.create.mutationOptions ({
        onSuccess: (data) => {
            toast.success(`Credential "${data.name}" created successfully`);
            queryClient.invalidateQueries(
                trpc.credentials.getMany.queryOptions({})
            )
        },
        onError: (error) => {
            toast.error(`Failed to create Credential: ${error.message}`)
        }
    }))
}

//Hook to remove Credential

export const useRemoveCredential = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation(
        trpc.credentials.remove.mutationOptions({
            onSuccess: (data) => {
                toast.success(`Credential ${data.name} removed`);
                queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
                queryClient.invalidateQueries(
                    trpc.credentials.getOne.queryFilter({id: data.id})
                )
            }
        })
    )
}

//Hook to fetch a single Credential using suspense

export const useSuspenseCredential = (id: string) => {
    const trpc = useTRPC();
    return useSuspenseQuery(trpc.credentials.getOne.queryOptions({id}))
}


//Hook to update the credential

export const useUpdateCredential = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(trpc.credentials.update.mutationOptions ({
        onSuccess: (data) => {
            toast.success(`Credential "${data.name}" saved successfully`);
            queryClient.invalidateQueries(
                trpc.credentials.getMany.queryOptions({})
            );
            queryClient.invalidateQueries(
                trpc.credentials.getOne.queryOptions({id: data.id})
            )
        },
        onError: (error) => {
            toast.error(`Failed to save Credential: ${error.message}`)
        }
    }))
}


//Hook to fetch credentials by TYPE
export const useCredentialsByType = (type: CredentialType) => {
    const trpc = useTRPC();
    return useQuery(trpc.credentials.getByType.queryOptions({type}))
}
