export type TableauCell = string;

export type Tableau = {
    colVars: string[];
    rowVars: string[];
    cells: TableauCell[][];
};

export type FrozenTableau = {
    colVars: string[];
    rowVars: string[];
    values: string[][];
};

export type WorkbenchState = {
    previous: FrozenTableau | null;
    current: Tableau;
    history: FrozenTableau[];
};