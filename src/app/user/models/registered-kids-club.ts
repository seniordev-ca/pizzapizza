/**
 * Defines actions that can be made on the Kids Club Component
 */
enum RegisteredKidsClubActionsEnum {
	onEditChild,
	onAddChild,
	onDeleteChild
}

interface RegisteredKidsClubInterface {
	gender: string,
	firstName: string,
	lastName: string,
	dateOfBirth: string,
	dobDisplayString: string,
	id: number
}

/*
/** Interface that defines actions that can be made onKids CLub while passing id and emitting event
 */
interface RegisteredKidsClubEmitterInterface {
	action: RegisteredKidsClubActionsEnum,
	kidsClubUser: RegisteredKidsClubInterface
}

export {
	RegisteredKidsClubActionsEnum,
	RegisteredKidsClubEmitterInterface,
	RegisteredKidsClubInterface
}
