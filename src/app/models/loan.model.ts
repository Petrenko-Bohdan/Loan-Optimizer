export interface instalmentTypes{
	value: string;
	viewValue: string;
}

export interface afterOverpayment {
	value: string;
	viewValue: string;
}

export interface loanForm {
	instalmentType: string;
	loanAmount: number;
	loanTerm: number;
	interestRate: number;
	afterOverpayment: string;
}

