import { Component, OnInit } from '@angular/core';

import { SubHeaderNavigationInterface } from '../../../common/components/shared/sub-header-navigation/sub-header-navigation.component';

/**
 * Possible states for cart button
*/
enum CartStated {
	active,
	notActive,
	selected,
	disabled
}

interface ClubElevenCart {
	cartId: number,
	title: string,
	cartNumber: string,
	balance: number,
	state: CartStated
}

interface ClubElevenTransfer {
	selectedCart?: ClubElevenCart,
	cartsArr: Array<ClubElevenCart>
}

@Component({
	selector: 'app-club-eleven-transfer',
	templateUrl: './club-eleven-transfer.component.html',
	styleUrls: ['./club-eleven-transfer.component.scss']
})

class ClubElevenTransferComponent implements OnInit {
	subHeaderNavContent: SubHeaderNavigationInterface;
	clubElevenTransferContent: ClubElevenTransfer;
	cartStated = CartStated;
	isContinueBtnDisabled: boolean;
	isCartSelectionView: boolean;

	constructor() {
		this.isCartSelectionView = true;

		this.subHeaderNavContent = {
			textColor: '#4c3017',
			iconColor: '#EE5A00',
			backToLocation: '/'
		};

		this.isContinueBtnDisabled = false;

		this.clubElevenTransferContent = {} as ClubElevenTransfer;

		this.clubElevenTransferContent.selectedCart = {
			cartId: 4,
			title: 'GIFT CARD',
			cartNumber: '4519 **** 0987',
			balance: 36.47,
			state: CartStated.disabled
		}

		this.clubElevenTransferContent.cartsArr = [{
			cartId: 1,
			title: 'GIFT CARD',
			cartNumber: '4519 **** 0987',
			balance: 6.47,
			state: CartStated.selected
		}, {
			cartId: 2,
			title: 'GIFT CARD',
			cartNumber: '4519 **** 0987',
			balance: 10,
			state: CartStated.active
		}, {
			cartId: 3,
			title: 'GIFT CARD',
			cartNumber: '4519 **** 0987',
			balance: 20,
			state: CartStated.active
		}];
	}

	/**
	 * Handler for cart button click
	 */
	onCartButtonClick(cardId) {
		this.isContinueBtnDisabled = true;
		this.clubElevenTransferContent.cartsArr.forEach(cart => {
			if (cart.cartId === cardId) {
				cart.state = cart.state === CartStated.active ? CartStated.selected : CartStated.active;
			}
			if (cart.state === CartStated.selected) {
				this.isContinueBtnDisabled = false;
			}
		})
	}

	/**
	 * Handler for continue button click
	*/
	onContinueBtnClick() {
		this.isCartSelectionView = false;
	}

	/**
	 * Component constructor
	 */
	ngOnInit() {

	};
}

export {
	ClubElevenTransferComponent
}
