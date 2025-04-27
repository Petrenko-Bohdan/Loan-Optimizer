import { createAction, props } from '@ngrx/store';
import { loanForm, loanResult } from '../../models/loan.model';

export const calculateLoan = createAction(
  '[Loan] Calculate Loan',
  props<{ loanData: loanForm }>()
);

export const calculateLoanSuccess = createAction(
  '[Loan] Calculate Loan Success',
  props<{ result: any }>()
);

export const updateOverpayment = createAction(
  '[Loan] Update Overpayment',
  props<{ index: number; overpayment: number }>()
);

