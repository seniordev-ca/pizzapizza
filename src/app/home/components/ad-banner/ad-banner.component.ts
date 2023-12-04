import { Component, Input, Output, EventEmitter } from '@angular/core';
import { UIBannerInterface } from '../../models/banner-ui';

@Component({
	selector: 'app-home-pizza-banner',
	templateUrl: './ad-banner.component.html',
	styleUrls: ['./ad-banner.component.scss']
})

export class AdBannerComponent {
	privateBannerList: UIBannerInterface[];
	count: number;
	@Input()
	set bannerList(bannerList: UIBannerInterface[]) {
		this.privateBannerList = bannerList;
		this.count = bannerList.length;
	}
	@Input() loading: boolean;
	@Input() error: boolean;
	@Output() retryEventEmitter: EventEmitter<boolean> = new EventEmitter();

	constructor() {
	}

	/**
	 * Handler for banner navigation
	 * TODO use Angular Router
	 */
	openSlide(link, isInNewWindow) {
		console.log(link + ' ' + isInNewWindow);
	}

	/**
	 * Handler for data fetch action
	 */
	onRetryClick() {
		this.retryEventEmitter.emit();
	}
}
