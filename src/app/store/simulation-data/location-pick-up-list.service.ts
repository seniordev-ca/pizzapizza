import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StaticLocationData } from './locations-data';

@Injectable()
export class LocationPickUpListService {
	constructor() { }

/**
* This method will get the json data from simulation/data - product.data.ts
*/
	retrieveList() {
		return new StaticLocationData().stores;
	}
}

