export type TableauCell = string;

export type Tableau = {
    colVars: string[];
    rowVars: string[];
    cells: TableauCell[][];
};

export type FrozenTableau = {
    id: string;
    step: number;
    colVars: string[];
    rowVars: string[];
    cells: string[][];
};

export type WorkbenchState = {
    previousStep: number | null;
    current: Tableau;
    history: FrozenTableau[];
};