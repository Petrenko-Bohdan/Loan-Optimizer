import { createAction, props } from "@ngrx/store";
import { loanForm } from "../../models/loan.model";

export const calculateLoan = createAction(
	"[Loan] Calculate Loan",
	props<{ loanData: loanForm }>()
)

export const calculateLoanSuccess = createAction(
	"[Loan] Calculate Loan Success",
	props<{ result: any}>()
)