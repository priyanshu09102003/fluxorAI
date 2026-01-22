"use client";

import { PlusIcon } from "lucide-react";
import { memo , useState } from "react";
import { Button } from "../ui/button";
import { NodeSelector } from "../NodeSelector/node-selector";

export const AddNodeButton = memo(() => {
    const [selectorOpen, setSelectorOpen] = useState(false);
    return(
        <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
            <Button onClick={() => {}} size={"icon-lg"} variant={"outline"} className="bg-background">
                <PlusIcon />
            </Button>
        </NodeSelector>
    )
})

AddNodeButton.displayName = "AddNodeButton"