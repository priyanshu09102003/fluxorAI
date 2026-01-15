import { requireAuth } from "@/lib/auth-utils"

const Page = async() => {
    await requireAuth();
    return (
        <p>Workflows Page</p>
    )
}

export default Page