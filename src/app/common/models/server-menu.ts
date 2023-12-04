export interface ServerMenuInterface {
	'main-menu': {
		items: ServerMenuItemInterface[]
	},
	'legal-menu': {
		items: ServerMenuItemInterface[]
	}
}
export interface ServerMenuItemInterface {
	id: string,
	parent_id: string,
	url: string,
	title: string
}
