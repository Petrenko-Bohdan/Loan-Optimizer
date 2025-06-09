import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { provideStore } from '@ngrx/store';
import { loanReducer } from './app/store/calculate-loan/calculate-loan.reducer';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';
import { firebaseConfig } from './app/enviroment/firebase-config';

bootstrapApplication(AppComponent, {
  providers: [
    provideStore({ loan: loanReducer }),
    provideAnimations(), 
		provideRouter(routes),
		provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAnalytics(() => getAnalytics())
  ],
});
