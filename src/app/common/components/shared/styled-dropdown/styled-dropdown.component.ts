import { Component, Input, ElementRef, HostListener, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

export interface DropdDownOptionInterface {
	label: string,
	value?: string,
	selected?: boolean
}

@Component({
	selector: 'app-dropdown',
	templateUrl: './styled-dropdown.component.html',
	styleUrls: ['./styled-dropdown.component.scss']
})
export class StyledDropdownComponent implements OnChanges {
	@Input() inputControl?: FormControl;
	@Input() selectedValue: string;
	@Input() options: DropdDownOptionInterface[];

	optionsArray: DropdDownOptionInterface[];
	currentSelected: DropdDownOptionInterface;
	menuOpen: boolean;

	constructor(
		private elRef: ElementRef) {
	}

	/**
	 * On Changes
	 */
	ngOnChanges(changes) {
		this.optionsArray = this.setDefaultOptions(this.options);
	}

	/**
	 * Close Menu if user clicks outside this component
	 */
	@HostListener('document:click', ['$event'])
	clickout(event) {
		if (!this.elRef.nativeElement.contains(event.target)) {
			this.menuOpen = false;
		}
	}

	/**
	 * If we are not provided with values for each option or a currently selected option: we set the values and the first option as selected
	 */
	setDefaultOptions(options): DropdDownOptionInterface[] {
		let selected = this.selectedValue ? options.find(option => option.value === this.selectedValue || option === this.selectedValue) : null;
		if (!selected) {
			selected = options[0];
			this.inputControl.patchValue(selected.value);
		}

		options = options.map(option => {
			return {
				label: option.label ? option.label : option,
				value: option.value !== undefined ? option.value : option,
				selected: selected === option ? true : false
			} as DropdDownOptionInterface
		});
		this.currentSelected = options.find(option => option.selected);
		return options;
	}

	/**
	 * On click change the form control value
	 */
	updateFormControlValue(selected: DropdDownOptionInterface) {
		this.optionsArray = this.optionsArray.map(option => {
			return {
				label: option.label,
				value: option.value,
				selected: option === selected
			}
		});
		this.inputControl.patchValue(selected.value);
		this.inputControl.markAsTouched()
		this.currentSelected = this.optionsArray.find(option => option.selected);
		this.menuOpen = !this.menuOpen;
	}
	/**
	 * Toggle the Menu
	 */
	openMenu(event) {
		event.preventDefault();
		this.menuOpen = !this.menuOpen;
		if (this.menuOpen) {
			const list = this.elRef.nativeElement.querySelector('ul');
			const selectedLi = list.querySelector('li.selected');
			// Scroll the list to the selected itemn
			list.scrollTo(0, selectedLi.offsetTop, 500);
		}
	}
}
