import { Routes } from '@angular/router';

import { HomeContainerComponent } from './containers/home/home-container.component';


export const routes: Routes = [
	{
		path: '',
		component: HomeContainerComponent
	}
	// ^^^ The above modal-test route is temporary, only here to see modal design
];
