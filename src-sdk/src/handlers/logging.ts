

export class PpLogging {

	/**
	 * Checks browser global object
	 */
	static isEnabled() {
		return typeof window === 'object' && 'pp-sdk-logging' in window;
	}
}
