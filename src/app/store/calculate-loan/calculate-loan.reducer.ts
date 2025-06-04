import { createReducer, on } from '@ngrx/store';
import { calculateLoan, updateOverpayment } from './calculate-loan.actions';
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
    const recalculatedSchedule = recalculatedPaymentSchedule(
      updatedSchedule,
      state.result!
    );

    return { ...state, paymentSchedule: recalculatedSchedule };
  })
);

function getMonthlyInterestRate(annualRate: number): number {
  return annualRate / 100 / 12;
}

function getMonthlyPayment(
  length: number,
  rate: number,
  amount: number
): number {
  const monthlyInterestRate = getMonthlyInterestRate(rate);
  return (
    (amount * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -length))
  );
}

function getPaymentDate(startDate: Date, monthOffset: number): string {
  const date = new Date(startDate);
  date.setMonth(date.getMonth() + monthOffset);
  return date.toISOString();
}

function calculatePaymentSchedule(loanData: loanForm): any[] {
  const {
    instalmentType,
    loanAmount,
    loanTerm,
    interestRate,
    afterOverpayment,
  } = loanData;
  const monthlyInterestRate = getMonthlyInterestRate(interestRate);
  const monthlyPayment = getMonthlyPayment(loanTerm, interestRate, loanAmount);

  const paymentSchedule = [];
  let remainingBalance = loanAmount;
  const startDate = new Date();

  for (let i = 1; i <= loanTerm; i++) {
    const interest = remainingBalance * monthlyInterestRate;
    const principal = monthlyPayment - interest;

    paymentSchedule.push({
      month: getPaymentDate(startDate, i),
      capital: remainingBalance.toFixed(2),
      interest: interest.toFixed(2),
      installment: principal.toFixed(2),
      total: monthlyPayment.toFixed(2),
    });

    remainingBalance -= principal;
  }

  return paymentSchedule;
}

function recalculatedPaymentSchedule(
  paymentSchedule: any[],
  loanData: loanForm
): any[] {
  const monthlyInterestRate = getMonthlyInterestRate(loanData.interestRate);
  let remainingBalance = loanData.loanAmount;
  const monthlyPayment = getMonthlyPayment(
    loanData.loanTerm,
    loanData.interestRate,
    loanData.loanAmount
  );
  const startDate = new Date();
  const updatedSchedule = [];

  for (let i = 0; i < paymentSchedule.length; i++) {
    const overpayment = Number(paymentSchedule[i].overpayment) || 0;

    const interest = remainingBalance * monthlyInterestRate;
    const principal = monthlyPayment - interest;
    const totalPayment = monthlyPayment + overpayment;
    const startingCapital = remainingBalance;

    let totalPrincipal = principal + overpayment;

    if (totalPrincipal > remainingBalance) {
      totalPrincipal = remainingBalance - interest;
    }

    remainingBalance -= totalPrincipal;

    const actualPrincipal = totalPrincipal - overpayment;

    updatedSchedule.push({
      ...paymentSchedule[i],
      month: getPaymentDate(startDate, i + 1),
      capital: startingCapital.toFixed(2),
      interest: interest.toFixed(2),
      installment: actualPrincipal.toFixed(2),
      total: (actualPrincipal + interest + overpayment).toFixed(2),
      overpayment: overpayment ? overpayment : undefined,
    });

    if (remainingBalance === 0) {
      paymentSchedule.length = i + 1;
      break;
    }
  }
  return updatedSchedule;
}
