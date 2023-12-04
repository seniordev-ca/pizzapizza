import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'phone'
})

export class PhonePipe implements PipeTransform {
	/**
	 * Transform string of numbers to phone number
	 */
	transform(tel, args) {
		if (!tel) {
			return false;
		}
		const value = tel.toString().trim().replace(/[^0-9.]/g, '');

		if (value.match(/[^0-9]/)) {
			return tel;
		}

		let country, city, pnumber;

		switch (value.length) {
			case 10: // +1PPP####### -> C (PPP) ###-####
				country = 1;
				city = value.slice(0, 3);
				pnumber = value.slice(3);
				break;

			case 11: // +CPPP####### -> CCC (PP) ###-####
				country = value[0];
				city = value.slice(1, 4);
				pnumber = value.slice(4);
				break;

			case 12: // +CCCPP####### -> CCC (PP) ###-####
				country = value.slice(0, 3);
				city = value.slice(3, 5);
				pnumber = value.slice(5);
				break;

			default:
				return tel;
		}

		if (country === 1) {
			country = '';
		}

		pnumber = pnumber.slice(0, 3) + '-' + pnumber.slice(3);

		return (country + ' (' + city + ') ' + pnumber).trim();
	}
}
