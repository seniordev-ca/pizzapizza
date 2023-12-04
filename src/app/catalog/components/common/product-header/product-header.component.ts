import {
	Component,
	Input,
	TemplateRef,
	ContentChild,
	ViewContainerRef,
	ViewEncapsulation
} from '@angular/core';
import { SubHeaderNavigationInterface } from '../../../../common/components/shared/sub-header-navigation/sub-header-navigation.component'
@Component({
	selector: 'app-product-header',
	templateUrl: './product-header.component.html',
	styleUrls: ['./product-header.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ProductHeaderComponent {
	// Top navigation proxy
	headerContent: SubHeaderNavigationInterface = {
		textColor: '#FFFFFF',
		iconColor: '#EE5A00',
		backgroundImage: null,
		hasBackgroundImage: true
	}

	@Input() set topBavContent (content: SubHeaderNavigationInterface) {
		this.headerContent = content;
	}

	@Input() title: string;
	@Input() navText: string;

	@ContentChild(TemplateRef, /* TODO: add static flag */ { static: false }) childrenTemplate: TemplateRef<ViewContainerRef>;

	constructor() {}
}

