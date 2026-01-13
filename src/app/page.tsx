
import { requireAuth } from "@/lib/auth-utils";
import { caller } from "@/trpc/server";
import { LogoutButton } from "./Logout";




const Page = async () => {
  await requireAuth()
  const data = await caller.getUsers();


  return (
    <div>
      protected
      {JSON.stringify(data)}

      <LogoutButton />
    </div>
  );
}

export default Page