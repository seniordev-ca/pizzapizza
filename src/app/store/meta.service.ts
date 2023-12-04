import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
	providedIn: 'root'
})

export class MetaService {

	constructor(@Inject(DOCUMENT) private dom) { }

	/**
	 * Close Cart Full Popup
	 */
	createCanonicalURL() {
		const link: HTMLLinkElement = this.dom.createElement('link');
		link.setAttribute('rel', 'canonical');
		this.dom.head.appendChild(link);
		link.setAttribute('href', this.dom.URL);
	}
}
