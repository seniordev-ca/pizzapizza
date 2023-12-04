// NGRX
import {
	createEntityAdapter,
	EntityAdapter,
	EntityState
} from '@ngrx/entity';

// Actions
import { ConfiguratorActionsTypes } from '../actions/configurator'

// Server Models
import { ServerPersonalizedTemplateResponse } from '../models/server-product-config';
import { PersonalizedTemplateUI, PersonalizedMessageUI } from '../models/personalized-templates';
import { TemplateActionsTypes } from '../actions/personalized-templates';


// View Models

export interface State extends EntityState<ServerPersonalizedTemplateResponse> {
	isLoading: boolean,
	isFetched: boolean,
	isTemplateAvailable: boolean,
	activeTemplate: PersonalizedTemplateUI,
	activePersonalizedForm: PersonalizedMessageUI,
	isModalAlreadyShown: boolean
}

export const adapter: EntityAdapter<ServerPersonalizedTemplateResponse> = createEntityAdapter<ServerPersonalizedTemplateResponse>({
	selectId: (template: ServerPersonalizedTemplateResponse) => template.id,
	sortComparer: false
})

export const initialState: State = adapter.getInitialState({
	isLoading: true,
	isFetched: false,
	isTemplateAvailable: false,
	activeTemplate: null,
	activePersonalizedForm: {
		message_to: '',
		message_from: '',
		message: ''
	},
	isModalAlreadyShown: false
});

/**
 * Configurator reducer
 */
export function reducer(
	state = initialState,
	action
): State {
	switch (action.type) {

		case ConfiguratorActionsTypes.FetchSingleProductSuccess:
		case ConfiguratorActionsTypes.FetchTwinProductConfigSuccess:
		case ConfiguratorActionsTypes.FetchSingleConfigurableComboSuccess:
		case ConfiguratorActionsTypes.CopyComboProductIntoConfigurable: {
			const activeForm = {
				message_to: '',
				message_from: '',
				message: '',
				customMessage: ''
			}
			return {
				...state,
				isLoading: true,
				isFetched: false,
				isTemplateAvailable: false,
				activeTemplate: null,
				activePersonalizedForm: activeForm
			}
		}

		case ConfiguratorActionsTypes.SetPersonalMessageModalFlag: {
			const isShown = action.isPersonalMessageDefined;
			return {
				...state,
				isModalAlreadyShown: isShown
			}
		}

		case TemplateActionsTypes.FetchPersonalizedTemplateByIDSuccess: {
			const template = action.response as ServerPersonalizedTemplateResponse
			// used to make a deep copy without reference
			const currentCartProduct = JSON.parse(JSON.stringify(action.cartProduct));
			const currentCartRequest = JSON.parse(JSON.stringify(action.currentAddToCartRequest));

			const comboLineId = action.comboLineId;
			const messageOptions = template.messages.map(message => {
				return {
					value: message.message,
					label: message.message
				}
			});
			if ( template.custom_message.allow_custom_message ) {
				messageOptions.push({
					value: template.custom_message.label,
					label: template.custom_message.label
				})
			}
			messageOptions.unshift({
				value: '',
				label: 'Select Message'
			})
			const activeTemplate = {
				header: template.header_text,
				id: template.id,
				isCustomAllowed: template.custom_message.allow_custom_message,
				customLimit: template.custom_message.allow_custom_message ? template.custom_message.custom_message_limit : null,
				customMessageLabel: template.custom_message.allow_custom_message ? template.custom_message.label : null,
				messageOptions: messageOptions
			} as PersonalizedTemplateUI

			const newState = {
				activeTemplate,
				isLoading: false,
				isFetched: true,
			} as State

			if (currentCartProduct) {
				newState.activePersonalizedForm = comboLineId && currentCartProduct.child_items.find(item => item.line_id === comboLineId) ?
				currentCartProduct.child_items.find(item => item.line_id === comboLineId).personalized_message :
				currentCartProduct.personalized_message;
			}
			if (currentCartRequest && currentCartRequest.child_items && comboLineId) {
				newState.activePersonalizedForm = currentCartRequest.child_items.find(item => item.line_id === comboLineId) ?
				currentCartRequest.child_items.find(item => item.line_id === comboLineId).personalized_message :
				newState.activePersonalizedForm;
			}
			if (newState.activePersonalizedForm) {
				const isCustomMessageUsed = activeTemplate.messageOptions
				.filter(option => newState.activePersonalizedForm.message === option.value).length < 1;

				newState.activePersonalizedForm.customMessage = isCustomMessageUsed ? newState.activePersonalizedForm.message : '';

				newState.activePersonalizedForm.message = isCustomMessageUsed ?
				activeTemplate.customMessageLabel : newState.activePersonalizedForm.message
			}
			return adapter.upsertOne(template, {
				...state,
				...newState
			})
		}

		case TemplateActionsTypes.UpdateUserPersonalizedForm: {
			const activePersonalizedForm = action.personalizedMessage
			return {
				...state,
				activePersonalizedForm
			}
		}

		default: {
			return {
				...state
			}
		}
	}
}
