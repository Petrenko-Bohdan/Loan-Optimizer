import { Routes } from '@angular/router';
import { LoanFormComponent } from './loan-form/loan-form.component';

export const routes: Routes = [
  {
    path: '',
    component: LoanFormComponent,
    children: [
      {
        path: 'results',
        loadComponent: () =>
          import('./payment-schedule-table/payment-schedule-table.component').then(
            (m) => m.PaymentScheduleTableComponent
          ),
      },
    ],
  },
];





