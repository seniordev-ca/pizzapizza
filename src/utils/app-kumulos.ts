import {
	Injectable,
} from '@angular/core';

import { Observable, Observer } from 'rxjs';

// Environment config
import { environment } from '../environments/environment';

@Injectable()
export class AppKumulosService {

	/**
	 * Load script.
	 * Supports client and server implementation
	 */
	static loadScript(isBrowser, configKeys): Observable<boolean> {
		const activeKeys = configKeys ? configKeys : environment;
		const apiKey = activeKeys.kumulosApiKey;
		const secretKey = activeKeys.kumulosSecretKey;
		const vapidPublicKey = activeKeys.kumulosVapidPublicKey;
		const windowKey = 'kumulosSDK';
		return new Observable<boolean>((observer: Observer<boolean>) => {
			const createScriptDOM = () => {
				// Create kumulos script DOM with URL and emits status on script load
				if (!window[windowKey]) {
					window[windowKey] = {};
					const script = document.createElement('script');
					script.type = 'text/javascript';
					script.id = windowKey;
					script.textContent = `(function(w,p){w[p]=w[p]||function(){w[p].q=w[p].q||[];w[p].q.push(arguments)}})(window,"Kumulos");
					Kumulos("init", {
						apiKey: "${apiKey}",
						secretKey: "${secretKey}",
						vapidPublicKey: "${vapidPublicKey}"
					});`;
					document.head.appendChild(script);

					const mainScript = document.createElement('script');
					mainScript.type = 'text/javascript';
					mainScript.src = 'https://static.app.delivery/sdks/web/main.js';
					mainScript.async = true;
					document.head.appendChild(mainScript);

					mainScript.onload = () => {
						console.log('kumulos sdk loaded');
						observer.next(true);
						observer.complete();
					};

					mainScript.onerror = () => {
						observer.next(false);
						observer.complete();
					};
				}
			}

			const loadServerSDK = () => {
				observer.next(true);
				observer.complete();
			}

			// Check runtime environment
			if (isBrowser) {
				createScriptDOM();
			} else {
				loadServerSDK();
			}
		});
	}

	/**
	 * Get User ID
	 */
	static getInstallId(): Observable<string>  {
		return new Observable<string>((observer: Observer<string>) => {
			const getKumulosId = () => {
				window['Kumulos'](function (client) {
					client.getInstallId().then(function (installId) {
						// Use the install ID for something
						console.log(installId)
						observer.next(installId);
						observer.complete();
					});
				});
			}
			getKumulosId();
		});
	}

}
