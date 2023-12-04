
export class StaticLocationData {
	/**
	 * This data is based on schema located in master file. Note, schema in master file
	 * does not contain store hours. This should be added. For now, I've included an hours
	 * prop that contains an object which holds weekend hours and week hours as per design.
	 * Furthermore, design calls for intersection to be listed, for now, I've added it as a
	 * prop in each store object within the array, however, this may end up coming from Google API
	 */
	stores = [
		{
			'storeid': '1233',
			'address': { 'unitnumber': '11', 'streetnumber': '346', 'streetname': 'Yonge St' },
			'city': 'Toronto',
			'province': 'ON',
			'postalcode': 'M5B 1R8',
			'marketphonenumber': '(416)-967-1111',
			'distance': '0.7 km',
			'imagename': '',
			'intersection' : 'Yonge St & Elm St',
			'hours' : { 'weekend' : '11:00 AM - 3:00 AM', 'weekday' : '11:00 AM - 2:00 AM' }
		},
		{
			'storeid': '1234',
			'address': { 'unitnumber': '11', 'streetnumber': '346', 'streetname': 'Yonge St' },
			'city': 'Toronto',
			'province': 'ON',
			'postalcode': 'M5B 1R8',
			'marketphonenumber': '(416)-967-1111',
			'distance': '0.7 km',
			'imagename': '',
			'intersection' : 'Yonge St & Elm St',
			'hours' : { 'weekend' : '11:00 AM - 3:00 AM', 'weekday' : '11:00 AM - 2:00 AM' }
		},
		{
			'storeid': '1235',
			'address': { 'unitnumber': '11', 'streetnumber': '346', 'streetname': 'Yonge St' },
			'city': 'Toronto',
			'province': 'ON',
			'postalcode': 'M5B 1R8',
			'marketphonenumber': '(416)-967-1111',
			'distance': '0.7 km',
			'imagename': '',
			'intersection' : 'Yonge St & Elm St',
			'hours' : { 'weekend' : '11:00 AM - 3:00 AM', 'weekday' : '11:00 AM - 2:00 AM' }
		},
		{
			'storeid': '1236',
			'address': { 'unitnumber': '11', 'streetnumber': '346', 'streetname': 'Yonge St' },
			'city': 'Toronto',
			'province': 'ON',
			'postalcode': 'M5B 1R8',
			'marketphonenumber': '(416)-967-1111',
			'distance': '0.7 km',
			'imagename': '',
			'intersection' : 'Yonge St & Elm St',
			'hours' : { 'weekend' : '11:00 AM - 3:00 AM', 'weekday' : '11:00 AM - 2:00 AM' }
		},
		{
			'storeid': '1237',
			'address': { 'unitnumber': '11', 'streetnumber': '346', 'streetname': 'Yonge St' },
			'city': 'Toronto',
			'province': 'ON',
			'postalcode': 'M5B 1R8',
			'marketphonenumber': '(416)-967-1111',
			'distance': '0.7 km',
			'imagename': '',
			'intersection' : 'Yonge St & Elm St',
			'hours' : { 'weekend' : '11:00 AM - 3:00 AM', 'weekday' : '11:00 AM - 2:00 AM' }
		}
	];

}
