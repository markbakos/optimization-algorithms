"use client";

import React, { memo } from "react";
import type { Tableau } from "@/lib/simplex/types";
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
};

function isNumericDraft(value: string): boolean {
    if (value.trim() === "" || value === "-" || value === "." || value === "-.") return true;
    return /^-?\d*(\.\d*)?$/.test(value);
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
                                                     }: Props) {
    const isView = mode === "view";
    const { colVars, rowVars, cells } = tableau;

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
                            return (
                                <td key={c} className="p-2">
                                    <Input
                                        inputMode="decimal"
                                        value={value}
                                        onChange={(e) => {
                                            if (isView) return;
                                            const next = e.target.value;
                                            if (!isNumericDraft(next)) return;
                                            onSetCell?.(r, c, next);
                                        }}
                                        placeholder="0"
                                        className="h-9 w-28 text-right tabular-nums"
                                        disabled={isView}
                                    />
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
