import { createSelector, createFeatureSelector } from "@ngrx/store";
import { LoanState } from "./calculate-loan.reducer";
import { AppState } from "./app.state";

export const selectLoanState = createFeatureSelector<AppState, LoanState>('loan');

export const selectLoanResult = createSelector(
	selectLoanState,
	(state: LoanState) => state.paymentSchedule||[]
);