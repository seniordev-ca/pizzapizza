export interface RecommendationsServerInterface {
	for_products: string[],
	city: string,
	cart_products: string[],
	store_id: number,
	by_count: boolean
}
