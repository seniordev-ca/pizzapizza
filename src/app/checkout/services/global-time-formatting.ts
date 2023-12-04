export class TimeFormattingService {

	/**
	 * Map front end 12hr time to server required 24hr time
	 */
	static convertTo24Hour(time) {

		const hours = parseInt(time.substr(0, 2), 10);
		if (time.indexOf('AM') !== -1 && hours === 12) {
			time = time.replace('12', '0');
		}
		if (time.indexOf('PM') !== -1 && hours < 12) {
			time = time.replace(hours, (hours + 12));
		}
		if (time.indexOf('h') > -1) {
			time = this.convertFrom24HourFR(time);
		}
		return time.replace(/(AM|PM)/, '').trim();
	}

	/**
	 * display time in 12hr format
	 */
	static convertTo12Hour(inputTime) {

		const splitTime = inputTime.split(':');
		const ampm = (splitTime[0] >= 12 ? ' PM' : ' AM'); // determine AM or PM
		splitTime[0] = splitTime[0] % 12;
		splitTime[0] = (splitTime[0] === 0 ? 12 : splitTime[0]); // adjust for 0 = 12

		return splitTime.join(':') + ampm;
	}

	/**
	 * display time in 24hr french locale format. eg 23:45 to 23h45
	 */
	static convertTo24HourFr(inputTime) {
		const splitTime = inputTime.split(':');
		return splitTime.join('h');
	}
	/**
	 * convert time from 24hr french locale format. eg 23h45 to 23:45
	 */
	static convertFrom24HourFR(inputTime) {
		const splitTime = inputTime.split('h');
		return splitTime.join(':');
	}
}
