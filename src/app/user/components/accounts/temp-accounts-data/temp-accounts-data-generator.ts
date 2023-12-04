
// Import Interfaces Here
import { AccountsActivitiesInterface } from '../activities/activities.component';


/**
 * Demo data generator
 */
class TempAccountsDataGenerator {

	constructor() {}
	/**
	 * Demo data for Accounts Activities
	 */
	public getAccountsActivitiesData(): Array<AccountsActivitiesInterface> {
		const accountsActivitiesData: Array<AccountsActivitiesInterface> = [
			{
				id: 0,
				mainicon: {
							'icon': 'icon-cart',
							'color': '#EE5A00'
							},
				title: 'Order History',
				// actionicon: 'icon-arrow-circle',
				// action: 'See Menu'
				action: {
							'icon': 'icon-arrow-circle',
							'color': '#EE5A00',
							'text': 'See Menu'
						},
			}
			// ,
			// {
			// 	id: 1,
			// 	mainicon: 'icon-credit-card',
			// 	title: 'Payment Method',
			// 	actionicon: 'icon-plus-2',
			// 	action: 'See Menu'
			// },
			// {
			// 	id: 2,
			// 	mainicon: 'icon-pizza-locator',
			// 	title: 'Saved Addresses',
			// 	actionicon: 'icon-plus-2',
			// 	action: 'See Menu'
			// },
			// {
			// 	id: 3,
			// 	mainicon: 'icon-pp-speech-bubble',
			// 	title: 'Saved Pickup Locations',
			// 	actionicon: 'icon-plus-2',
			// 	action: 'See Menu'
			// }
		];

		return accountsActivitiesData;
	}

}

export {
	TempAccountsDataGenerator
}

