import {
	Component,
	ViewChild,
	Input,
	Output,
	EventEmitter,
	ViewEncapsulation
} from '@angular/core';

import {
	SwiperDirective,
	SwiperConfigInterface
} from 'ngx-swiper-wrapper';
import * as fromUser from '../../../user/reducers';
import {
	RecommendationInterface,
	RecommendationTemplateEnum
} from '../../models/recommendations';
import { Store } from '@ngrx/store';
import { CommonObjectUpdateData } from '../../../common/actions/tag-manager';
import { UserSummaryInterface } from 'app/user/models/user-personal-details';
/**
 * Just for you action enum
 */
enum JustForYouActionEnum {
	REPEATORDER
}
interface JustForYouEmitterInterface {
	action: JustForYouActionEnum,
	id: string
}
class RecommendationGhostGenerator {
	static ghostBoxesCount = 3;

	/**
	 * Ghost data generator
	 */
	static getRecommendations() {
		const recommendations: RecommendationInterface[] = [];

		for (let i = 0; i <= 3; i++) {
			recommendations.push({
				id: null,
				image: null,
				title: null,
				template: RecommendationTemplateEnum.Default
			} as RecommendationInterface)
		}

		return recommendations;
	}
}

@Component({
	selector: 'app-user-recommendations',
	templateUrl: './recommendations.component.html',
	styleUrls: ['./recommendations.component.scss'],
	encapsulation: ViewEncapsulation.None
})
class RecommendationsComponent {
	@Input()
	set slides(slides: Array<RecommendationInterface>) {
		this.slideData = slides;
		this.directiveRef.update();
	}
	/**
	 * This handler needs always go after content input to make ghost working
	 */
	@Input()
	set loading(loading: boolean) {
		this.isLoading = loading;
		if (loading) {
			this.slideData = RecommendationGhostGenerator.getRecommendations();
		}
		this.directiveRef.update();
	}
	@Input()
	set error(error: boolean) {
		this.isError = error;
		this.directiveRef.update();
	}
	@Input() loginUser: UserSummaryInterface;
	@Output() retryEventEmitter: EventEmitter<boolean> = new EventEmitter();
	@Output() justforYouEventEmitter: EventEmitter<JustForYouEmitterInterface> = new EventEmitter()

	RecommendationTemplateEnum = RecommendationTemplateEnum;
	isLoading: boolean;
	isError: boolean;
	slideData: Array<RecommendationInterface>;

	@ViewChild(SwiperDirective, { static: true }) directiveRef: SwiperDirective;
	config: SwiperConfigInterface = {
		slidesPerView: 'auto',
		slideNextClass: '.swiper-button-next',
		slidePrevClass: '.swiper-button-prev',
		spaceBetween: 10,
		navigation: {
			nextEl: '.swiper-button-next',
			prevEl: '.swiper-button-prev',
		},
		shortSwipes: false
	};
	constructor(private userStore: Store<fromUser.UserState>) { }
	/**
	 * Data fetch retry button handler
	 */
	onRetryClick() {
		this.retryEventEmitter.emit();
	}

	/**
	 * Click Repeat Last Order
	 */
	onRepeatLastOrder(id) {
		this.justforYouEventEmitter.emit({
			action: JustForYouActionEnum.REPEATORDER,
			id
		})
	}
	/**
	 * Handle tag manager analytics
	 */
	handleTagAnalytics(slide) {
		this.userStore.dispatch(new CommonObjectUpdateData(slide));
	}
	/**
	 * Determine Router link of slide
	 */
	determineLink(slide) {
		const link = slide.template === RecommendationTemplateEnum.MyPizzas ? 'my-pizzas' : 'just-for-you/' + slide.seoTitle
		return '/catalog/' + link
	}

	/**
	 * Determine Coupon Wallet Link
	 */
	determineCouponWalletLink() {
		const link = this.loginUser && this.loginUser.isClubElevenElevenMember ? '/loyalty' : '';
		const walletLink = '/user/club-eleven-eleven' + link;
		const signInLink = '/user/sign-in';
		return this.loginUser ? walletLink : signInLink;
	}
}

export {
	RecommendationsComponent,
	JustForYouActionEnum,
	JustForYouEmitterInterface
}
