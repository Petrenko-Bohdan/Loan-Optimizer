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

    const recalculatedSchedule = recalculatedPaymentScheduleAfterOverpayment(
      state.result!,
      updatedSchedule
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

  if (instalmentType === 'Declining') {
    return calculateDecliningSchedule(loanAmount, loanTerm, interestRate);
  }

  return calculateEqualSchedule(loanAmount, loanTerm, interestRate);
}

function calculateEqualSchedule(
  loanAmount: number,
  loanTerm: number,
  interestRate: number
): any[] {
  const paymentSchedule = [];

  const monthlyInterestRate = getMonthlyInterestRate(interestRate);
  const monthlyPayment = getMonthlyPayment(loanTerm, interestRate, loanAmount);
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

function calculateDecliningSchedule(
  loanAmount: number,
  loanTerm: number,
  interestRate: number
): any[] {
  const paymentSchedule = [];

  const monthlyInterestRate = getMonthlyInterestRate(interestRate);
  const monthlyPrincipal = loanAmount / loanTerm;
  let remainingBalance = loanAmount;
  const startDate = new Date();

  for (let i = 1; i <= loanTerm; i++) {
    const interest = remainingBalance * monthlyInterestRate;
    const totalPayment = monthlyPrincipal + interest;

    paymentSchedule.push({
      month: getPaymentDate(startDate, i),
      capital: remainingBalance.toFixed(2),
      interest: interest.toFixed(2),
      installment: monthlyPrincipal.toFixed(2),
      total: totalPayment.toFixed(2),
    });
    remainingBalance -= monthlyPrincipal;
  }
  return paymentSchedule;
}

const calculators = {
  Equal: {
    lowerInstallment: recalculateEqual_LowerInstallment,
    shorterPeriod: recalculateEqual_ShorterPeriod,
  },
  Declining: {
    lowerInstallment: recalculateDeclining_LowerInstallment,
    shorterPeriod: recalculateDeclining_ShorterPeriod,
  },
};

function recalculatedPaymentScheduleAfterOverpayment(
  loanData: loanForm,
  paymentSchedule: any[]
): any[] {
  const fn = calculators[loanData.instalmentType][loanData.afterOverpayment];

  return fn(paymentSchedule, loanData);
}

export function recalculateEqual_LowerInstallment(
  paymentSchedule: any[],
  loanData: loanForm
): any[] {
  const monthlyInterestRate = getMonthlyInterestRate(loanData.interestRate);
  let remainingBalance = loanData.loanAmount;
  const startDate = new Date();

  const updatedSchedule = [];

  for (let i = 0; remainingBalance > 0 && i < loanData.loanTerm; i++) {
    const remainingTerm = loanData.loanTerm - i;
    const overpayment = Number(paymentSchedule[i].overpayment) || 0;
    const monthlyPayment = getMonthlyPayment(
      remainingTerm,
      loanData.interestRate,
      remainingBalance
    );
    const totalPayment = monthlyPayment + overpayment;
    const startingCapital = remainingBalance;
    const interest = remainingBalance * monthlyInterestRate;
    let principal = totalPayment - interest;

    if (principal > remainingBalance) {
      principal = remainingBalance;
    }

    remainingBalance -= principal;

    updatedSchedule.push({
      month: getPaymentDate(startDate, i + 1),
      capital: startingCapital.toFixed(2),
      interest: interest.toFixed(2),
      installment: (principal - overpayment).toFixed(2),
      total: (interest + principal).toFixed(2),
      overpayment: overpayment ? overpayment : undefined,
    });
  }

  return updatedSchedule;
}

function recalculateEqual_ShorterPeriod(
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
    const startingCapital = remainingBalance;

    let totalPrincipal = principal + overpayment;

    if (totalPrincipal > remainingBalance) {
      totalPrincipal = remainingBalance;
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

function recalculateDeclining_LowerInstallment(
  paymentSchedule: any[],
  loanData: loanForm
) {
  const monthlyInterestRate = getMonthlyInterestRate(loanData.interestRate);
  const monthlyPrincipal = loanData.loanAmount / loanData.loanTerm;
  let remainingBalance = loanData.loanAmount;
  const startDate = new Date();

  const updatedSchedule = [];

  for (let i = 0; remainingBalance > 0 && i < loanData.loanTerm; i++) {
    const overpayment = Number(paymentSchedule[i].overpayment) || 0;
    const startingCapital = remainingBalance;
    const interest = startingCapital * monthlyInterestRate;
    let principal = monthlyPrincipal + overpayment;
    if (principal > remainingBalance) {
      principal = remainingBalance;
    }
    remainingBalance -= principal;

    updatedSchedule.push({
      month: getPaymentDate(startDate, i + 1),
      capital: startingCapital.toFixed(2),
      interest: interest.toFixed(2),
      installment: (principal - overpayment).toFixed(2),
      total: (interest + principal).toFixed(2),
      overpayment: overpayment ? overpayment : undefined,
    });
  }
  return updatedSchedule;
}

function recalculateDeclining_ShorterPeriod(
  paymentSchedule: any[],
  loanData: loanForm
) {
  const monthlyInterestRate = getMonthlyInterestRate(loanData.interestRate);
  const monthlyPrincipal = loanData.loanAmount / loanData.loanTerm;
  let remainingBalance = loanData.loanAmount;

  const startDate = new Date();
  const updatedSchedule = [];

  let monthIndex = 0;

  while (remainingBalance > 0) {
    const overpayment = Number(paymentSchedule[monthIndex]?.overpayment) || 0;
    const interest = remainingBalance * monthlyInterestRate;
    let principal = monthlyPrincipal + overpayment;

    if (principal > remainingBalance) {
      principal = remainingBalance;
    }

    const totalPayment = principal + interest;

    updatedSchedule.push({
      month: getPaymentDate(startDate, monthIndex + 1),
      capital: remainingBalance.toFixed(2),
      interest: interest.toFixed(2),
      installment: (principal - overpayment).toFixed(2),
      total: totalPayment.toFixed(2),
      overpayment: overpayment ? overpayment : undefined,
    });

    remainingBalance -= principal;
    monthIndex++;
  }

  return updatedSchedule;
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
      totalPrincipal = remainingBalance;
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
