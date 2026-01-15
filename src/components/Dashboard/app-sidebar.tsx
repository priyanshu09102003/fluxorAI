"use client"
import {

    CreditCardIcon,
    HistoryIcon,
    KeyIcon,
    LogOutIcon,
    StarIcon,
    WorkflowIcon

} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscriptions"


const menuItems = [
    {
        title: "Main",
        items:[
            {
                title: "Workflows",
                icon: WorkflowIcon,
                url: "/workflows"
            },
            {
                title: "Credentials",
                icon: KeyIcon,
                url: "/credentials"
            },
            {
                title: "Executions",
                icon: HistoryIcon,
                url: "/executions"
            },
        ]
    }
]

export const AppSidebar = () => {
    const router = useRouter();
    const pathName = usePathname();
    const{hasActiveSubsription, isLoading} = useHasActiveSubscription()

  return (
    <Sidebar collapsible="icon">
        <SidebarHeader>
            <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={false} className="gap-x-4 h-10 px-4 hover:bg-transparent data-[active=true]:bg-transparent">
                    <Link href="/" prefetch>
                        <Image src="/logo.svg" alt="Logo" width={55} height={55} />
                        <span className="font-bold text-xl">FluxorAI</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarHeader>
        <SidebarContent>
            {menuItems.map((group) => (
                <SidebarGroup key={group.title}>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {group.items.map((item) => (
                                <SidebarMenuItem key={item.title}>

                                    <SidebarMenuButton
                                    tooltip={item.title}
                                    isActive = {
                                        item.url === "/" ? pathName === "/" : pathName.startsWith(item.url)
                                    }
                                    asChild
                                    className="gap-x-4 h-10 px-4"
                                    >

                                    <Link href={item.url} prefetch>
                                        <item.icon className="size-6"/>
                                        <span>{item.title}</span>
                                    </Link>

                                    </SidebarMenuButton>

                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>

                </SidebarGroup>
            ))}
        </SidebarContent>

        <SidebarFooter>
            <SidebarMenu>

                {!hasActiveSubsription && !isLoading && (
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Upgrade to Pro" className="gap-x-4 h-10 px-4" onClick={() => authClient.checkout({ slug: "FluxorAI-PRO"})}>
                            <StarIcon className="h-6 w-6"/>
                            <span>Upgrade to Pro</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                )}
                

                <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Billing Portal" className="gap-x-4 h-10 px-4" onClick={() => authClient.customer.portal()}>
                        <CreditCardIcon className="h-6 w-6"/>
                        <span>Billing Portal</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Sign Out" className="gap-x-4 h-10 px-4" onClick={() => authClient.signOut({
                        fetchOptions:{
                            onSuccess: () => {
                                router.push("/login");
                                toast.success("Signed out successfully")
                            }
                        }
                    })}>
                        <LogOutIcon className="h-6 w-6"/>
                        <span>Sign Out</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>

            </SidebarMenu>
        </SidebarFooter>

    </Sidebar>
  )
}


