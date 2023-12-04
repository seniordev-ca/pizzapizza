
export interface ServerBannerInterface {
		banners: ServerSingleBannerInterface[]
}
export interface ServerSingleBannerInterface {
	mobile_image: string,
	desktop_image: string,
	sequence: number,
	url: string,
	title: string,
	id: string
}
