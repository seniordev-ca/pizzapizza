import { DevState } from '../reducers';

/**
 * Dev local storage
 */
export class DevLocalStorage {

	/**
	 * Save dev settings obj into local storage
	 */
	static saveDevSetting(state: DevState) {
		if (typeof localStorage === 'object') {
			localStorage.setItem('devOptions', JSON.stringify(state));
		}
	}

	/**
	 * Read dev setting obj from local storage
	 */
	static getDevSetting(): DevState {
		let devOptionsStr = null;
		if (typeof localStorage === 'object') {
			devOptionsStr = localStorage.getItem('devOptions');
		}
		const devOptionsObj = JSON.parse(devOptionsStr);
		return devOptionsObj as DevState;
	}

}

