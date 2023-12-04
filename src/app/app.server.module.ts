// Angular core
import { NgModule, Inject, Injector, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

// Lazy modules loader for SRR
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
// Express object to handle client cookies and server redirect
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';

// Store service. Used for getting default store for SSR.
import { StoreService } from './common/services/store.service';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

@NgModule({
	imports: [
		// The AppServerModule should import your AppModule followed
		// by the ServerModule from @angular/platform-server.
		AppModule,
		ServerModule,
		ServerTransferStateModule,
		ModuleMapLoaderModule // <-- *Important* to have lazy-loaded routes work
	],
	// Since the bootstrapped component is not inherited from your
	// imported AppModule, it needs to be repeated here.
	bootstrap: [AppComponent]
})
export class AppServerModule {

	/**
	 * Handle store ID redirect on server side for specific routes
	 */
	public constructor(
		@Inject(PLATFORM_ID) protected platformId: Object
	) {
	}
}
