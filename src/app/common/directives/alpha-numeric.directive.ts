import { Directive, HostListener, ElementRef, Input } from '@angular/core';
@Directive({
	selector: '[appSpecialIsAlphaNumeric]'
})

export class SpecialCharacterDirective {

	regexStr = '^[a-zA-Z0-9 .,]*$';
	@Input() isAlphaNumeric: boolean;

	constructor(private el: ElementRef) { }

	/**
	 * Keypress element listener
	 */
	@HostListener('keypress', ['$event']) onKeyPress(event) {
		return new RegExp(this.regexStr).test(event.key);
	}

	/**
	 * Paste element listener
	 */
	@HostListener('paste', ['$event']) blockPaste(event: ClipboardEvent) {
		this.validateFields(event);
	}

	/**
	 * Allow only letter and numbers
	 */
	validateFields(event: ClipboardEvent) {
		event.preventDefault();
		const pasteData = event.clipboardData.getData('text/plain').replace(/[^a-zA-Z0-9 ]/g, '');
		document.execCommand('insertHTML', false, pasteData);
	}
}
