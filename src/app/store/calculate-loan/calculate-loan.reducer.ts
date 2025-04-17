import { createReducer, on } from '@ngrx/store';
import { calculateLoan, calculateLoanSuccess } from './calculate-loan.actions';
import { loanForm } from '../../models/loan.model';

export interface LoanState {
  result: loanForm | null;
  paymentSchedule: any[];
}

export const initialState: LoanState = {
  result: null,
  paymentSchedule: [],
};

export const loanReducer = createReducer(
  initialState,
  on(calculateLoan, (state, { loanData }) => {
  
    return {
      ...state,
      result: loanData,
      paymentSchedule: calculatePaymentSchedule(loanData),
    };
  }),
  
);

function calculatePaymentSchedule(loanData: loanForm): any[] {
  const { instalmentType, loanAmount, loanTerm, interestRate, afterOverpayment } = loanData; 
	const monthlyInterestRate = interestRate / 100 / 12;
	const monthlyPayment = (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTerm));

	const paymentSchedule = [];
	let remainingBalance = loanAmount;

	for (let i=1; i<=loanTerm; i++) {
		const interestRate = remainingBalance * monthlyInterestRate;
		const principal = monthlyPayment - interestRate;
		remainingBalance -= principal;	
		
		paymentSchedule.push({
			month: i,
			interestRate: interestRate,
			principal: principal,
			remainingBalance: remainingBalance,
			totalPayment: monthlyPayment});
	}


	return paymentSchedule;

	
	
	
}

