
/**
 * Defines actions that can be made on the userActivities Component
 */
enum UserActivitiesActionsEnum {
	onSeeMenu,
	onAdd,
	// onCancel
}

/**
 * Defines the four different activities a user can make on their profile page
 */
enum UserActivities {
	orderHistory,
	paymentMethods,
	savedAddresses,
	savedPickUpLocations
}

/*
/** Interface that defines actions that can be made on user activities component
 */
interface UserActivitiesEmitterInterface {
	action: UserActivitiesActionsEnum,
	// activityId: number
	type: UserActivities,
	activityLength: number
}

/**
 * Defines the the data sturcture for user Activities within the accounts page
 */
interface UserActivitiesInterface {
	// removed activity ID dependign solely on enums
	title: string,
	mainIcon: string,
	actionText: string,
	alternateActionText: string,
	actionIcon: string,
	alternateActionIcon: string,
	actionIconBase: string,
	type: UserActivities,
	isCollapsed: boolean,
	isCancelButtonDisplayed: boolean
}



export {
	UserActivitiesInterface,
	UserActivities,
	UserActivitiesEmitterInterface,
	UserActivitiesActionsEnum
}
