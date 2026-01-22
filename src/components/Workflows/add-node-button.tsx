"use client";

import { PlusIcon } from "lucide-react";
import { memo , useState } from "react";
import { Button } from "../ui/button";

export const AddNodeButton = memo(() => {
    return(
        <Button onClick={() => {}} size={"icon-lg"} variant={"outline"} className="bg-background">
            <PlusIcon />
        </Button>
    )
})

AddNodeButton.displayName = "AddNodeButton"