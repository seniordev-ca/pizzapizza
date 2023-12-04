
import * as pako from 'pako';
// Models
import { JsDataInterface } from '../models/js-validation-data'

// base64 character set, plus padding character (=)
const b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
	// Regular expression to check formal correctness of base64 encoded strings
	b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;

/* tslint:disable:no-bitwise */
const _atob = (inputString) => {
	inputString = String(inputString).replace(/[\t\n\f\r ]+/g, '');
	if (!b64re.test(inputString)) {
		throw new TypeError(`Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.`);
	}
	// Adding the padding if missing, for simplicity
	inputString += '=='.slice(2 - (inputString.length & 3));
	let bitmap, result = '', r1, r2, i = 0;
	for (; i < inputString.length;) {
		bitmap = b64.indexOf(inputString.charAt(i++)) << 18 | b64.indexOf(inputString.charAt(i++)) << 12
			| (r1 = b64.indexOf(inputString.charAt(i++))) << 6 | (r2 = b64.indexOf(inputString.charAt(i++)));

		result += r1 === 64 ? String.fromCharCode(bitmap >> 16 & 255)
			: r2 === 64 ? String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255)
				: String.fromCharCode(bitmap >> 16 & 255, bitmap >> 8 & 255, bitmap & 255);
	}
	return result;
}

export class Decoding {

	/**
	 * Decodes js data
	 */
	static decode(b64Data: string): JsDataInterface {
		// Decode base64 (convert ascii to binary)
		const strData = _atob(b64Data);
		// Convert binary string to character-number array
		const charData = strData.split('').map(function (x) { return x.charCodeAt(0); });
		// Turn number array into byte-array
		const binData = new Uint8Array(charData);
		// Pako magic
		const data = pako.inflate(binData);
		// Convert gunzipped byteArray back to ascii string:
		// const decodedDataString = String.fromCharCode.apply(null, new Uint16Array(data));
		// Safari don't like this, it will rise "maximum call stack size exceeded" error

		let str = '';
		// var converted = [];
		const array = new Uint16Array(data);
		for (let i = 0, len = array.length; i < len; i++) {
			str += String.fromCharCode(array[i]);
		}
		const decodedDataString = str
		// Parse as a string
		return JSON.parse(decodedDataString) as JsDataInterface;
	}
}
