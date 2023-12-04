// Angular Core
import {
	Component,
	ViewEncapsulation,
	HostListener,
	OnDestroy,
	Inject,
	PLATFORM_ID,
	NgZone
} from '@angular/core';
import { isPlatformServer } from '@angular/common';

/**
 * ngrx
 */
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromStoreLocator from '../../reducers';
import {
	StoreLocatorSearch,
	StoreLocatorSearchFetchNextPage,
	ClearStoreLocatorList
} from '../../actions/store-locator';
import { StoreItemServerInterface } from '../../../common/models/server-store'
import { AddressInputInterface } from '../../../common/models/address-input';
import { Router, ActivatedRoute } from '@angular/router';
import { StoreResultLayoutEnum } from 'app/store/components/store-locator/store-result/store-result.component';
import { AddressSearchEmitterInterface } from 'app/common/components/shared/address-search-input/address-search.component';
import { UIStoreCitiesListItem } from 'app/common/models/store-list';

interface StoreHoursInterface {
	day: string,
	hours: string
}

/**
 * Enum to determine url
 */
enum URLBuilderEnum {
	BASE = 'base',
	PROVINCE = 'province',
	CITY = 'city',
	STORE = 'store'
}

export interface StoreLocationInterface {
	storeid: string,
	fullAddress: string,
	streetAddress: string,
	city: string,
	province: string,
	postalCode: string,
	distance: string,
	status: string,
	services: Array<string>,
	hours: Array<StoreHoursInterface>
}

@Component({
	selector: 'app-store-locator',
	templateUrl: './store-locator-container.component.html',
	styleUrls: ['./store-locator-container.component.scss'],
	encapsulation: ViewEncapsulation.None
})


export class StoreLocatorContainerComponent implements OnDestroy {
	storeResultLayoutEnum = StoreResultLayoutEnum;
	storeList$: Observable<StoreItemServerInterface[]>;
	storesListEmpty$: Observable<boolean>;
	errorResults$: Observable<boolean>;
	userAddress$: Observable<AddressInputInterface>;
	storeDetails$: Observable<StoreItemServerInterface>;
	storeCityList$: Observable<UIStoreCitiesListItem[]>;
	storeCityListProvince$: Observable<UIStoreCitiesListItem[]>;
	storeCityListCity$: Observable<UIStoreCitiesListItem[]>;

	pickupCursorSubscriptionRef;
	routerParamsSubscriptionRef;
	routerQuerySubscriptionRef;
	storeListSubscriptionRef;

	addressString: string;
	city: string;
	province: string;
	streetAddress: string;
	storeId: string;
	storeListCursor: string;
	initialSearchQuery: string;

	private isRenderedOnServer: boolean;
	constructor(
		private store: Store<fromStoreLocator.State>,
		private route: ActivatedRoute,
		private router: Router,
		private zone: NgZone,
		@Inject(PLATFORM_ID) platformId
	) {
		this.isRenderedOnServer = isPlatformServer(platformId);

		this.storeList$ = store.pipe(select(fromStoreLocator.getStoreLocatorList));
		this.storesListEmpty$ = store.pipe(select(fromStoreLocator.isStoreListEmpty));
		this.errorResults$ = store.pipe(select(fromStoreLocator.isStoreListFetched));
		this.userAddress$ = store.pipe(select(fromStoreLocator.getUserInputAddress));
		this.storeDetails$ = store.pipe(select(fromStoreLocator.getStoreDetails));
		this.storeCityList$ = store.pipe(select(fromStoreLocator.getStoreCityList));
		this.storeCityListProvince$ = store.pipe(select(fromStoreLocator.getSimilarProvinces));
		this.storeCityListCity$ = store.pipe(select(fromStoreLocator.getSimilarCities));

		this.pickupCursorSubscriptionRef =
			store.pipe(select(fromStoreLocator.getStoreLocatorCursor)).subscribe(cursor => this.storeListCursor = cursor);

		this.routerQuerySubscriptionRef = this.route.queryParams.subscribe(params => {
			this.initialSearchQuery = params['query'] ? decodeURI(params['query']) : '';
		})
		// this should likely move to a selector from reducer so that we can map params to cities/provinces from backend
		this.routerParamsSubscriptionRef = this.route.params.subscribe(params => {
			this.province = params['province'] ? decodeURI(params['province'].replace(/_/g, ' ')) : null;
			this.city = params['city'] ? decodeURI(params['city'].replace(/_/g, ' ')) : null;
			this.storeId = params['storeId'];
			this.streetAddress = params['storeAddress'] ? decodeURI(params['storeAddress'].replace(/-/g, ' ')) : null;

			this.store.dispatch(new ClearStoreLocatorList(this.province, this.city))
		})

	}

