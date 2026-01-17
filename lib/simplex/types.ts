export type TableauCell = string;

export type Tableau = {
    colVars: string[];
    rowVars: string[];
    cells: TableauCell[][];
    pivot?: Pivot;
};

export type Pivot = {
    row: number;
    col: number;
} | null;

export type FrozenTableau = {
    id: string;
    step: number;
    colVars: string[];
    rowVars: string[];
    cells: string[][];
    pivot: {row: number; col: number} | null;
};

export type WorkbenchState = {
    previousStep: number | null;
    current: Tableau;
    history: FrozenTableau[];
};