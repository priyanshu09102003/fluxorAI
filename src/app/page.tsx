"use client"
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { LogoutButton } from "./Logout";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";




const Page = () => {
  const trpc = useTRPC()
  const {data} = useQuery(trpc.getWorkflows.queryOptions());


  return (
    <div>
      protected
      {JSON.stringify(data, null , 2)}

      <LogoutButton />
    </div>
  );
}

export default Page