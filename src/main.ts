import { bootstrapApplication } from '@angular/platform-browser';
import { LoanDashboardComponent } from './app/loan-dashboard/loan-dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';

bootstrapApplication(LoanDashboardComponent, {
  providers: [importProvidersFrom(BrowserAnimationsModule)],
}).catch(err => console.error(err));
