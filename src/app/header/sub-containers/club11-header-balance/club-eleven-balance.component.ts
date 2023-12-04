// Angular core
import { Component, Input, EventEmitter, Output, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// NGRX
import { Observable } from 'rxjs';
import { Store, select, ActionsSubject } from '@ngrx/store';

// View models
import { Club11BalanceInterface } from '../../../user/models/club11';

// Reducers
import * as fromUser from '../../../user/reducers';

@Component({
	selector: 'app-club-eleven-balance',
	templateUrl: './club-eleven-balance.component.html',
	styleUrls: ['./club-eleven-balance.component.scss']
})

export class ClubElevenHeaderComponent {
	userHasClub11$: Observable<boolean>;
	isAccountLoading$: Observable<boolean>;
	accountBalance$: Observable<Club11BalanceInterface>;
	@Output() menuItemClickEmitter: EventEmitter<boolean> = new EventEmitter();

	constructor(
		private store: Store<fromUser.UserState>,
	) {
		this.userHasClub11$ = this.store.pipe(select(fromUser.userHasClub11))
		this.isAccountLoading$ = this.store.pipe(select(fromUser.isBalanceLoading));
		this.accountBalance$ = this.store.pipe(select(fromUser.getAccountBalance));
	}

	/**
	 * Handles click on links to get to another page from mobile modal menu
	 */
	menuItemClickHandler() {
		this.menuItemClickEmitter.emit(true);
	}
}
