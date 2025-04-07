import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { instalmentTypes } from '../models/loan.model';
import { FormsModule } from '@angular/forms';
import { afterOverpayment } from '../models/loan.model';
import { loanForm } from '../models/loan.model';
import { select, Store } from '@ngrx/store';
import { calculateLoanValid } from '../store/loan.actions';
import { AppStateValid } from '../store/app.state';
import { Observable } from 'rxjs';
import { selectPaymentScheduleValid } from '../store/loan.selectors';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
  ],
  templateUrl: './loan-form.component.html',
  styleUrl: './loan-form.component.scss',
})
export class LoanFormComponent {
  loanForm: FormGroup;
  instalmentTypes: instalmentTypes[] = [
    { value: 'Equal', viewValue: 'Równa' },
    { value: 'Declining', viewValue: 'Malejąca' },
  ];

  afterOverpayment: afterOverpayment[] = [
    { value: 'lowerInstallment', viewValue: 'Nizsza rata' },
    { value: 'shorterPeriod', viewValue: 'Krótszy okres' },
  ];

  paymentScheduleValid$: Observable<any>;

  constructor(private fb: FormBuilder, private store: Store<AppStateValid>) {
    this.loanForm = this.fb.group({
      instalmentType: ['Equal', Validators.required],
      loanAmount: [null, [Validators.required, Validators.min(1)]],
      loanTerm: [null, [Validators.required, Validators.min(1)]],
      interestRate: [null, Validators.required],
      afterOverpayment: ['shorterPeriod', Validators.required],
    });

    this.paymentScheduleValid$ = this.store.select(selectPaymentScheduleValid);
  }

  onSubmit() {
    if (this.loanForm.valid) {
      const loan: loanForm = this.loanForm.value;
      this.store.dispatch(calculateLoanValid({ loan }));
      console.log(this.loanForm.value);
    } else {
      console.log('Form is invalid');
    }
  }
}
