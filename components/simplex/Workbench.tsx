"use client";

import React, { useMemo, useState } from "react";
import type { Tableau, WorkbenchState } from "@/lib/simplex/types";
import {
    addColumn,
    addRow,
    createInitialTableau,
    createNextEmptyLikeFrozen,
    freezeTableau,
    removeColumn,
    removeRow,
    setCell,
    setColVar,
    setRowVar,
} from "@/lib/simplex/model";
import { Grid } from "./Grid";
import { Previous } from "./Previous";
import { Button } from "../ui/Button";
import { Card, CardContent, CardHeader } from "../ui/Card";
import { Input } from "../ui/Input";
import {History} from "@/components/simplex/History";

function buildInitial(): WorkbenchState {
    return {
        previousStep: null,
        current: createInitialTableau(),
        history: [],
    };
}

export function Workbench() {
    const [state, setState] = useState<WorkbenchState>(() => buildInitial());
    const [colLabel, setColLabel] = useState("x");
    const [rowLabel, setRowLabel] = useState("c");

    const colHint = useMemo(
        () => `x${state.current.colVars.length + 1}`,
        [state.current.colVars.length]
    );
    const rowHint = useMemo(
        () => `r${state.current.rowVars.length + 1}`,
        [state.current.rowVars.length]
    );

    const selectedPrev = useMemo(() => {
       if (state.history.length === 0) return null;

       const step = state.previousStep || state.history[state.history.length - 1].step;
       return state.history.find((h) => h.step === step) || state.history[state.history.length - 1];
    }, [state.history, state.previousStep]);

    const HandleNext = () => {
        setState((s) => {
            const step = s.history.length + 1;
            const frozen = freezeTableau(s.current, step);
            const next: Tableau = createNextEmptyLikeFrozen(frozen);

            return {
                current: next,
                history: [...s.history, frozen],
                previousStep: frozen.step,
            };
        });
        console.log(state)
    };

    const resetAll = () => setState(buildInitial());

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-8">
            <div className="mb-6">
                <h1 className="text-2xl font-semibold text-neutral-900">Simplex Workbench</h1>
                <p className="mt-2 max-w-3xl text-sm text-neutral-600">
                    Work step-by-step: the <span className="font-medium">previous tableau</span> stays visible on the
                    left (read-only), while you edit the <span className="font-medium">current tableau</span> on the right.
                </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_1.35fr]">
                <div className="lg:sticky lg:top-6 lg:self-start">
                    {selectedPrev ? (
                        <Previous frozen={selectedPrev} />
                    ) : (
                        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-5 text-sm text-neutral-600">
                            No previous tableau yet.
                        </div>
                    )}

                    <div className="mt-4 flex gap-2">
                        <Button type="button" variant="ghost" onClick={resetAll}>
                            Reset
                        </Button>
                        {state.history.length > 0 && (
                            <div className="flex items-center text-xs text-neutral-500">
                                Steps saved: <span className="ml-1 font-medium text-neutral-700">{state.history.length}</span>
                            </div>
                        )}
                    </div>
                </div>

                <Card>
                    <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div className="space-y-1">
                            <div className="text-sm font-medium text-neutral-900">Current</div>
                            <div className="text-xs text-neutral-600">
                                Add/remove variables, fill coefficients, then Continue to go to the next tableau.
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <div className="flex items-center gap-2">
                                <Input
                                    value={colLabel}
                                    onChange={(e) => setColLabel(e.target.value)}
                                    placeholder={colHint}
                                    className="h-10 w-28"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() =>
                                        setState((s) => ({
                                            ...s,
                                            current: addColumn(s.current, colLabel.trim() || colHint),
                                        }))
                                    }
                                >
                                    + Column
                                </Button>
                            </div>

                            <div className="flex items-center gap-2">
                                <Input
                                    value={rowLabel}
                                    onChange={(e) => setRowLabel(e.target.value)}
                                    placeholder={rowHint}
                                    className="h-10 w-28"
                                />
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() =>
                                        setState((s) => ({
                                            ...s,
                                            current: addRow(s.current, rowLabel.trim() || rowHint),
                                        }))
                                    }
                                >
                                    + Row
                                </Button>
                            </div>

                            <Button type="button" variant="primary" onClick={HandleNext}>
                                Continue →
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="max-h-[70vh] overflow-auto rounded-xl border border-neutral-200 bg-white p-3">
                            <Grid
                                tableau={state.current}
                                mode="edit"
                                initial={state.history.length === 0}
                                onSetColVar={(c, next) =>
                                    setState((s) => ({ ...s, current: setColVar(s.current, c, next) }))
                                }
                                onSetRowVar={(r, next) =>
                                    setState((s) => ({ ...s, current: setRowVar(s.current, r, next) }))
                                }
                                onSetCell={(r, c, next) =>
                                    setState((s) => ({ ...s, current: setCell(s.current, r, c, next) }))
                                }
                                onRemoveCol={(c) =>
                                    setState((s) => ({ ...s, current: removeColumn(s.current, c) }))
                                }
                                onRemoveRow={(r) =>
                                    setState((s) => ({ ...s, current: removeRow(s.current, r) }))
                                }
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <History
                items={state.history}
                selectedStep={selectedPrev?.step || null}
                onSelect={(step) => setState((s) => ({...s, previous: step}))}
            />
        </div>
    );
}
