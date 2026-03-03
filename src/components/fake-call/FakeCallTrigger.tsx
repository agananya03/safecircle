"use client";

import { useFakeCallStore } from "@/hooks/useFakeCall";
import { Button } from "@/components/ui/button";
import { PhoneCall } from "lucide-react";

export function FakeCallTrigger() {
    const triggerCall = useFakeCallStore(state => state.triggerCall);

    return (
        <Button
            onClick={triggerCall}
            variant="outline"
            className="flex-1 sm:flex-none border-primary/50 text-primary hover:bg-primary/10 transition-colors h-14"
        >
            <PhoneCall className="w-5 h-5 mr-3" />
            Trigger Fake Call
        </Button>
    );
}
