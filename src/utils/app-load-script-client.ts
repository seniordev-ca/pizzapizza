import { Injectable } from '@angular/core';
import { Observable, Observer } from '../../node_modules/rxjs';
import { environment } from 'environments/environment';

export interface ScriptModel {
	name: string,
	src: string,
	loaded?: boolean
}
@Injectable()
export class JSLoaderService {

	private scripts: ScriptModel[] = [];

	/**
	 * Load scripts - might want to consider moving this to somewhere separate as it can be used for any third party script
	 */
	public load(script: ScriptModel, isDelete: boolean): Observable<ScriptModel> {
		return new Observable<ScriptModel>((observer: Observer<ScriptModel>) => {
			const existingScript = this.scripts.find(s => s.name === script.name);

			// Complete if already loaded
			if (existingScript && existingScript.loaded && !isDelete) {
				observer.next(existingScript);
				observer.complete();
			} else if (existingScript && existingScript.loaded && isDelete) {
				const element = document.getElementById(existingScript.name);
				element.parentNode.removeChild(element);
				this.scripts = this.scripts.filter(scriptName => scriptName !== existingScript);
			} else {
				// Add the script
				this.scripts = [...this.scripts, script];

				// Load the script

				const scriptElement = document.createElement('script');
				scriptElement.type = 'text/javascript';
				scriptElement.src = script.src;
				scriptElement.id = script.name;

				scriptElement.onload = () => {
					script.loaded = true;
					observer.next(script);
					observer.complete();
				};

				scriptElement.onerror = (error) => {
					observer.error('Couldn\'t load script ' + script.src);
				};

				document.getElementsByTagName('body')[0].appendChild(scriptElement);
			}
		});
	}

	/**
	 * tag manager initial function
	 */
	public loadTagManagerScript(script: ScriptModel) {
		const initialScript = document.createElement('script');
		initialScript.type = 'text/javascript';
		initialScript.innerHTML = script.src
		document.getElementsByTagName('head')[0].appendChild(initialScript);
		return false
	}
	/**
	 * tag manager body iframe -- This doesn't make sense to add via JS since it's use is for noscript situations
	 */
	public loadTagManagerBodyScript(script: ScriptModel) {
		// const noScriptTag = document.createElement('noscript');
		// const iframeTag = document.createElement('iframe');
		// iframeTag.src = script.src;
		// iframeTag.height = '0';
		// iframeTag.width = '0';
		// iframeTag.style.display = 'none';
		// iframeTag.style.visibility = 'hidden';
		// noScriptTag.appendChild(iframeTag);
		// const firstChild = document.getElementsByTagName('body')[0].firstChild;
		// document.getElementsByTagName('body')[0].insertBefore(noScriptTag, firstChild);
	}

}
