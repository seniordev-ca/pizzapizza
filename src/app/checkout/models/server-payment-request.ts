

// TODO import checkout payload
// export interface mpEncodingRequest {

// }

export interface MpDecodingRequest {
	encoded_order_key: string
}

export interface MpCheckoutRequest {
	encoded_order_key: string,
	payment_data: {
		token: string
	}
}
