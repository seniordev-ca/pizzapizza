import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import * as _ from 'lodash';

// tslint:disable:no-any
interface IWindow extends Window {
	webkitSpeechRecognition: any;
	SpeechRecognition: any;
}


@Injectable()
export class SpeechService {
	speechRecognition: any;
	constructor(private zone: NgZone) {}

	/**
	 * Record Speech
	 */
	record(): Observable<string> {

		return Observable.create(observer => {
			const { webkitSpeechRecognition }: IWindow = <IWindow>window;
			this.speechRecognition = new webkitSpeechRecognition();
			this.speechRecognition.continuous = true;
			// this.speechRecognition.interimResults = true;
			this.speechRecognition.lang = 'en-us';
			this.speechRecognition.maxAlternatives = 1;

			this.speechRecognition.onresult = speech => {
				let term = '';
				if (speech.results) {
					const result = speech.results[speech.resultIndex];
					const transcript = result[0].transcript;
					if (result.isFinal) {
						if (result[0].confidence < 0.3) {
							console.log('Unrecognized result - Please try again');
						} else {
							term = _.trim(transcript);

							if (term.indexOf('goodbye') !== -1) {
								this.speechRecognition.onend();
								this.DestroySpeechObject();
							}
						}
					}
				}
				this.zone.run(() => {
					observer.next(term);
				});
			};

			this.speechRecognition.onerror = error => {
				observer.error(error);
			};

			this.speechRecognition.onend = () => {
				observer.complete();
			};

			this.speechRecognition.start();
		});
	}

	/**
	 * Destroy Speech
	 */
	DestroySpeechObject() {
		if (this.speechRecognition) {
			this.speechRecognition.stop();
		}
	}

	/**
	 * Detect if speech is available
	 */
	isSpeechAvailable() {
		return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
	}
}