	/**
	 * Unsubscribe
	 */
	ngOnDestroy() {
		this.routerParamsSubscriptionRef.unsubscribe();
		this.routerQuerySubscriptionRef.unsubscribe();
		if (this.pickupCursorSubscriptionRef) {
			this.pickupCursorSubscriptionRef.unsubscribe();
		}
	}
	/**
	 * Form Submission
	*/
	handleSearchStores(event: AddressSearchEmitterInterface) {
		const error = event.error;
		if (error) {
			return false;
		}
		if (event.address) {
			this.addressString = event.address.formatted_address;
			this.parseAddressComponents(event.address.address_components, this.addressString, event.autoLoad)
			this.store.dispatch(new StoreLocatorSearch(event.address))
		}
	}

	/**
	 * Parse Address Components to URL
	 */
	parseAddressComponents(addressComponents, addressString: string, isInitalLoad: boolean) {
		const searchParam = encodeURI(addressString);
		const provinceLabel = 'administrative_area_level_1';
		const cityLabel = 'locality';

		let cityPath = '';
		let provincePath = '';
		addressComponents.forEach(component => {
			if (component.types.indexOf(cityLabel) > -1) {
				// this.city = component.long_name;
				cityPath = encodeURI(component.long_name.trim().replace(/\s+/g, '_'));

			} else if (component.types.indexOf(provinceLabel) > -1) {
				// this.province = component.long_name;
				provincePath = encodeURI(component.long_name.trim().replace(/\s+/g, '_'));

			}
		})
		if (!isInitalLoad) {
			this.zone.run(() => this.router.navigate(['/restaurant-locator', provincePath, cityPath], { queryParams: { query: searchParam } }));
			// this.store.dispatch(new StoreLocatorSearch(addressComponents))
		}
	}

	/**
 	* Handle scrolling of window and paginate only if we reach the end and we have cursor
	 */
	@HostListener('window:scroll', [])
	handleStoreListScroll() {
		if (this.isRenderedOnServer) {
			return false;
		}

		if (this.storeListCursor) {
			const windowHeight = 'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight;

			const body = document.body;
			const html = document.documentElement;
			const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
			const windowBottom = windowHeight + window.pageYOffset;
			if (windowBottom >= docHeight) {
				this.store.dispatch(new StoreLocatorSearchFetchNextPage());
			}
		}
	}

	/**
	 * Dispatch get store details action
	 */
	handleStoreClick(store: StoreItemServerInterface) {
		// console.log(store)
		this.initialSearchQuery = null;
	}

	/**
	 * Build URL
	 */
	buildUrl(path: URLBuilderEnum) {
		const url = ['/restaurant-locator'];
		switch (path) {
			case URLBuilderEnum.PROVINCE: {
				url.push(this.province.replace(/\s+/g, '_'))
				break;
			}
			case URLBuilderEnum.CITY: {
				url.push(this.province.replace(/\s+/g, '_'))
				url.push(this.city.replace(/\s+/g, '_'))
				break
			}
			case URLBuilderEnum.STORE: {
				url.push(this.province.replace(/\s+/g, '_'))
				url.push(this.city.replace(/\s+/g, '_'));
				url.push(encodeURI(this.streetAddress))
				url.push(this.storeId)
			}
		}
		return url;
	}

}
