import {
	Component,
	Input,
} from '@angular/core';


interface ModalSimpleHeaderInterface {
	title: string,
	subTitle: string
}

@Component({
	selector: 'app-modal-simple-header',
	templateUrl: './modal-simple-header.component.html',
	styleUrls: ['./modal-simple-header.component.scss'],
})

class ModalSimpleHeaderComponent {
	@Input() title: string;
	@Input() subTitle: string;
}

export {
	ModalSimpleHeaderComponent,
	ModalSimpleHeaderInterface
}
