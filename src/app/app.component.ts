import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoanDetailsComponent } from './loan-details/loan-details.component';
import { LoanFormComponent } from './loan-form/loan-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoanDetailsComponent, LoanFormComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Loan-Optimizer';
}
