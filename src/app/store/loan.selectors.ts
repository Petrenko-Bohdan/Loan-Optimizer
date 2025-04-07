import { createSelector, createFeatureSelector } from "@ngrx/store";
import { LoanState, LoanStateValid } from "./loan.reducer";
import { AppState, AppStateValid } from './app.state';

export const selectLoanState = createFeatureSelector<AppState, LoanState>('loans');

export const selectPaymentSchedule = createSelector(
	selectLoanState,
	(state: LoanState) => state.paymentSchedule||[]
);

export const selectLoanStateValid = createFeatureSelector<AppStateValid, LoanStateValid>('loans');

export const selectPaymentScheduleValid = createSelector(
	selectLoanStateValid,
	(state: LoanStateValid) => state.paymentScheduleValid||[]
);