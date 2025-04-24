import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { AppState } from '../store/calculate-loan/app.state';
import { selectLoanResult } from '../store/calculate-loan/calculate-loan.selectors';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { MatCommonModule } from '@angular/material/core';


@Component({
  selector: 'app-payment-schedule-table',
  standalone: true,
  imports: [MatCardModule, MatTableModule, CommonModule, MatCommonModule],
  templateUrl: './payment-schedule-table.component.html',
  styleUrl: './payment-schedule-table.component.scss'
})
export class PaymentScheduleTableComponent {
	displayedColumns: string[] = ['month','capital', 'interest', 'installment', 'total'];

	paymentSchedule$: Observable<any[]>;

	constructor(private store: Store<AppState>){
		this.paymentSchedule$=this.store.select(selectLoanResult)
	}
}
