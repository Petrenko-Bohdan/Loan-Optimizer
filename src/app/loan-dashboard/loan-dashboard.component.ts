import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-loan-dashboard',
  standalone: true,
  templateUrl: './loan-dashboard.component.html',
  styleUrls: ['./loan-dashboard.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
		MatCardModule,
  ],
})
export class LoanDashboardComponent {

  rateType = 'równa'; 
  postOverpayment = 'lower installment';


  totalPayments = 0; 
  totalOverpayment = 0; 
  totalCost = 0; 
  repaymentTime = 300; 
  profit = 'brak'; 

	

}