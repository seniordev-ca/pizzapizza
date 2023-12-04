import {
	Component,
	Input,
	Output,
	EventEmitter,
	HostListener,
	ViewEncapsulation,
	AfterViewInit,
	ElementRef,
	ViewChild,
	OnDestroy,
	Inject,
	PLATFORM_ID,
	OnChanges,
	SimpleChanges,
	OnInit
} from '@angular/core';
import { GoogleMapsService } from '../../../../../utils/google-maps/google-maps.service';
import { AddressInputInterface } from '../../../models/address-input';
import { FormGroup, FormBuilder } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';

/**
 * ngrx
 */
import { Store } from '@ngrx/store';
// actions
import { LocationsDataLayer } from '../../../actions/tag-manager'

import * as fromCommon from '../../../../common/reducers';
import { AsyncFormValidationService } from 'utils/async-form-validation';


export interface AddressSearchEmitterInterface {
	address: AddressInputInterface,
	addressString: string,
	error?: string,
	loading?: boolean,
	autoLoad?: boolean
}
@Component({
	selector: 'app-address-autocomplete',
	templateUrl: './address-search.component.html',
	styleUrls: ['./address-search.component.scss'],
	encapsulation: ViewEncapsulation.None
})

export class AddressAutoCompleteComponent implements AfterViewInit, OnDestroy, OnChanges {
	@ViewChild('addressSearchElement', { static: false }) storeSearchElement: ElementRef;
	@ViewChild('noResults', { static: false }) noResultsElement: ElementRef;
	@ViewChild('autoCompleteWrapper', { static: false }) autoCompleteWrapper: ElementRef;

	addressSearch: string;
	addressInput: FormGroup;

	@Input() set placeholder(input: string) {
		this.addressSearch = input;
		this.addressInput = this.fb.group({
			'location': this.addressSearch,
		});
	}
	isManualAddress: boolean;
	isManualToggleAccepted: boolean;
	@Input() manualAddressForm: FormGroup;
	@Input() set isManualToggleAllowed(isAllowed: boolean) {
		if (!this.autocomplete && this.isManualAddress) {
			this.initMap(true);
		}
		this.isManualAddress = false;
		this.isManualToggleAccepted = isAllowed;
	}

	@Input() isHeaderSearch: boolean;
	@Input() labelName: string;
	// By default the minium requirements is that the place should be of type 'street_address', this should be an array so we can provide many
	@Input() minimumRequirements = ['street_number'];

	@Output() addressSearchEmitter: EventEmitter<AddressSearchEmitterInterface> =
		new EventEmitter<AddressSearchEmitterInterface>();
	@Output() manualToggleEmitter: EventEmitter<boolean> =
		new EventEmitter<boolean>();

	autocomplete;
	geocoder;

	isAutoCompleteEmpty: boolean;
	isResultsActive = false;
	isButtonLoading: boolean;
	isGeoAvailable: boolean;
	isGeoClicked: boolean;
	userAddress;
	maps;
	isPlatformBrowser: boolean;

	geolocationSubscriptionRef;
	formChangeRef;

	// TODO - This should likely come from the server 'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT'
	provinceArray = [
		{
			'label': 'Select',
			'value': null
		},
		{
			'label': 'AB',
			'value': 'AB'
		},
		{
			'label': 'BC',
			'value': 'BC'
		},
		{
			'label': 'MB',
			'value': 'MB'
		},
		{
			'label': 'NB',
			'value': 'NB'
		},
		{
			'label': 'NL',
			'value': 'NL'
		},
		{
			'label': 'NS',
			'value': 'NS'
		},
		{
			'label': 'NT',
			'value': 'NT'
		},
		{
			'label': 'NU',
			'value': 'NU'
		},
		{
			'label': 'ON',
			'value': 'ON'
		},
		{
			'label': 'PE',
			'value': 'PE'
		},
		{
			'label': 'QC',
			'value': 'QC'
		},
		{
			'label': 'SK',
			'value': 'SK'
		},
		{
			'label': 'YT',
			'value': 'YT'
		}
	];
	postalMask: (string | RegExp)[];

	nodeObserver;

