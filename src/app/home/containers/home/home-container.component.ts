// Angular Core
import {
	Component,
	ViewEncapsulation,
	OnDestroy
} from '@angular/core';

// NGRX Core
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

// Reducers
import * as fromCommon from '../../../common/reducers';
import * as fromCatalog from '../../../catalog/reducers';
import * as fromHome from '../../reducers';
import * as fromUser from '../../../user/reducers';

// Actions
import { FetchFeaturedSlides } from '../../../catalog/actions/featured-products';
import { FetchCategories } from '../../../catalog/actions/category';
import { FetchJustForYou } from '../../../catalog/actions/just-for-you';
import { FetchBanner } from '../../actions/banner';

// View Models
import { SliderInterface } from '../../models/featured-slider';
import { Category } from '../../../catalog/models/category';
import { ServerCategoriesInterface } from '../../../catalog/models/server-category';
import { RecommendationInterface } from '../../models/recommendations';
import { ServerBannerInterface } from '../../models/server-banner';
import { UserSummaryInterface } from '../../../user/models/user-personal-details';
import { JustForYouActionEnum, JustForYouEmitterInterface } from '../../components/recommendations/recommendations.component';
import { AddOrderToCart } from '../../../checkout/actions/orders';
import { UIBannerInterface, UIAppLinksInterface } from '../../models/banner-ui';
import { Router } from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './home-container.component.html',
	styleUrls: ['./home-container.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class HomeContainerComponent implements OnDestroy {
	// TODO take it from auth store.
	// That flag is changing block order for just for you block
	loginUser$: Observable<UserSummaryInterface>;

	featuredProductsSlider$: Observable<SliderInterface[]>
	featuredLoading$: Observable<boolean>
	featuredError$: Observable<boolean>
	featuredCategory$: Observable<ServerCategoriesInterface>

	categoriesList$: Observable<Category[]>
	categoriesLoading$: Observable<boolean>
	categoriesError$: Observable<boolean>

	justForYouList$: Observable<RecommendationInterface[]>
	justForYouLoading$: Observable<boolean>
	justForYouError$: Observable<boolean>

	bannerList$: Observable<UIBannerInterface[]>
	bannerLoading$: Observable<boolean>
	bannerError$: Observable<boolean>

	appLinks$: Observable<UIAppLinksInterface>

	isAddressComplete$: Observable<boolean>;

	constructor(
		private store: Store<fromCommon.State>,
		private catalogStore: Store<fromCatalog.CatalogState>,
		private homeStore: Store<fromHome.HomeState>,
		private router: Router
	) {
		this.loginUser$ = this.store.pipe(select(fromUser.getLoggedInUser));
		this.appLinks$ = this.store.pipe(select(fromCommon.getAppLinks));
		this.isAddressComplete$ = this.store.pipe(select(fromCommon.getIsAddressComplete))

		this._subscribeFeaturedSlider();
		this._subscribeCategories();
		this._subscribeJustForYou();
		this._subscribeBanner();
	}

	/**
	 * Destroy subscriptions
	 */
	ngOnDestroy() {

	}

	/**
	 * Subscribe to store, define server -> view mapper
	 */
	private _subscribeFeaturedSlider() {
		// Featured product loading and error state
		this.featuredLoading$ = this.catalogStore.pipe(select(fromCatalog.getFeaturedLoading));
		this.featuredError$ = this.catalogStore.pipe(select(fromCatalog.getFeaturedError));
		this.featuredCategory$ = this.catalogStore.pipe(select(fromCatalog.getFeaturedProductsCategory));
		this.featuredProductsSlider$ = this.catalogStore.pipe(select(fromCatalog.getFeaturedProducts));
	}

	/**
	 * Subscribe to store, define server -> view mapper
	 * TODO error state handling in UI
	 */
	private _subscribeCategories() {
		this.categoriesLoading$ = this.catalogStore.pipe(select(fromCatalog.getCategoriesLoading));
		this.categoriesError$ = this.catalogStore.pipe(select(fromCatalog.getCategoriesError));
		// const categories$ = this.catalogStore.pipe(select(fromCatalog.getCategories));

		// Categories list is being mapped from the home reducer - this is subscribing to it
		this.categoriesList$ = this.catalogStore.pipe(select(fromHome.getAllCategories))
	}

	/**
	 * Subscribe to store, define server -> view mapper
	 */
	private _subscribeJustForYou() {
		this.justForYouLoading$ = this.catalogStore.pipe(select(fromCatalog.getJustForYouLoading));
		this.justForYouError$ = this.catalogStore.pipe(select(fromCatalog.getJustForYouError));
		this.justForYouList$ = this.catalogStore.pipe(select(fromCatalog.justForYouList));

	}

	/**
	 * Subscribe to store
	 */
	private _subscribeBanner() {
		this.bannerList$ = this.homeStore.pipe(select(fromHome.getBannerList));
		this.bannerLoading$ = this.homeStore.pipe(select(fromHome.getBannerLoading));
		this.bannerError$ = this.homeStore.pipe(select(fromHome.getBannerError));
	}

	/**
	 * Feature slider events hander
	 */
	sliderEventHandler(action) {
		// TODO check if that is retry action
		this.catalogStore.dispatch(new FetchFeaturedSlides());
	}

	/**
	 * Catalog fetch retry handler
	 */
	categoryRetryHandler() {
		this.catalogStore.dispatch(new FetchCategories());
	}

	/**
	 * Just for you retry handler
	 */
	justForYouRetryHandler() {
		this.catalogStore.dispatch(new FetchJustForYou());
	}

	/**
	 * Just For You Events
	 */
	justForYouHandler(event: JustForYouEmitterInterface) {
		switch (event.action) {
			case JustForYouActionEnum.REPEATORDER: {
				this.router.navigate(['/checkout/repeat-last-order'])
				break
			}
			default: {
				console.log(event)
			}
		}
	}
	/**
	 * Banner retry handler
	 */
	bannerRetryHandler() {
		this.catalogStore.dispatch(new FetchBanner());
	}

}
