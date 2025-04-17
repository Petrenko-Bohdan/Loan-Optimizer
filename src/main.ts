import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations'; // <-- импорт
import { AppComponent } from './app/app.component';
import { provideStore } from '@ngrx/store';
import { loanReducer } from './app/store/calculate-loan/calculate-loan.reducer';

bootstrapApplication(AppComponent, {
  providers: [
    provideStore({ loan: loanReducer }),
    provideAnimations(), 
  ],
});
