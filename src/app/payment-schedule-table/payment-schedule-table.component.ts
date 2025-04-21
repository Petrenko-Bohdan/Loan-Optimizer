import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';


@Component({
  selector: 'app-payment-schedule-table',
  standalone: true,
  imports: [MatCardModule, MatTableModule],
  templateUrl: './payment-schedule-table.component.html',
  styleUrl: './payment-schedule-table.component.scss'
})
export class PaymentScheduleTableComponent {
	displayedColumns: string[] = ['month', 'capital', 'interest', 'total'];
}
