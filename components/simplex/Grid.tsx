"use client";

import React, { memo } from "react";
import type { Tableau, Pivot } from "@/lib/simplex/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

type Mode = "edit" | "view";

type Props = {
    tableau: Tableau;
    mode: Mode;
    initial: boolean;

    onSetColVar?: (colIndex: number, next: string) => void;
    onSetRowVar?: (rowIndex: number, next: string) => void;
    onSetCell?: (rowIndex: number, colIndex: number, next: string) => void;
    onRemoveCol?: (colIndex: number) => void;
    onRemoveRow?: (rowIndex: number) => void;

    onSetPivot?: (pivot: Pivot) => void;
};

function isValid(value: string): boolean {
    const v = value.trim();
    if (v === "" || v === "-" || v === "." || v === "-." || v === "/" || v === "-/") return true;

    const decimalDraft = /^-?(?:\d+\.?\d*|\.\d*)$/.test(v);
    const fractionDraft = /^-?(?:\d+)?\s*\/\s*(?:\d+)?$/.test(v);

    return decimalDraft || fractionDraft;
}

export const Grid = memo(function TableauGrid({
                                                         tableau,
                                                         mode,
                                                         initial,
                                                         onSetColVar,
                                                         onSetRowVar,
                                                         onSetCell,
                                                         onRemoveCol,
                                                         onRemoveRow,
                                                         onSetPivot,
                                                     }: Props) {
    const isView = mode === "view";
    const { colVars, rowVars, cells, pivot } = tableau;

    const HandlePivot = (r: number, c: number) => {
        if (isView) return;

        const next: Pivot = pivot && pivot.row === r && pivot.col === c ? null : { row: r, col: c };

        onSetPivot?.(next);
    }

    function isPivotCell(pivot: Pivot | undefined, r: number, c: number): boolean {
        return !!pivot && pivot.row === r && pivot.col === c;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full border-separate border-spacing-0">
                <thead>
                <tr>
                    <th className="sticky left-0 z-10 bg-neutral-50/70 p-2 text-left text-xs font-semibold text-neutral-600">
                        Row \ Col
                    </th>

                    {colVars.map((col, c) => (
                        <th key={c} className="p-2 align-top">
                            <div className="flex items-center gap-2">
                                <Input
                                    value={col}
                                    onChange={(e) => onSetColVar?.(c, e.target.value)}
                                    placeholder={`x${c + 1}`}
                                    className="h-9 w-32"
                                    disabled={isView}
                                />
                                {!isView && initial && (
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="danger"
                                        onClick={() => onRemoveCol?.(c)}
                                        title="Remove column"
                                        aria-label="Remove column"
                                    >
                                        −
                                    </Button>
                                )}
                            </div>
                        </th>
                    ))}
                </tr>
                </thead>

                <tbody>
                {rowVars.map((rowLabel, r) => (
                    <tr key={r}>
                        <th className="sticky left-0 z-10 bg-neutral-50/70 p-2 align-top">
                            <div className="flex items-center gap-2">
                                <Input
                                    value={rowLabel}
                                    onChange={(e) => onSetRowVar?.(r, e.target.value)}
                                    placeholder={`r${r + 1}`}
                                    className="h-9 w-32"
                                    disabled={isView}
                                />
                                {!isView && initial && (
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant="danger"
                                        onClick={() => onRemoveRow?.(r)}
                                        title="Remove row"
                                        aria-label="Remove row"
                                    >
                                        −
                                    </Button>
                                )}
                            </div>
                        </th>

                        {cells[r].map((cell, c) => {
                            const value = cell || "";
                            const selected = isPivotCell(pivot, r, c);
                            return (
                            <td key={c} className="p-2">
                                <div
                                    onDoubleClick={() => HandlePivot(r, c)}
                                    className={[
                                        "rounded-lg",
                                        !isView ? "cursor-cell" : "cursor-default",
                                        !isView ? "hover:ring-2 hover:ring-neutral-200" : "",
                                        selected ? "ring-2 ring-amber-400" : "",
                                    ].join(" ")}
                                    title={!isView ? "Double-click to set pivot" : undefined}
                                >
                                    <Input
                                        inputMode="decimal"
                                        value={value}
                                        onChange={(e) => {
                                            if (isView) return;
                                            const next = e.target.value;
                                            if (!isValid(next)) return;
                                            onSetCell?.(r, c, next);
                                        }}
                                        placeholder="0"
                                        className={[
                                            "h-9 w-28 text-right tabular-nums",
                                            selected ? "border-amber-400 focus:ring-amber-200" : "",
                                        ].join(" ")}
                                        disabled={isView}
                                    />
                                </div>
                            </td>
                            );
                        })}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
});
