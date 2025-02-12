import { Component } from '@angular/core';
import {Store} from '@ngrx/store';
import {Observable} from 'rxjs';
import {AppState} from '../store/app.state';
import {calculateLoan} from '../store/loan.actions';
import { selectPaymentSchedule } from '../store/loan.selectors';
import {Loan} from '../models/loan.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-loan-details',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loan-details.component.html',
  styleUrl: './loan-details.component.scss'
})
export class LoanDetailsComponent {

	loan: Loan = {
		id: 1,
		amount: 0,
		interestRate: 0,
		term: 0,
	}

	paymentSchedule$: Observable<any[]>;
	displayedColumns: string[] = ['month', 'monthlyPayment', 'principal', 'interest', 'remainingBalance'];

	constructor(private store: Store<AppState>){
		this.paymentSchedule$ = this.store.select(selectPaymentSchedule);
	}

	onSubmit() {
		this.store.dispatch(calculateLoan({loan: this.loan}));
		console.log(this.paymentSchedule$);
		
		
	}
}
