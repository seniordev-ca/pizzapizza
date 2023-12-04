import {
	Component,
	Input,
	ViewEncapsulation,
	Output,
	EventEmitter,
	PLATFORM_ID,
	Inject,
	OnInit,
} from '@angular/core';

import { StoreItemServerInterface } from '../../../../common/models/server-store';
// Env config
import { environment, googleMapStyle } from '../../../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { MetaService } from 'app/store/meta.service';


/**
 * Layout Determines How Store Is Displayed
 */
export enum StoreResultLayoutEnum {
	LIST,
	SINGLE,
	NEARBY
}
@Component({
	selector: 'app-store-result',
	templateUrl: './store-result.component.html',
	styleUrls: ['./store-result.component.scss'],
	encapsulation: ViewEncapsulation.None
})


export class StoreResultComponent implements OnInit {
	storeResultLayoutEnum = StoreResultLayoutEnum
	fullAddress: string;
	storeFeatures: string;
	title = 'canonical';
	canonicalLink: string;
	@Input() store: StoreItemServerInterface;
	@Input() layout: StoreResultLayoutEnum;
	@Output() storeEmitter: EventEmitter<StoreItemServerInterface> = new EventEmitter<StoreItemServerInterface>()

	// Static Map related vars (for demo)
	imgWidth: string;
	googleAPIKey: string;
	mapStyleJson: string;

	constructor(
		@Inject(PLATFORM_ID) private platformId: Object, private metaService: MetaService,
	) {
		// Static Map related vars (for demo)
		this.googleAPIKey = environment.googleServiceKey;
		this.mapStyleJson = googleMapStyle;
	}

	/**
	 * On Init
	 */
	ngOnInit() {
		if (this.layout === 1) {
			this.canonicalLink = window.location.href;
		}
		this.fullAddress = this.getFullAddress(this.store);
		this.storeFeatures = this.getStoreFeatures(this.store);
		// Not sure if this is the best approach. Change the google map image size on smaller devices
		if (isPlatformBrowser(PLATFORM_ID) && (window.screen.width) < 576) {
			this.imgWidth = (window.screen.width) + '';
		} else {
			this.imgWidth = '300';
		}
	}
	/**
	 * Merge store address components to full address
	 */
	getFullAddress(store) {
		const addressUri = encodeURIComponent(store.address.trim().replace(/\s+/g, '-').toLowerCase());
		const provinceUri = encodeURIComponent(store.province.replace(/\s+/g, '-').toLowerCase());
		const cityUri = encodeURIComponent(store.city.replace(/\s+/g, '-').toLowerCase());
		return addressUri + ', ' + cityUri + ' ' + provinceUri + ', ' + store.postal_code
	}

	/**
	 * Emit Store Up To Parent
	 */
	onStoreClick(store: StoreItemServerInterface) {
		this.storeEmitter.emit(store);
	}

	/**
	 * Get Store Features
	 */
	getStoreFeatures(store: StoreItemServerInterface) {
		const features = [];
		if (store.delivery_available) {
			features.push('Delivery');
		}
		if (store.pickup_available) {
			features.push('Pickup')
		}
		if (store.is_online) {
			features.push('Online');
		}
		if (store.is_express) {
			features.push('Express')
		}

		return features.join(', ');
	}
}
