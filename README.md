# PizzaPizza
This is front end for Pizza Pizza v2

## Getting Started
	brew install redis
	redis-server /usr/local/etc/redis.conf
	npm i
	npm run start

### Used technologies 
	Angular 7 with ngrx 7
	TypeScript
	Bootstrap 4
	SASS
	Redis
	GAE

### Prerequisites
	NodeJs ^v10.6.0 with npm
	Download and install the **original** App Engine SDK for Python.  
	Visual Studio Code with following plugins:
		Code spell checker
		Debugger for Chrome
		ESLint
		HTMLHint
		IntelliSense for css 
		Sass lint
		TabSpacer
		TSList

### Installing
	Clone the repository
	Install dependencies 
		npm run i
	Copy assets to distribution folder
		npm run build:prod
	Start web pack dev server with hot module replacement support
		npm run start
	Run local middleware
		npm run middleware

### Code conversion
	* Use ONLY tabs in all source files
	* For every component which has multiple states use Enums. Don't hardcode any value
	* Application consist of components and containers. All components needs to be stateless.
	* All css need to be isolated withing the component

### Linting
Before committing the code make sure that all linting issue are fixed in *.ts, *.scss *.html .
Continuous integration server will check every commit and notify bitbucket status.

	[Plastic web jenkins]
	(http://192.168.45.5:8080/jenkins/)
	npm run lint
	

### Build
For production you need to build ahead of time compilation build.
	npm run build:prod


### Deployment
Project is deployed via Bitbucket Pipelines using TAGS. Use the following tag structure to deploy to the correct environment `release-ENV-YYYYMMDDTIME (TIME in 24hr format)`:
	* release-dev-201905011345
	* release-qa-201905011345
	* release-uat-201905011345

Tags should ONLY be created/pushed from the Development branch
Examples of git commands to create/push tags `git tag release-dev-201905091200` then `git push origin --tags`


## Acknowledgments
Feel free to add any interesting Angular knowledge :)
	[Angular 2 — A quick intro about template syntax](https://medium.com/front-end-hacking/angular-2-a-quick-intro-about-template-syntax-121f9b160a64)
	[How to bind a property to Style Width Pixel in Angular 2](https://stackoverflow.com/questions/40930330/how-to-bind-a-property-to-style-width-pixel-in-angular-2)
	[Enums](https://basarat.gitbooks.io/typescript/docs/enums.html)
	[Swiper API](http://idangero.us/swiper/api/)
	[The Power of Structural Directives in Angular](https://netbasal.com/the-power-of-structural-directives-in-angular-bfe4d8c44fb1)
	[Angular 4 ng-template & ng-container with parameters](https://gist.github.com/guillaumegarcia13/a00379681d95b0176e10fd3f794bd8bb#file-sample-html-L9)
	[NgRx: Patterns and Techniques](https://blog.nrwl.io/ngrx-patterns-and-techniques-f46126e2b1e5)
	[Angular 2 Application with Redux and ngrx](http://onehungrymind.com/build-better-angular-2-application-redux-ngrx/)


## Authors
**Adam Graham** - * Data integration, combo configuration, order confirmation, club 11, UI improvements, location finder, code refactoring* 
**Artur Lymarenko** - * Data integration, building scripts, project architecture, web middleware, configurator page, club 11, pizza assistance, code refactoring, order history * 
**Himat Jutla** - * Product list, global modals, user account, checkout * 
**Abubakr Eirabie** - * Home page, header, footer, mobile nav, cart overlay, checkout * 
**Yaro Martynchuk** - * Sing in, sign up * 
