export interface instalmentTypes {
  value: string;
  viewValue: string;
}

export type instalmentType = 'Equal' | 'Declining';

export interface afterOverpayment {
  value: string;
  viewValue: string;
}

export interface loanForm {
  instalmentType: instalmentType;
  loanAmount: number;
  loanTerm: number;
  interestRate: number;
  afterOverpayment: string;
}

export interface loanResult {
  month: number;
  capital: number;
  interest: number;
  installment: number;
  total: number;
  overpayment: number;
}

