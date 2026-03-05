import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
    return (
        <div className="space-y-6">
            {/* Header Loading */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Skeleton className="h-10 w-48 mb-2" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                </div>
            </div>

            {/* Grid structure matching dashboard */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Active Journey Skeleton */}
                <div className="flex flex-col space-y-3 p-6 rounded-xl border bg-card text-card-foreground shadow">
                    <Skeleton className="h-6 w-1/3" />
                    <div className="space-y-2 mt-4">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                    <Skeleton className="h-[200px] w-full mt-4 rounded-lg" />
                </div>

                {/* Active Check-Ins Skeleton */}
                <div className="flex flex-col space-y-3 p-6 rounded-xl border bg-card text-card-foreground shadow">
                    <Skeleton className="h-6 w-1/3" />
                    <div className="space-y-2 mt-4">
                        <Skeleton className="h-12 w-full rounded-md" />
                        <Skeleton className="h-12 w-full rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
}
