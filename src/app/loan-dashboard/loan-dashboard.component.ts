import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';


@Component({
  selector: 'app-loan-dashboard',
	standalone: true,
  imports: [CommonModule],
  templateUrl: './loan-dashboard.component.html',
  styleUrl: './loan-dashboard.component.scss'
})
export class LoanDashboardComponent implements OnInit {
	constructor() { }

	ngOnInit() {
	}

}
