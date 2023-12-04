const remoteDal = require('../src-web-mw/src/remote-dal');

/**
 * Redirect handler should be outside of Angular SSR to avoid invoke angular if
 * URL is not completed.
 */
const redirectHandler = (() => {

	/**
	 * Checks if path need store and delivery method to be present
	 */
	const _isPathRequiredStoreId = (path) => {
		const requiredPaths = [
			'products',
			'config',
			'product-combo',
			'store'
		];
		const pathArray = path.split('/');
		// console.log(pathArray)
		pathArray.shift()
		let isRequiredPath = path === '/';
		let basePath = '/';
		requiredPaths.forEach(pathSearch => {
			if (!isRequiredPath) {
				isRequiredPath = pathArray.indexOf(pathSearch) > -1
			}
		})
		// console.log('IS REQUIRED ====>>>>', isRequiredPath)

		if (isRequiredPath) {
			const storePath = pathArray.indexOf('store');
			// console.log(storePath)
			isRequiredPath = storePath < 0 || !pathArray[storePath + 1] || !pathArray[storePath + 2];

			if (isRequiredPath && storePath > -1) {
				const length = !pathArray[storePath + 1] ? 1 : 2;
				pathArray.splice(storePath, length);
			}

			basePath = isRequiredPath ? basePath + pathArray.filter(item => item.length > 0).join('/') : basePath;
			basePath = basePath === '/' ? '' : basePath;
		}
		// console.log('IS STILL REQUIRED ====>>>>', isRequiredPath)

		return {
			isRequiredPath,
			basePath
		}
	}

	/**
	 * Utility to get cookie value by key from raw request header
	 */
	const _getCookieFromRawString = (cookieRawString) => {
		const cookies = {};
		if (!cookieRawString) {
			return cookies;
		}
		cookieRawString.split(';').forEach(function (cookie) {
			const parts = cookie.match(/(.*?)=(.*)$/);
			cookies[parts[1].trim()] = (parts[2] || '').trim();
		});
		return cookies;
	}

	/**
	 * Random request ID
	 */
	const _uuidv4 = () => {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			// tslint:disable-next-line:no-bitwise
			const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	}

	/**
	 * Server - server request to default store outside of Angular context
	 */
	const _fetchDefaultStore = (deviceId, clientHeaders) => {
		const request = {
			method: 'GET',
			path: 'store/api/v1/default_store/',
			params: null,
		}
		clientHeaders['x-request-id'] = _uuidv4();
		return remoteDal.call(request, clientHeaders, deviceId);
	}

	/**
	 * Redirects is to store specific menu if required
	 * If store is required in URL:
	 * if in cookies: take from there, else make remote call to default store
	 */
	const getRedirectIfRequired = (ssrRequest) => {
		return new Promise((resolve) => {
			const method = ssrRequest.method;
			const path = ssrRequest.url;
			const cookiesStr = ssrRequest.headers.cookie;
			const parsedCookies = _getCookieFromRawString(cookiesStr);
			const cookiesStoreId = parsedCookies['selectedStore'];
			const cookiesIsDeliveryTab = parsedCookies['isDeliveryTabActive'];
			const cookieIsContactLess = parsedCookies['IsContactLess'];
			const pathRequired = _isPathRequiredStoreId(path);

			// Index page
			// store/:storeId/:deliveryType
			if (pathRequired.isRequiredPath) {
				if (cookiesStoreId && (cookiesIsDeliveryTab !== null || cookiesIsDeliveryTab !== 'undefined')) {
					// Redirect store and delivery method from cookie
					// console.log(pathRequired.basePath)
					const orderType = cookiesIsDeliveryTab === 'true' ? 'delivery' : 'pickup';
					const toPath = `${pathRequired.basePath}/store/${cookiesStoreId}/${orderType}`;
					resolve(toPath);
				} else {
					// Fetch default store for redirect
					const deviceId = ssrRequest['contextDeviceId'];
					const clientHeaders = ssrRequest.headers;

					// Pass client header so server has original city and region
					_fetchDefaultStore(deviceId, clientHeaders).then((result) => {
						if (!('store_id' in result)) {
							return false;
						}
						const remoteStoreId = result.store_id;
						const remoteOrderType = 'delivery';
						const toPath = `${pathRequired.basePath}/store/${remoteStoreId}/${remoteOrderType}`;

						resolve(toPath);
					})
				}
				resolve(false);
			}
			resolve(false);
		});
	}

	return {
		getRedirectIfRequired
	}
})();
module.exports = redirectHandler;
