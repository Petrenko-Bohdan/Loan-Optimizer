import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, mergeMap, catchError } from 'rxjs/operators';


import { Loan } from '../models/loan.model';

@Injectable()
export class LoanEffects{
	constructor(
		private actions$: Actions,
		
		private store: Store
	){}	
}