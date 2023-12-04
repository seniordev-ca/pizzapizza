// Angular core
import {
	Component,
	ViewEncapsulation,
	OnInit,
	OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';

// NG RX core
import { Store, select, ActionsSubject } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { filter } from 'rxjs/operators';

// Reduce, actions
import * as fromReducers from '../../reducers';
import * as fromUser from '../../../user/reducers';
import { AddOrderToCart } from '../../../checkout/actions/orders';
import {
	CartActionsTypes,
} from '../../../checkout/actions/cart';

// ViewModel interfaces
import { RecommendationInterface, RecommendationTemplateEnum } from '../../../home/models/recommendations';
import { SubHeaderNavigationInterface } from '../../../common/components/shared/sub-header-navigation/sub-header-navigation.component';
import { UserSummaryInterface } from '../../../user/models/user-personal-details';
class GenerateGhostProductListHelper {
	/**
	 * Generate an observable ghost product list
	 */
	static generateGhostList(count) {
		const ghostProduct = {
			id: '',
			title: '',
			image: '',
			description: '',
		}
		const ghostProductList = Array.apply(null, Array(count)).map(function () {
			return ghostProduct;
		})
		return of(ghostProductList)
	}
}

@Component({
	selector: 'app-just-for-you-list',
	templateUrl: './just-for-you-list.component.html',
	styleUrls: ['./just-for-you-list.component.scss'],
	encapsulation: ViewEncapsulation.None
})

/**
 * Just for you product list
 */
export class JustForYouProductListContainerComponent implements OnInit, OnDestroy {
	RecommendationTemplateEnum = RecommendationTemplateEnum
	// Products list
	productList$: Observable<RecommendationInterface[]>
	productListLoading$: Observable<boolean>
	productListError$: Observable<boolean>

	justForYousMeta$: Observable<SubHeaderNavigationInterface>

	userSummary$: Observable<UserSummaryInterface>;
	// References for direct subscription
	loadingSubscriptionRef = null;
	productFetchSubscriptionRef = null;
	addToCartSuccessRef = null;
	constructor(
		private store: Store<fromReducers.CatalogState>,
		private actions: ActionsSubject,
		private router: Router
	) {}

	/**
	 * Angular constructor
	 */
	ngOnInit() {
		this._subscribeProductCategoryContent();
		this._subscribeOnAddToCartSuccess();
	}

	/**
	 * Angular destructor
	 */
	ngOnDestroy() {
		this._unSubscribeAllDirectListeners();
	}

	/**
	 * Subscribe to store, define server -> view mapper
	 * TODO error state handling in UI
	 */
	private _subscribeProductCategoryContent() {
		this.justForYousMeta$ = this.store.pipe(select(fromReducers.getjustForYouCategory))
		this.userSummary$ = this.store.pipe(select(fromUser.getLoggedInUser));

		// Categories and product list loading and errors
		this.productListLoading$ = this.store.pipe(select(fromReducers.getJustForYouLoading));
		this.productListError$ = this.store.pipe(select(fromReducers.getJustForYouError));

		// Generate ghost DOM if data is loading
		this.loadingSubscriptionRef = this.productListLoading$.subscribe(loading => {
			if (loading) {
				this.productList$ = GenerateGhostProductListHelper.generateGhostList(6);
			} else {
				this.productList$ = this.store.pipe(select(fromReducers.justForYouList));
			}
		})
	}



	/**
	 * Subscribe to Add to Cart Success
	 */
	private _subscribeOnAddToCartSuccess() {
		this.addToCartSuccessRef = this.actions.pipe(
			filter(action =>
				action.type === CartActionsTypes.AddConfigurableProductToCartSuccess
				|| action.type === CartActionsTypes.AddBasicProductToCartSuccess
				|| action.type === CartActionsTypes.TooManyItemsInCartFailure
			))
			.subscribe((action) => {

			})
	}

	/**
	 * Unsubscribe from all direct listenings
	 */
	private _unSubscribeAllDirectListeners() {
			this.loadingSubscriptionRef.unsubscribe();
			this.addToCartSuccessRef.unsubscribe();
	}

	/**
	 * Determine Router link of slide
	 */
	determineLink(slide) {
		const link = slide.template === RecommendationTemplateEnum.MyPizzas ? 'my-pizzas' : 'just-for-you/' + slide.id
		return '/catalog/' + link
	}


	/**
	 * Handle button clicks
	 */
	onButtonClick(slide) {
		let link = null;
		switch (slide.template) {
			case RecommendationTemplateEnum.LastOrder: {

				this.store.dispatch(new AddOrderToCart(slide.id))
				break
			}
			case RecommendationTemplateEnum.MyPizzas: {

				link = '/catalog/my-pizzas';
				break
			}
			case RecommendationTemplateEnum.ClubElevenEleven: {

				link = '/user/club-eleven-eleven';
				break
			}
			case RecommendationTemplateEnum.CouponWallet: {
				link = '/user/club-eleven-eleven';
				break
			}
			default: {

				link = '/catalog/just-for-you/' + slide.seoTitle
				break
			}
		}
		if (link) {
			this.router.navigate([link])
		}
	}
}
