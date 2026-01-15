"use client"
import { requireAuth } from "@/lib/auth-utils";
import { caller, trpc } from "@/trpc/server";
import { LogoutButton } from "./Logout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";


const Page = () => {
  const trpc = useTRPC()
  const {data} = useQuery(trpc.getWorkflows.queryOptions());
  const queryClient = useQueryClient();

  const create = useMutation(trpc.createWorkflow.mutationOptions({
  onSuccess: () => {
    queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())
  }
}))



  return (
    <div>
      protected
      {JSON.stringify(data, null , 2)}

      <LogoutButton />

      <Button disabled={create.isPending} onClick={()=>create.mutate()}>
        Create Workflow +
      </Button>
    </div>
  );
}

export default Page