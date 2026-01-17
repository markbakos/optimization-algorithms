"use client";

import React, { memo } from "react";
import type { FrozenTableau } from "@/lib/simplex/types";
import { displayToTableau } from "@/lib/simplex/model";
import { Grid } from "./Grid";

type Props = {
    items: FrozenTableau[];
    selectedStep: number | null;
    onSelect: (step: number) => void;
};

export const History = memo(function History({ items, selectedStep, onSelect }: Props) {
    if (items.length === 0) return null;

    return (
        <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
                <div className="text-xs font-medium text-neutral-700">History</div>
                <div className="text-[11px] text-neutral-500">
                    {items.length} step{items.length === 1 ? "" : "s"}
                </div>
            </div>

            <div className="rounded-2xl border border-neutral-200 bg-white p-3">
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {[...items].reverse().map((x) => {
                        const isSelected = x.step === selectedStep;

                        return (
                            <button
                                key={x.id}
                                type="button"
                                onClick={() => onSelect(x.step)}
                                className={[
                                    "shrink-0 text-left rounded-2xl border shadow-sm transition",
                                    "bg-neutral-50 hover:bg-neutral-100",
                                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300",
                                    isSelected ? "border-neutral-500" : "border-neutral-200",
                                ].join(" ")}
                                style={{ width: 260 }}
                            >
                                <div className="flex items-center justify-between px-3 py-2">
                                    <div className="text-xs font-semibold text-neutral-800">Step {x.step}</div>
                                    <div className="text-[11px] text-neutral-500">
                                        {x.rowVars.length}×{x.colVars.length}
                                    </div>
                                </div>

                                <div className="h-40 overflow-hidden px-2 pb-2">
                                    <div className="origin-top-left scale-[0.7]">
                                        <Grid tableau={displayToTableau(x)} mode="view" initial={false} />
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
});
