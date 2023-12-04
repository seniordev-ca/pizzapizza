// Angular Core
import {
	Directive,
	Input,
	HostBinding,
	HostListener,
	ElementRef,
	OnInit,
	Inject,
	PLATFORM_ID
} from '@angular/core';
import { isPlatformServer } from '@angular/common';

@Directive({
	// tslint:disable-next-line:directive-selector we need to disable this to allow us to target all img tags
	selector: 'img',
})

export class ImagePreloadDirective implements OnInit {
	// Allows for default images to be defined on each img tag directly
	// TODO: Replace with actual PizzaPizza placeholder --- likely from API
	lazyLoadImg = './static-files/images/loadimg.png'
	defaultClass = 'pp-image ghost-hidden invisible';

	@Input() default = './static-files/images/default-image.svg';
	@Input() fallBackText = 'Photo not available';
	@Input() class: string;

	// Binds the img src to the input
	@HostBinding('src')
	@Input() src: string;

	lazyLoad: string;
	isIntersectionObserverAvailable: boolean;

	private intersectionObserver?: IntersectionObserver;
	private isRenderedOnServer: boolean;

	constructor(
		private el: ElementRef,
		@Inject(PLATFORM_ID) platformId
	) {
		this.isRenderedOnServer = isPlatformServer(platformId);
		// While the IntersectionObserver is supported in the modern browsers, it will
		// never be added to Internet Explorer (IE) and is not in my version of Safari
		// (at the time of this post). As such, we'll only use it if it's available.
		// And, if it's not, we'll fall-back to non-lazy behaviors.
		this.isIntersectionObserverAvailable = !this.isRenderedOnServer && window['IntersectionObserver'];

	}

	/**
	 * On Init
	 */
	ngOnInit() {
		// Commenting out for now might need more work
		if (this.default && this.src) {
			this.defaultClass = '';

			this.lazyLoad = this.src;
			this.src = this.lazyLoadImg;
			if (this.isIntersectionObserverAvailable) {
				this.intersectionObserver = new IntersectionObserver(entries => {
					this.checkForIntersection(entries);
				}, {});
				this.intersectionObserver.observe(<Element>(this.el.nativeElement));
			} else {
				this.src = this.lazyLoad;
			}
		}
	}

	/**
	 * Check if element is in view
	 */
	private checkForIntersection = (entries: Array<IntersectionObserverEntry>) => {
		entries.forEach((entry: IntersectionObserverEntry) => {
			if (this.checkIfIntersecting(entry)) {
				// this.deferLoad.emit();
				this.src = this.lazyLoad;
				this.intersectionObserver.unobserve(<Element>(this.el.nativeElement));
				this.intersectionObserver.disconnect();
			} else {
				this.defaultClass = '';
			}
		});
	}

	/**
	 * Is In View
	 */
	private checkIfIntersecting(entry: IntersectionObserverEntry) {
		return (entry).isIntersecting && entry.target === this.el.nativeElement;
	}

	/**
	 * Update image url on error
	 */
	@HostListener('error')
	updateUrl() {
		if (this.isRenderedOnServer) {
			return false;
		}

		if (this.default && this.src) {
			this.src = this.default;

			// Add 'photo not available' text to parent element only if default and src is set
			const parentNode = this.el.nativeElement.parentNode;
			const noImgText = document.createElement('span');
			noImgText.classList.add('pp-no-img-text')
			noImgText.classList.add('ghost-hidden')
			noImgText.innerHTML = this.fallBackText;
			const addChild = parentNode.querySelector('.pp-no-img-text') && noImgText ? null : parentNode.appendChild(noImgText);
		}
		// hide images that we assign default=null if the original src image fails
		this.defaultClass = !this.default ? 'd-none' : 'pp-default-image';
	}

	/**
	 * On Image load we change the class
	 */
	@HostListener('load')
	updateClass() {
		if (this.src !== this.default) {
			this.defaultClass = 'pp-image-loaded';
			// remove .pp-no-img-text if image is successfully loaded this fixes a bug in which the same dom loads multiple images and one fails
			const parentNode = this.el.nativeElement.parentNode;
			const noImgText = parentNode.querySelector('.pp-no-img-text');
			if (noImgText) {
				parentNode.removeChild(noImgText);
			}
		} else {
			this.defaultClass = this.defaultClass;
		}
	}

	/**
	 * Update Image class
	 */
	@HostBinding('class')
	get elementClass(): string {
		return this.class + ' ' + this.defaultClass;
	}
}
