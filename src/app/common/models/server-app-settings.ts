
export interface AppSettingsInterface {
	base_urls: Array<{
		label: string,
		url: string
	}>,
	cache_timestamps: {
		categories: string,
		error_messages: string,
		products: string,
		terms_and_conditions: string,
	},
	mock_headers: Array<{
		header_val: string,
		label: string
	}>,
	web_links: {
		icons_font: string,
		image_urls: AppSettingsImageURLInterface,
		sdk: string,
		wordpress: string,
		social: AppSocialLinkInterface,
		club_11_11: string
	},
	same_topping_max_qty: number,
	global_contactless_delivery: boolean,
	global_contactless_pickup: boolean,
	global_visa_clicktopay: boolean,
	static_text: {
		calorie_config_disclaimer: string,
		calorie_global_disclaimer: string
	},
	app_upgrade: {
		google_play_url: string,
		i_tunes_url: string
	},
	globalpushactive: boolean;
	kumulos_api_key?: string;
	kumulos_secret_key?: string;
	kumulos_vapid_public_key?: string;
	ZendDeskEnable: boolean;

}

export interface AppSettingsImageURLInterface {
	combo: string,
	category: string,
	featured: string,
	product: string,
	just_for_you: string,
	toppings: string,
	toppings_overlay: string,
	stores: string,
	base_pizza: string,
	profile_images: string,
	order: string
}

export interface AppSocialLinkInterface {
	facebook: string,
	twitter: string,
	instagram: string
}
