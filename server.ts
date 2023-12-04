/**
 * Wep aplication server with angular SSR
 */
/* tslint:disable:no-any */
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

// Angular lib
import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
// Web application server
import * as express from 'express';
// Web application server helpers
const redirectHandler = require('./src-server/redirect-handler');
const polyfills = require('./src-server/polyfills');
const webSession = require('./src-web-mw/src/web-session');

// Utility
import { join } from 'path';
// Server build bundles
const enAppServer = require('./dist/build-server/en/main');
const frAppServer = require('./dist/build-server/fr/main');

const PORT = process.env.PORT || 8080;
const DIST_FOLDER = join(process.cwd(), '');

enableProdMode();

const enAppEngine = ngExpressEngine({
	bootstrap: enAppServer.AppServerModuleNgFactory,
	providers: [
		provideModuleMap(enAppServer.LAZY_MODULE_MAP)
	]
})

const frAppEngine = ngExpressEngine({
	bootstrap: frAppServer.AppServerModuleNgFactory,
	providers: [
		provideModuleMap(frAppServer.LAZY_MODULE_MAP)
	]
})

// Inject SDK for SSR
global['ppSdk'] = require('./dist/build-sdk/pp-sdk-bundle');

// Web application server
const app = express();

app.engine('html', (filePath, options: any, callback) => {
	options.engine(
		filePath,
		{ req: options.req, res: options.res },
		callback
	);
});

/**
 * Static files are delivered via google web server so no need to use web application server for it.
 * Defined in dist/app-ssr.yaml
 * For local version there are no way to run node js on google dev server.
 */
if (process.env.IS_LOCAL) {
	// Proxy calls to web middleware when running locally
	const proxy = require('express-http-proxy');
	app.use('/ajax', proxy('localhost:3000'));

	// Max age in milliseconds
	app.use('/build', express.static(join(DIST_FOLDER, '/build-browser/en'), {
		maxAge: 60
	}));

	app.use('/static-files', express.static(join(DIST_FOLDER, '/static-files'), {
		maxAge: 60
	}));

	app.use('/fr/build', express.static(join(DIST_FOLDER, '/build-browser/fr'), {
		maxAge: 60
	}));

	app.use('/fr/static-files', express.static(join(DIST_FOLDER, '/static-files'), {
		maxAge: 60
	}));
}

app.get('*', async (req, res) => {
	const isFrLang = req.url.startsWith('/fr');

	let buildLangPath = null;
	let renderEngine = null;

	// Check if request has session token and issue new in cookies if not
	const deviceId = webSession.getOrCreateSessionDeviceId(req, res);
	req['contextDeviceId'] = deviceId;
	const redirectPath = await redirectHandler.getRedirectIfRequired(req);

	if (redirectPath) {
		res.redirect(302, redirectPath);
		res.end();
		return false;
	}

	// Take template folder path and express engine
	if (isFrLang) {
		buildLangPath = 'fr';
		renderEngine = frAppEngine;
	} else {
		buildLangPath = 'en';
		renderEngine = enAppEngine;
	}
	if (!res.headersSent && !res.finished) {
		res.render(join(DIST_FOLDER, 'build-browser', buildLangPath, 'index.html'),
			{ req, res, engine: renderEngine },
			(error: Error, html: string) => {
				if (error) {
					console.error(`type:monitoring operation_name:web_ssr_failure success:False reason:${error}`);
					console.error(error);
					res.status(500).send(error);
				} else {
					res.send(html);
				}
			}
		)
	}
})

// Start Express Server
app.listen(PORT, () => {
	console.log(`Node Express server listening on http://localhost:${PORT}`);
});

global['btoa'] = polyfills.btoa;
global['document'] = polyfills.document;
global['window'] = {};