	constructor(
		private gapi: GoogleMapsService,
		private fb: FormBuilder,
		private store: Store<fromCommon.State>,
		private formValidationService: AsyncFormValidationService,
		@Inject(PLATFORM_ID) private platformId: Object
	) {
		this.postalMask = this.formValidationService.getPostalCodeMask();
		this.isPlatformBrowser = isPlatformBrowser(this.platformId);

		if ('geolocation' in navigator && navigator.geolocation) {
			this.isGeoAvailable = true;
		}
		this.isResultsActive = false;
		this.addressInput = this.fb.group({
			'location': this.addressSearch,
		});

		// Mutation Observer via
		this.nodeObserver = new MutationObserver((mutations) => {
			const currentInputValue = this.addressInput.get('location').value
			mutations.forEach((mutation) => {
				let isEmpty = false;
				let isDisplayed = true;
				if (mutation.type === 'childList') {
					isEmpty = mutation.addedNodes.length < 1;
				} else {
					isDisplayed = mutation.target['style'].display !== 'none'
				}
				this.isAutoCompleteEmpty = isEmpty && isDisplayed && currentInputValue.length > 0;
				this.isResultsActive = true;
			})
		})
	}

	/**
	 * It is possible our placeholder input could change from container level. At which point we need to autocomplete
	 */
	ngOnChanges(changes: SimpleChanges) {
		if (changes.placeholder && changes.placeholder.currentValue !== changes.placeholder.previousValue) {
			this._queryAutocomplete(this.addressSearch);
		}
	}
	/**
	 * Allow container to toggle a manual form if required
	 */
	clickManualToggle(event: Event, isAllowed: boolean) {
		if (isAllowed) {
			this.isManualAddress = true;
			this.manualToggleEmitter.emit(true);
			this.autocomplete = null;
			this.clearInput()
		}
	}

	/**
	 * Close Menu if user clicks outside this component --- confirmed that this only listens if the component is active
	 */
	@HostListener('document:click', ['$event'])
	clickout(event) {
		if (this.storeSearchElement && event.target !== this.storeSearchElement.nativeElement) {
			this.clearResults()
			this.storeSearchElement.nativeElement.blur()
		}
	}

	/**
	 * Clear Results Div
	 */
	clearResults() {
		this.isResultsActive = false;
		this.isAutoCompleteEmpty = false;
	}
	/**
	 * Cleaner approach to listen to input changes
	 */
	onFormChanges(): void {
		const location = this.addressInput.get('location');
		this.formChangeRef = location.valueChanges.subscribe(value => {
			if (!this.isGeoClicked && !this.isManualAddress) {
				this.addressSearchEmitter.emit({
					address: null,
					addressString: value
				});
				this.handleAutoComplete();
			} else {
				this.isGeoClicked = false;
			}
		});
		if (this.manualAddressForm) {
			this.manualAddressForm.valueChanges.subscribe(value => {
				if (this.manualAddressForm.valid && !this.isHeaderSearch) {
					const address = {
						streetName: value.streetName,
						streetNumber: value.streetNumber,
						city: value.city,
						province: value.province,
						postalCode: value.postalCode
					} as AddressInputInterface
					this.addressSearchEmitter.emit({
						address,
						addressString: value.streetNumber + ' ' + value.streetName + ', ' + value.city + ', ' + value.province
					})
				}
			})
		}
	}

	/**
	 * Clear Input
	 */
	clearInput() {
		this.addressSearch = '';
		this.addressInput.get('location').patchValue(null);
	}
	/**
	 * Check if Autocomplete results are empty
	 */
	handleAutoComplete() {
		if (this.isPlatformBrowser) {
			const elements: HTMLCollectionOf<Element> = document.getElementsByClassName('pac-container');
			const activePacElement = elements[elements.length - 1];
			if (activePacElement) {
				this.noResultsElement.nativeElement.appendChild(activePacElement);
				this.nodeObserver.observe(activePacElement, { childList: true, attributes: true })
			}
		}
		return false;
	}
	/**
	 * after component loaded
	 */
	ngAfterViewInit(): void {
		this.storeSearchElement.nativeElement.focus();
		this.initMap(true);
		this.onFormChanges();
	}

