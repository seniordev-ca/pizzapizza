export interface PersonalizedTemplateUI {
	id: number,
	header: string,
	isCustomAllowed: boolean,
	customLimit: number,
	customMessageLabel: string,
	messageOptions: MessageOptionInterface[]
}

export interface PersonalizedMessageUI {
	message_to: string,
	message: string,
	message_from: string,
	customMessage?: string
}

interface MessageOptionInterface {
	value: string,
	label: string
}

