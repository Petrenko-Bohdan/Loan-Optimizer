import { createSelector, createFeatureSelector } from "@ngrx/store";
import { LoanState } from "./loan.reducer";
import { AppState } from './app.state';

export const selectLoanState = createFeatureSelector<AppState, LoanState>('loans');

export const selectPaymentSchedule = createSelector(
	selectLoanState,
	(state: LoanState) => state.paymentSchedule||[]
);