	/**
	* Init map api [google.maps]
	*/
	initMap(isInitialLoad: boolean) {
		if (isInitialLoad) {
			this.gapi.init.then((maps) => {
				const input = this.storeSearchElement.nativeElement;
				const options = {
					componentRestrictions: { country: 'ca' }
				};
				this.maps = maps;
				this._queryAutocomplete(this.addressSearch);

				this.autocomplete = new maps.places.Autocomplete(input, options);
				this.geocoder = new maps.Geocoder();
				this.autocomplete.setFields(['address_components', 'geometry', 'icon', 'name', 'formatted_address']);
				/**
				 * Listen to change - note: we'd likely use the form submission instead of this but if we want to fire anything ahead of submit we can.
				 */
				this.autocomplete.addListener('place_changed', () => {
					const place = this.autocomplete.getPlace();
					this._autoSet(place, false);
					this.handleAutoComplete();
				});
			});
		} else {
		}
	}
	/**
	 * Use the browser location api on click
	*/
	getLocation() {
		if (this.isManualToggleAccepted) {
			this.store.dispatch(new LocationsDataLayer('findme', 'Find Me Clicks', 'Delivery'))
		} else {
			this.store.dispatch(new LocationsDataLayer('findme', 'Find Me Clicks', 'Pickup'))
		}
		if ('geolocation' in navigator && navigator.geolocation) {
			this.addressSearchEmitter.emit({
				loading: true,
				address: null,
				addressString: null
			})
			const options = {
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 60000
			};
			navigator.geolocation.getCurrentPosition((position) => {
				this.isButtonLoading = false;
				this.geolocationSubscriptionRef = this.geocoder.geocode(
					{ 'location': { 'lat': position.coords.latitude, 'lng': position.coords.longitude } }, (results, status) => {
						if (status === 'OK') {
							try {
								this.isGeoClicked = true;
								this.addressInput['controls']['location'].setValue(results[0]['formatted_address'])
								this.userAddress = {
									address_components: results[0].address_components,
									formatted_address: results[0].formatted_address,
									latitude: results[0].geometry.location.lat(),
									longitude: results[0].geometry.location.lng()
								}
								const addressString = results[0]['formatted_address'];

								this.addressSearchEmitter.emit({
									address: this.userAddress,
									addressString,
									loading: false
								});
							} catch (e) {
								console.warn('Google Results Error', e);
								this.addressSearchEmitter.emit({
									address: null,
									addressString: null,
									error: 'Google Results Error',
									loading: false
								});
							}
						} else {
							alert('Geocode was not successful for the following reason: ' + status);
						}
					});
			}, (err) => {
				console.warn(`ERROR(${err.code}): ${err.message}`);
				this.addressSearchEmitter.emit({
					address: null,
					addressString: null,
					error: 'Geosearch Failed',
					loading: false
				});
				this.isButtonLoading = false;
			}, options);
		} else {
			const error = 'Geolocation is not supported by this browser.';
			this.addressSearchEmitter.emit({
				address: null,
				addressString: null,
				error,
				loading: false
			});
		}
	}

	/**
	 * Does the returned place meet the minimum requirements?
	 */
	isLocationMeetsMinimumRequirements(place) {
		// console.log(place)
		let placeTypes = [];
		place.address_components.forEach(component => {
			placeTypes = placeTypes.concat(component.types)
		})
		const meetsMin = this.minimumRequirements.length > 0 ? this.minimumRequirements.filter(min => placeTypes.indexOf(min) > -1) : [0];
		return this.minimumRequirements.length > 0 ? meetsMin.length > 0 : true
	}

	/**
	 * Auto Set the input as the place provided via google geocoder
	 */
	_autoSet(place, isInitialLoad: boolean) {
		if (place.geometry && this.isLocationMeetsMinimumRequirements(place)) {
			this.userAddress = {
				address_components: place.address_components,
				formatted_address: place.formatted_address,
				latitude: place.geometry.location.lat(),
				longitude: place.geometry.location.lng(),
			}
			this.addressSearchEmitter.emit({
				address: this.userAddress,
				addressString: place.formatted_address,
				loading: false,
				autoLoad: isInitialLoad
			});

			this.clearResults()
		}
		if (!this.isLocationMeetsMinimumRequirements(place)) {
			this.addressSearchEmitter.emit({
				address: null,
				addressString: null,
				error: 'Address is incomplete',
				loading: false
			});
		}
	}

	/**
	 * Initial Query Based on default string
	 */
	_queryAutocomplete(input) {
		if (this.maps && input) {
			// *Uses Google's autocomplete service to select an address
			const service = new this.maps.places.AutocompleteService();
			service.getPlacePredictions({
				input: input,
				componentRestrictions: {
					country: 'ca'
				}
			}, (predictions, status) => {
				if (status !== 'OK') {
					// show that this address is an error
					console.warn('address error')
					return;
				}
				const placeId = predictions[0].place_id;
				const geocoder = new this.maps.Geocoder();
				geocoder.geocode({ 'placeId': placeId }, (results) => {
					if (status === 'OK' && (results && results[0])) {
						this._autoSet(results[0], true)
						return
					}
					console.warn('geocoder error')
				});
			});
		}
	}

	/**
	 * Angular destructor
	 */
	ngOnDestroy() {
		this._unsubscribeFromAll();
	}

	/**
	 * Unsubscribe from all direct listenings
	 */
	private _unsubscribeFromAll() {
		if (this.geolocationSubscriptionRef) {
			this.geolocationSubscriptionRef.unsubscribe();
		}
		this.nodeObserver.disconnect();
		this.formChangeRef.unsubscribe();
	}
}
