import {
	Component,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation,
	ViewChild
} from '@angular/core';

import {
	SignUpFormActionsEnum,
	SignUpFormEmitterInterface,
	UserImageStateEnum,
	UserImageInterface
} from '../../sign-up/sign-up-form/sign-up-form.component'

/*
/** Sign Up Emitter
 */
interface ImageUploadEmitterInterface {
	action: SignUpFormActionsEnum
}


@Component({
	selector: 'app-user-image',
	templateUrl: './user-image.component.html',
	styleUrls: ['./user-image.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class UserImageComponent {
	userImageState: UserImageStateEnum;
	userImage: string;
	@Input() userImageDetails: UserImageInterface
	@Input() isDisplayOnly: boolean;
	@Input() userInitials: string;
	@Output() userImageEventEmitter: EventEmitter<ImageUploadEmitterInterface> =
	new EventEmitter<ImageUploadEmitterInterface>();
	@ViewChild('canvas', { static: true }) canvas;

	userImageStateEnum = UserImageStateEnum;
	userImageDataURL: string;

	validFileTypes = ['image/jpeg', 'image/gif', 'image/png'];
	validFileSize = 2000000;
	isImageInvalid: boolean;
	MAX_WIDTH = 150;
	MAX_HEIGHT = 150;
	constructor() {
	}

	/**
	 * Listen for Input Change
	 */
	changeListener($event): void {
		this.onInputChange($event.target);
	}

	/**
	 * TO DO: We will need to think of a way to validate image size and display an error if they try to upload an image that is too large
	 * Currently the api max is only 1.5kb which is way too small but I'd assume it will increase after dev
	 */
	/**
	 * Handle the Image Upload
	 */
	onInputChange(inputValue) {
		const file: File = inputValue.files[0];
		if (!this.isImageValid(file)) {
			this.userImageState = UserImageStateEnum.isUserImageNotExists;
			this.isImageInvalid = true;
			return false
		}
		const myReader: FileReader = new FileReader();
		const img = new Image();
		img.onload = (e) => {
			let ctx = this.canvas.nativeElement.getContext('2d');
			ctx.drawImage(img, 0, 0);
			let width = img.width;
			let height = img.height;

			if (width > height) {
				if (width > this.MAX_WIDTH) {
					height *= this.MAX_WIDTH / width;
					width = this.MAX_WIDTH;
				}
			} else {
				if (height > this.MAX_HEIGHT) {
					width *= this.MAX_HEIGHT / height;
					height = this.MAX_HEIGHT;
				}
			}
			this.canvas.nativeElement.width = width;
			this.canvas.nativeElement.height = height;
			ctx = this.canvas.nativeElement.getContext('2d');
			ctx.drawImage(img, 0, 0, width, height);

			this.userImageDataURL = this.canvas.nativeElement.toDataURL('image/jpg');
			this.onUserImageUpload(null, this.userImageDataURL);
		};

		myReader.onloadend = (e) => {
			img.src = myReader.result as string;
		};

		myReader.readAsDataURL(file);
	}

	/**
	* onUserImageAdd click
	*/
	onUserImageAdd(event) {
		event.preventDefault();
		this.isImageInvalid = false;
		this.userImageState = UserImageStateEnum.isStateUserImageUpload;
	}

	/**
	* onUserImageUpload click
	*/
	onUserImageUpload(event, img) {
		this.userImageState = UserImageStateEnum.isStateUserImageSave;
		if (this.userImageState === UserImageStateEnum.isStateUserImageSave) {
			const action = {
				action: SignUpFormActionsEnum.onUserImageSave,
				imageData: this.userImageDataURL
			} as SignUpFormEmitterInterface;

			this.userImageEventEmitter.emit(action);
		}
	}

	/**
	* onUserImageClose click
	*/
	onUserImageClose(event) {
		event.preventDefault();
		this.userImageState = this.userImageDetails.userImageData ?
		UserImageStateEnum.isUserImageExists : UserImageStateEnum.isUserImageNotExists;
	}

	/**
	* onUserImageUpload click
	*/
	// onUserImageSave(event) {
	// 	event.preventDefault();
	// 	const action = {
	// 		action: SignUpFormActionsEnum.onUserImageSave,
	// 		imageData: this.userImageDataURL
	// 	} as SignUpFormEmitterInterface;

	// 	this.userImageEventEmitter.emit(action);

	// 	this.userImageState = UserImageStateEnum.isUserImageExists
	// }

	/**
	* onUserImageUpload click
	*/
	onUserImageClear(event) {
		event.preventDefault();
		const action = {
			action: SignUpFormActionsEnum.onUserImageClear
		} as SignUpFormEmitterInterface;

		this.userImageEventEmitter.emit(action);

		this.userImageState = UserImageStateEnum.isUserImageNotExists;
	}


	/**
	 * Validate Image
	 */
	isImageValid(file: File) {
		const isValidType = this.validFileTypes.indexOf(file.type) > -1;
		// Commented out till we figure out a way to get size of image in a img tag
		// const isValidSize = file.size < this.validFileSize;
		return isValidType
	}
}
