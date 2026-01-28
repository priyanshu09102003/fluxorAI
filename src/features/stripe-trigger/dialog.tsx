"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";


interface Props {
    open: boolean;
    onOpenChange: (open:boolean) => void
}

export const StripeTriggerDialog = ({
    open,
    onOpenChange

}: Props) => {

    const params = useParams();
    const workflowId = params.workflowId as string;

    //Constructing the webhook

    const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const webhookURL = 
    `${baseURL}/api/webhooks/stripe?workflowId=${workflowId}`

    const copyToClipboard = async() => {
        try {

            await navigator.clipboard.writeText(webhookURL);
            toast.success("Webhook URL copied to clipboard")
            
        } catch (error) {

            toast.error("Failed to copy URL")         
        }
    }

    return(
        <Dialog open = {open}  onOpenChange={onOpenChange}>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>STRIPE Trigger Configuration</DialogTitle>
                    <DialogDescription>
                        Configure this WEBHOOK URL in your <b>STRIPE</b> Dashboard to trigger this workflow on payment events.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">

                    <div className="space-y-2">

                        <Label htmlFor="webhook-url">
                            Webhook URL
                        </Label>

                        <div className="flex gap-2">

                            <Input id="webhook-url" value={webhookURL} readOnly className="font-mono text-sm" />
                            <Button type="button" size={"icon"} variant={"outline"} onClick={copyToClipboard}>
                                <CopyIcon className="size-4" />
                            </Button>

                        </div>

                    </div>

                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-medium text-sm">Setup Instructions</h4>

                        <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">

                            <li>Open your STRIPE Dashboard</li>
                            <li>Go to Developers → Webhooks </li>
                            <li>Click on <b>Add Endpoint</b> </li>
                            <li>Paste the Webhook URL above</li>
                            <li>Select the events you want to listen for (e.g., payment_intent.succeeded)</li>
                            <li>Save and copy the <b>Signing Secret</b></li>

                        </ol>

                    </div>

                    <div className="rounded-lg bg-muted p-4 space-y-2">
                        <h4 className="font-medium text-sm">Available Variables</h4>


                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li className="text-sm">
                                
                                <b>{"</>"}Payment Amount: </b>
                                <br />
                                <code className="bg-background px-1 py-0.5 rounded">
                                    {"{{stripe.amount}}"}
                                </code>
                                <br />
                                
                                
                            </li>

                            <li className="text-sm">
                                
                                <b>{"</>"}Customer ID: </b>
                                <br />
                                <code className="bg-background px-1 py-0.5 rounded">
                                    {"{{stripe.customerId}}"}
                                </code>
                                <br />     
                                
                            </li>

                            <li className="text-sm">
                                
                                <b>{"</>"}Currency Code: </b>
                                <br />
                                <code className="bg-background px-1 py-0.5 rounded">
                                    {"{{stripe.currency}}"}
                                </code>
                                <br />
                                
                                
                            </li>

                            <li className="text-sm">
                                
                                <b>{"</>"}Full Event data as JSON: </b>
                                <br />
                                <code className="bg-background px-1 py-0.5 rounded">
                                    {"{{json stripe}}"}
                                </code>
                                <br />
                                
                                
                            </li>

                        </ul>

                    </div>

                </div>
            </DialogContent>

        </Dialog>
    )
}

