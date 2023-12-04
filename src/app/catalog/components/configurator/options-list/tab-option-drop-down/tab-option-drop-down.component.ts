// Angular core
import {
	Component,
	Input,
	Output,
	EventEmitter
} from '@angular/core';

import {
	OptionsDropDown
} from '../options-list.component';

/**
 * Tab options dropDown component
 */
@Component({
	selector: 'app-tab-options-drop-down',
	templateUrl: './tab-option-drop-down.component.html',
	styleUrls: ['./tab-option-drop-down.component.scss']
})

/**
 * Tab options dropDown class
 */
class TabOptionDropDownComponent {
	@Input() optionDropDownData: OptionsDropDown;
	@Output() optionDropDownEventEmitter: EventEmitter<string> = new EventEmitter();

	isListOpen = false;
	/**
	 * Handler for on list click
	 */
	onOpenTabOptionListClick() {
		this.isListOpen = !this.isListOpen;
	}

	/**
	 * Handler for option click
	 */
	onOptionClick(optionId) {
		this.isListOpen = false;
		this.optionDropDownEventEmitter.emit(optionId);
	}
}

export {
	TabOptionDropDownComponent
}
