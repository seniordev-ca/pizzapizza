import { Product } from './product';
import { addToCartBtnEnum } from './configurator';

export interface ComboConfigDetails {
	id: string,
	image?: string,
	comboInfo?: string,
	name: string,
	description?: string,
	quantity: number,
	price: number,
	seoTitle: string,
	isSelected?: boolean,
	calories?: string,
	isValid?: boolean;
	validationMsg?: string,
	btnState?: addToCartBtnEnum,
	itemConfigText?: string,
	nonConfigCount?: number
}

export interface ComboConfigGroup {
	groupImage?: string,
	groupTitle: string,
	products?: Product[],
	isGroupFlat?: boolean,
	groupId?: string,
	validationMsg?: string,
	isResetAllowed?: boolean,
	isAllowMultiple?: boolean
}

