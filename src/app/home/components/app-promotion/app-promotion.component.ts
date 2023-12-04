import { Component, Input } from '@angular/core';
import { UIAppLinksInterface } from '../../models/banner-ui';


@Component({
	selector: 'app-promotion',
	templateUrl: './app-promotion.component.html',
	styleUrls: ['./app-promotion.component.scss']
})

export class AppPromotionComponent {
	@Input() appLinks: UIAppLinksInterface
}
