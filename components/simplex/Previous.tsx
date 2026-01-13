"use client";

import React, { useMemo } from "react";
import type { FrozenTableau } from "@/lib/simplex/types";
import { createFromFrozen } from "@/lib/simplex/model";
import { Grid } from "./Grid";

export function Previous({ frozen }: { frozen: FrozenTableau }) {
    const tableau = useMemo(() => createFromFrozen(frozen), [frozen]);

    return (
        <div className="h-full">
            <div className="mb-2 text-sm font-medium text-neutral-900">Previous</div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50/70 shadow-sm">
                <div className="max-h-[70vh] overflow-auto p-3">
                    <Grid tableau={tableau} initial={false} mode="view" />
                </div>
            </div>
        </div>
    );
}
