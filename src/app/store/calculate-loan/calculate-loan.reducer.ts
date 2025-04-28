import { createReducer, on } from '@ngrx/store';
import {
  calculateLoan,
  updateOverpayment,
} from './calculate-loan.actions';
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

  on(updateOverpayment, (state, { index, overpayment }) => {
    const updatedSchedule = state.paymentSchedule.map((payment, i) => {
      if (i === index) {
        return { ...payment, overpayment: overpayment };
      }
      return payment;
    });
		const recalculatedSchedule = recalculatedPaymentSchedule(updatedSchedule, state.result!);

		return {...state, paymentSchedule: recalculatedSchedule };
  })
);

function calculatePaymentSchedule(loanData: loanForm): any[] {
  const {
    instalmentType,
    loanAmount,
    loanTerm,
    interestRate,
    afterOverpayment,
  } = loanData;
  const monthlyInterestRate = interestRate / 100 / 12;
  const monthlyPayment =
    (loanAmount * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -loanTerm));

  const paymentSchedule = [];
  let remainingBalance = loanAmount;

  for (let i = 1; i <= loanTerm; i++) {
    const interest = remainingBalance * monthlyInterestRate;
    const principal = monthlyPayment - interest;

    paymentSchedule.push({
      month: i,
      capital: remainingBalance.toFixed(2),
      interest: interest.toFixed(2),
      installment: principal.toFixed(2),
      total: monthlyPayment.toFixed(2),
    });

    remainingBalance -= principal;
  }

  return paymentSchedule;
}

function recalculatedPaymentSchedule(paymentSchedule: any[], loanData: loanForm): any[]{
	const monthlyInterestRate = loanData.interestRate / 100 / 12;
	let remainingBalance = loanData.loanAmount;

	for (let i=0; i<paymentSchedule.length; i++){
		const overpayment = Number(paymentSchedule[i].overpayment) || 0;

		const interest = remainingBalance * monthlyInterestRate;
		const principal = ((loanData.loanAmount*monthlyInterestRate)/(1-Math.pow(1+monthlyInterestRate, -loanData.loanTerm))) + overpayment;
		const total = principal + interest;
		remainingBalance -= (principal + overpayment);

		if (remainingBalance < 0) {remainingBalance = 0;}

		paymentSchedule[i]={...paymentSchedule[i],
			month: i+1,
			capital: remainingBalance.toFixed(2),
			interest: interest.toFixed(2),
			installment: principal.toFixed(2),
			total: total.toFixed(2),
			overpayment: overpayment ? overpayment:undefined,
		};

		if(remainingBalance === 0){
			paymentSchedule.length = i+1;
			break;
		}
	}

	return paymentSchedule
}
