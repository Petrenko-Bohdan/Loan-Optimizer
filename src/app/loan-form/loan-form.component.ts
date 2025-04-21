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
import { Observable } from 'rxjs';
import { calculateLoan } from '../store/calculate-loan/calculate-loan.actions';
import { PaymentScheduleTableComponent } from "../payment-schedule-table/payment-schedule-table.component";
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';



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
    PaymentScheduleTableComponent,
		CommonModule,
		RouterModule,
],
  templateUrl: './loan-form.component.html',
  styleUrl: './loan-form.component.scss',
})
export class LoanFormComponent {
  loanForm: FormGroup;
	showResults: boolean = false;
  instalmentTypes: instalmentTypes[] = [
    { value: 'Equal', viewValue: 'Równa' },
    { value: 'Declining', viewValue: 'Malejąca' },
  ];

  afterOverpayment: afterOverpayment[] = [
    { value: 'lowerInstallment', viewValue: 'Nizsza rata' },
    { value: 'shorterPeriod', viewValue: 'Krótszy okres' },
  ];

  constructor(private fb: FormBuilder, private store: Store, private router: Router) {
    this.loanForm = this.fb.group({
      instalmentType: ['Equal', Validators.required],
      loanAmount: [null, [Validators.required, Validators.min(1)]],
      loanTerm: [null, [Validators.required, Validators.min(1)]],
      interestRate: [null, Validators.required],
      afterOverpayment: ['shorterPeriod', Validators.required],
    });
  }

  onSubmit() {
		if (this.loanForm.valid) {
			const loanData: loanForm = this.loanForm.value;
			this.store.dispatch(calculateLoan({ loanData }));
			this.router.navigate(['results'], { relativeTo: this.router.routerState.root.firstChild });


		} else {
			console.log('Form is invalid');
		}
  }
}
