import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { provideStore } from '@ngrx/store';
import { loanReducer } from './app/store/calculate-loan/calculate-loan.reducer';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideStore({ loan: loanReducer }),
    provideAnimations(), 
		provideRouter(routes)
  ],
});
