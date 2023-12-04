
const ssrPolyfills = (() => {
	/**
	 * polyfills for SSR
	 */
	const btoa = (str) => {
		let buffer;

		if (str instanceof Buffer) {
			buffer = str;
		} else {
			buffer = Buffer.from(str.toString(), 'binary');
		}
		return buffer.toString('base64');
	}

	// Document dummy
	const document = {
		body: {
			getBoundingClientRect: () => {
				return {
					bottom: 1
				}
			}
		},
		addEventListener: () => {},
		removeEventListener: () => {},
		documentElement: {

		},
		createElement: () => {
			return {
				type: '',
				innerHTML: '',
				src: '',
				id: ''
			}
		},
		getElementsByClassName: () => {
			return {
				body: {
					classList: {

					}
				}
			}
		},
		getElementsByTagName: () => {
			return [
				{
					body: {
						classList: {

						}
					},
					appendChild: () => { }
				}
			]
		},
		getElementById: () => {
			return {
				getBoundingClientRect: () => {
					return {
						bottom: 1
					}
				}
			}
		}
	}

	return {
		btoa,
		document
	}

})()

module.exports = ssrPolyfills;
