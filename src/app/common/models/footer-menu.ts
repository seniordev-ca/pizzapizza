import { ServerMenuInterface, ServerMenuItemInterface } from './server-menu';

export interface UIFooterMenuInterface {
	label: string;
	id: string;
	url?: string;
	childItems: ServerMenuItemInterface[]
}
