import { Pipe, PipeTransform} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safeUrl', pure: true })

export class SafeUrlPipe implements PipeTransform {

constructor(private sanitizer: DomSanitizer) { }

	/**
	 * Canonical URL
	 */
	transform(url) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

}
