import{createAction} from '@ngrx/store';
import { props } from '@ngrx/store';
import { Loan } from '../models/loan.model';
import { loanForm } from '../models/loan.model';

export const calculateLoan = createAction(
	'[Loan] Calculate Loan',
	props<{loan: Loan}>()
)

export const calculateLoanSuccess= createAction(
	'[Loan] Calculate Loan Success',
	props<{paymentSchedule: any[]}>()
)

export const calculateLoanValid= createAction(
	'[Loan] Calculate Loan Valid',
	props<{loan:loanForm}>())

export const calculateLoanValidSuccess= createAction(
	'[Loan] Calculate Loan Valid Success',
	props<{paymentScheduleValid: any[]}>()
)