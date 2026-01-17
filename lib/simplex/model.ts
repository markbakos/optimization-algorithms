import type { FrozenTableau, Tableau, Pivot } from "./types";

const DEFAULT_COLS = ["x1", "x2", "b"];
const DEFAULT_ROWS = ["z", "c1", "c2"];

function makeRow(cols: number): string[] {
    return Array.from({ length: cols }, () => "");
}

export function createInitialTableau(): Tableau {
    const colVars = [...DEFAULT_COLS];
    const rowVars = [...DEFAULT_ROWS];

    const cells = rowVars.map(() => makeRow(colVars.length));
    return { colVars, rowVars, cells };
}

export function clampNonEmptyLabel(label: string, fallback: string): string {
    const trimmed = label.trim();
    return trimmed.length === 0 ? fallback : trimmed;
}

export function addColumn(t: Tableau, label: string): Tableau {
    const colVars = [...t.colVars, label];
    const cells = t.cells.map((r) => [...r, ""]);
    return { ...t, colVars, cells };
}

export function removeColumn(t: Tableau, colIndex: number): Tableau {
    if (t.colVars.length <= 1) return t;
    const colVars = t.colVars.filter((_, i) => i !== colIndex);
    const cells = t.cells.map((r) => r.filter((_, i) => i !== colIndex));
    return { ...t, colVars, cells };
}

export function addRow(t: Tableau, label: string): Tableau {
    const rowVars = [...t.rowVars, label];
    const cells = [...t.cells, makeRow(t.colVars.length)];
    return { ...t, rowVars, cells };
}

export function removeRow(t: Tableau, rowIndex: number): Tableau {
    if (t.rowVars.length <= 1) return t;
    const rowVars = t.rowVars.filter((_, i) => i !== rowIndex);
    const cells = t.cells.filter((_, i) => i !== rowIndex);
    return { ...t, rowVars, cells };
}

export function setColVar(t: Tableau, colIndex: number, next: string): Tableau {
    const colVars = t.colVars.map((v, i) => (i === colIndex ? next : v));
    return { ...t, colVars };
}

export function setRowVar(t: Tableau, rowIndex: number, next: string): Tableau {
    const rowVars = t.rowVars.map((v, i) => (i === rowIndex ? next : v));
    return { ...t, rowVars };
}

export function setCell(t: Tableau, rowIndex: number, colIndex: number, next: string): Tableau {
    const cells = t.cells.map((row, r) => {
        if (r !== rowIndex) return row;
        return row.map((cell, c) => (c === colIndex ? next : cell));
    });
    return { ...t, cells };
}

export function setPivot(t: Tableau, pivot: Pivot): Tableau {
    return { ...t, pivot };
}

export function clearPivot(t: Tableau): Tableau {
    return { ...t, pivot: null };
}

export function freezeTableau(t: Tableau, step: number): FrozenTableau {
    const colVars = t.colVars.map((v, i) => clampNonEmptyLabel(v, `x${i + 1}`));
    const rowVars = t.rowVars.map((v, i) => clampNonEmptyLabel(v, `r${i + 1}`));
    const cells = t.cells.map((row) => row.map(x => (x || "").trim()));
    return {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        step,
        colVars,
        rowVars,
        cells,
        pivot: t.pivot || null,
    };
}

export function createFromFrozen(f: FrozenTableau): Tableau {
    return {
        colVars: [...f.colVars],
        rowVars: [...f.rowVars],
        cells: f.cells.map((row) => row.map((n) => String(n))),
        pivot: f.pivot,
    };
}

export function createNextEmptyLikeFrozen(f: FrozenTableau): Tableau {
    return {
        colVars: [...f.colVars],
        rowVars: [...f.rowVars],
        cells: f.rowVars.map(() => Array.from({ length: f.colVars.length }, () => "")),
        pivot: null,
    };
}

export function displayToTableau(f: FrozenTableau): Tableau {
    return { colVars: f.colVars, rowVars: f.rowVars, cells: f.cells, pivot: f.pivot };
}