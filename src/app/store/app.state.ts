import { LoanState, LoanStateValid } from "./loan.reducer";

export interface AppState {
	loans: LoanState;
}

export interface AppStateValid {
	loans: LoanStateValid;
}
