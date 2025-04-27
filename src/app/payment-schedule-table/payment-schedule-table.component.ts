import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { AppState } from '../store/calculate-loan/app.state';
import { selectLoanResult } from '../store/calculate-loan/calculate-loan.selectors';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { MatCommonModule } from '@angular/material/core';
import { updateOverpayment } from '../store/calculate-loan/calculate-loan.actions';

@Component({
  selector: 'app-payment-schedule-table',
  standalone: true,
  imports: [MatCardModule, MatTableModule, CommonModule, MatCommonModule],
  templateUrl: './payment-schedule-table.component.html',
  styleUrl: './payment-schedule-table.component.scss',
})
export class PaymentScheduleTableComponent {
  displayedColumns: string[] = [
    'month',
    'capital',
    'interest',
    'installment',
    'total',
    'overpayment',
  ];

  paymentSchedule$: Observable<any[]>;

  constructor(private store: Store<AppState>) {
    this.paymentSchedule$ = this.store.select(selectLoanResult);
  }

  onOverpaymentChange(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = parseFloat(input.value);

    this.store.dispatch(updateOverpayment({ index, overpayment: value }));
  }
}
