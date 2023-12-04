import { Directive, Renderer2, ElementRef, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
	selector: '[appMoveToHead]'
})
export class MoveToHeadDirective implements OnDestroy, OnInit {

	constructor(  private renderer?: Renderer2,
		private elRef?: ElementRef,
		@Inject(DOCUMENT) private document?: Document) { }

	/**
	 * On Init
	 */
	ngOnInit(): void {
		this.renderer.appendChild(this.document.head, this.elRef.nativeElement);
		this.renderer.removeAttribute(this.elRef.nativeElement, 'appmovetohead');
	}

	/**
	 * On Destroy
	*/
	ngOnDestroy(): void {
		this.renderer.removeChild(this.document.head, this.elRef.nativeElement);
	}

}
