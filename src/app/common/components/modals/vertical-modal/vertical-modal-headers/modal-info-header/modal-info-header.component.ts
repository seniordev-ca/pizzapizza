import {
	Component,
	Input,
	ContentChild,
	TemplateRef,
	ViewContainerRef,
} from '@angular/core';


interface ModalInfoHeaderInterface {
	fontKey: string,
	title: string,
	subTitle: string
}

@Component({
	selector: 'app-modal-info-header',
	templateUrl: './modal-info-header.component.html',
	styleUrls: ['./modal-info-header.component.scss'],
})

class ModalInfoHeaderComponent {
	@Input() modalInfoHeaderContent: ModalInfoHeaderInterface;
	@Input() title: string;
	@Input() subTitle: string;
	@ContentChild(TemplateRef, /* TODO: add static flag */ { static: false }) childrenTemplate: TemplateRef<ViewContainerRef>;

}

export {
	ModalInfoHeaderComponent,
	ModalInfoHeaderInterface
}
