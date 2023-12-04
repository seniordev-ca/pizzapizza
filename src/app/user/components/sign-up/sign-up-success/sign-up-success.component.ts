import {
	Component,
	Input,
	Output,
	EventEmitter
} from '@angular/core';

/**
 * Sign Up Success Actions
 */
enum SignUpSuccessActionsEnum {
	onContinueClick
}

/*
/** Sign Up Success Emitter
 */
interface SignUpSuccessEmitterInterface {
	action: SignUpSuccessActionsEnum
}

/*
/** Sign Up Success Interface
*/
interface SignUpSuccessInterface {
	message: string;
}


@Component({
	selector: 'app-sign-up-success-component',
	templateUrl: './sign-up-success.component.html',
	styleUrls: ['./sign-up-success.component.scss']
})

class SignUpSuccessComponent {
	@Input() signUpSuccessData: SignUpSuccessInterface;
	@Output() signUpSuccessDetailsEventEmitter: EventEmitter<SignUpSuccessEmitterInterface> =
		new EventEmitter<SignUpSuccessEmitterInterface>();

	constructor() {
		const message = this.signUpSuccessData || {} as SignUpSuccessInterface;
	}

	/**
	* onContinueClick click
	*/
	onContinueClick(event) {
		event.preventDefault();
		const action = {
			action: SignUpSuccessActionsEnum.onContinueClick,
		} as SignUpSuccessEmitterInterface;

		this.signUpSuccessDetailsEventEmitter.emit(action);
	}
}

export {
	SignUpSuccessComponent,
	SignUpSuccessInterface,
	SignUpSuccessActionsEnum,
	SignUpSuccessEmitterInterface
}
