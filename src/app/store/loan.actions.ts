import{createAction} from '@ngrx/store';
import { props } from '@ngrx/store';
import { Loan } from '../models/loan.model';

export const calculateLoan = createAction(
	'[Loan] Calculate Loan',
	props<{loan: Loan}>()
)

export const calculateLoanSuccess= createAction(
	'[Loan] Calculate Loan Success',
	props<{paymentSchedule: any[]}>()
)