export interface instalmentTypes {
  value: string;
  viewValue: string;
}

export type instalmentType = 'Equal' | 'Declining';
export type afterOverpaymentType = 'lowerInstallment' | 'shorterPeriod';

export interface afterOverpayment {
  value: string;
  viewValue: string;
}

export interface loanForm {
  instalmentType: instalmentType;
  loanAmount: number;
  loanTerm: number;
  interestRate: number;
  afterOverpayment: afterOverpaymentType;
}

export interface loanResult {
  month: number;
  capital: number;
  interest: number;
  installment: number;
  total: number;
  overpayment: number;
}

