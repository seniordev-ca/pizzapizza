var PPL = {};
PPL.PhoenixCCC = {};
PPL.PhoenixCCC.OrderEntry = {};

PPL.PhoenixCCC.OrderEntry.OrderValidation = {
	validationParameters: {
		ItemCode: "",
		ItemType: "",
		IngRecordArray: "",
		LastIngredientCode: "",
		NoofIng: 0,
		NoofIncluded: 0

	},
	itemRules: {
		record: "",
		ItemRuleArray: "",
		IngRuleArray: "",
		IngRuleCnt: ""
	},
	itemRules1: {
		record: "",
		ItemRuleArray: "",
		IngRuleArray: "",
		IngRuleCnt: ""
	},
	itemRules2: {
		record: "",
		ItemRuleArray: "",
		IngRuleArray: "",
		IngRuleCnt: ""
	},
	itemValidation: {
		ErrorCode: "",
		ErrorMessage: "",
		CallToAction: "",
		ItemPrice: 0.0,
		Chargeable_Toppings: 0,
		ToppingPrice: 0.0,
		NSTP: 0.0,
		v_dptp: 0.0,
		LastIngredientPrice: "",
		PricingRulesArray: {}
	},

	testFunct: function () {
		//document.location.href = "http://debugger/Test";
	},

	setRules1: function (record, rulesmatrix) {
		this.itemRules1.ItemRuleArray = rulesmatrix.data.ValidationMatrix[0].ItemMatrix;
		this.itemRules1.IngRuleArray = rulesmatrix.data.ValidationMatrix[1].IngredientMatrix;
		this.itemRules1.record = record;
		this.itemValidation.NSTP = 0.0;
		this.itemValidation.v_dptp = 0.0;
		//console.log('setRule1');
	},
	setRules2: function (record, rulesmatrix) {
		this.itemRules2.ItemRuleArray = rulesmatrix.data.ValidationMatrix[0].ItemMatrix;
		this.itemRules2.IngRuleArray = rulesmatrix.data.ValidationMatrix[1].IngredientMatrix;
		this.itemRules2.record = record;
		this.itemValidation.NSTP = 0.0;
		this.itemValidation.v_dptp = 0.0;
		this.itemRules1.record.data["Ingredients"] = this.itemRules1.record.data["Ingredients"] + this.itemRules2.record.data["Ingredients"];
		this.itemRules2.record.data["Ingredients"] = '';
		//console.log('setRule2');

	},
	setRules: function (item_seqno) {


		if (item_seqno == 1) {
			//console.info('****Twin1 Validation******');
			this.itemRules.ItemRuleArray = this.itemRules1.ItemRuleArray;
			this.itemRules.IngRuleArray = this.itemRules1.IngRuleArray;
			this.itemRules.record = this.itemRules1.record;
		} else {
			this.itemRules.ItemRuleArray = this.itemRules2.ItemRuleArray;
			this.itemRules.IngRuleArray = this.itemRules2.IngRuleArray;
			this.itemRules.record = this.itemRules2.record;
		}
		//console.log("Rule"+ item_seqno+" "+ this.itemRules.record.data["Ingredients"]);
	},
	IsGaurmetTopping: function (Ingredient) {
		for (var k = 0; k < this.itemRules.IngRuleCnt; k++) {
			if (Ingredient == this.itemRules.IngRuleArray[k][0]) {
				if (this.itemRules.IngRuleArray[k][6] = "1") {
					return "G";
				} else {
					return "";
				}
			}
		}
		return "";
	},
	isSubstituteTopping: function (Ingredient) {
		for (var k = 0; k < this.itemRules.IngRuleCnt; k++) {
			//console.info(this.itemRules.IngRuleArray[k][0]);
			if (Ingredient == this.itemRules.IngRuleArray[k][0]) {
				//console.info(this.itemRules.IngRuleArray[k]);
				//Substitute Flag in 9th Position in Matrix
				if (this.itemRules.IngRuleArray[k][9] == "1") {
					return true;
				}
				else {
					return false;
				}
			}

		}
		return false;
	},
	SetTopping: function (Ingredient) {
		//console.info(Ingredient);
		//console.info(this.itemRules.IngRuleCnt);
		var Topping = {
			ToppingMaxCount: 0,
			ToppingCount: 0,
			ToppingSFTCount: 0,
			Free_Category: "",
			ToppingIncludedQty: "",
			ToppingCategory: 0,
			NoofIncluded: 0,
			ToppingBasePrice: 0
		}
		// 999 - Base Topping Price for Premium topping logic
		for (var k = 0; k < this.itemRules.IngRuleCnt; k++) {
			// 999 - Base Topping Price for Premium topping logic
			//console.log(this.itemRules.IngRuleArray[k][0]+" "+this.itemRules.IngRuleArray[k][11]);
			if (this.itemRules.IngRuleArray[k][11] == "999") {
				Topping.ToppingBasePrice = parseFloat(this.itemRules.IngRuleArray[k][7]); //Price
			}

		}
		// 999 - Base Topping Price for Premium topping logic
		for (var k = 0; k < this.itemRules.IngRuleCnt; k++) {
			if (Ingredient == this.itemRules.IngRuleArray[k][0]) {
				Topping.ToppingMaxCount = parseFloat(this.itemRules.IngRuleArray[k][11]); //Quntity of Topping.
				Topping.ToppingCount = parseFloat(this.itemRules.IngRuleArray[k][12]); //topping count
				//Standard Fix Topping Count  CUR_SFTC Refer.
				//if(parseFloat(this.itemRules.IngRuleArray[k][15])!=NaN)
				Topping.ToppingSFTCount = parseFloat(this.itemRules.IngRuleArray[k][15]); //Standard Topping Count
				//else
				//Topping.ToppingSFTCount=0;
				Topping.ToppingIncludedQty = parseFloat(this.itemRules.IngRuleArray[k][5]); //Standard Topping Count
				Topping.Price = parseFloat(this.itemRules.IngRuleArray[k][7]); //Price
				//--16 Topping Count
				Topping.ToppingCategory = parseFloat(this.itemRules.IngRuleArray[k][9]);

				if (Topping.ToppingCategory > 0)
					Topping.NoofIncluded = parseFloat(this.itemRules.IngRuleArray[k][2]);
				if (this.itemRules.IngRuleArray[k][10] == "1") {
					Topping.Free_Category = "G";
				}
				else {
					Topping.Free_Category = "";
				}
				return Topping;
			}

		}
		return "";
	},
	BuildToppingTemp: function (record) {
		var NoofIng = 0;
		var ingcnt = 0;
		var found = false;
		var totalingredient = 0;
		var LastIndex = 0;
		var k = record.data["Ingredients"].length - 1;
		if (record.data["Ingredients"].length > 0) {
			if (record.data["Ingredients"].charAt(k) == "," || record.data["Ingredients"].charAt(k) == "." || record.data["Ingredients"].charAt(k) == "\\" || record.data["Ingredients"].charAt(k) == "/") {
				this.itemValidation.ErrorCode = "";
			}
			else {
				this.itemValidation.ErrorCode = "10";
				this.itemValidation.ErrorMessage = "Ingredient must be end with following characters '.,/\'";
				return false;
			}
		}
		for (var k = 0; k < record.data["Ingredients"].length; k++) {
			if (record.data["Ingredients"].charAt(k) == "," || record.data["Ingredients"].charAt(k) == "." || record.data["Ingredients"].charAt(k) == "\\" || record.data["Ingredients"].charAt(k) == "/") {
				NoofIng = NoofIng + 1;
			}
		}
		this.validationParameters.NoofIng = NoofIng;
		this.validationParameters.IngRecordArray = new Array(NoofIng);
		this.validationParameters.LastIngredientCode = record.data.LastIngredient;
		this.itemRules.IngRuleCnt = this.itemRules.IngRuleArray.length;
		for (j = 0; j <= NoofIng; j++) {
			this.validationParameters.IngRecordArray[j] = new Array(9);
		}
		LastIndex = 0;
		for (var k = 0; k <= record.data["Ingredients"].length; k++) {

			if (record.data["Ingredients"].charAt(k) == "," || record.data["Ingredients"].charAt(k) == "." || record.data["Ingredients"].charAt(k) == "\\" || record.data["Ingredients"].charAt(k) == "/") {
				totalingredient = 0;
				found = false;
				for (l = 0; l < ingcnt; l++) {
					if (this.validationParameters.IngRecordArray[l][0] == record.data["Ingredients"].substring(LastIndex, k)) {
						index = l;
						found = true;
						//console.info(record.data["Ingredients"].substring(LastIndex,k) +" found");
					}
				}
				if (!found) {
					this.validationParameters.IngRecordArray[ingcnt][0] = record.data["Ingredients"].substring(LastIndex, k);
					Topping = this.SetTopping(this.validationParameters.IngRecordArray[ingcnt][0]);

					if (Topping == "") {
						this.itemValidation.ErrorCode = '20' //Topping Unidentified.
						this.itemValidation.ErrorMessage = "Invalid Ingredient Code " + this.validationParameters.IngRecordArray[ingcnt][0];
						return false;
					}
					this.validationParameters.IngRecordArray[ingcnt][2] = Topping.Free_Category;
					this.validationParameters.IngRecordArray[ingcnt][4] = Topping.ToppingMaxCount;
					this.validationParameters.IngRecordArray[ingcnt][5] = Topping.ToppingCount;
					this.validationParameters.IngRecordArray[ingcnt][6] = Topping.ToppingSFTCount;
					this.validationParameters.IngRecordArray[ingcnt][7] = Topping.Price;
					this.validationParameters.IngRecordArray[ingcnt][8] = Topping.ToppingIncludedQty;
					this.validationParameters.IngRecordArray[ingcnt][9] = Topping.ToppingCategory;
					this.validationParameters.IngRecordArray[ingcnt][10] = Topping.NoofIncluded;
					//Premium Topping Logic
					if (Topping.Price > 0) {
						this.validationParameters.IngRecordArray[ingcnt][11] = Topping.ToppingBasePrice;
					}
					else {
						this.validationParameters.IngRecordArray[ingcnt][11] = Topping.Price;
					}
					//Premium Topping Logic
					if (Topping.ToppingCategory > 0) {
						this.validationParameters.NoofIncluded = Topping.NoofIncluded;
					}
					if (record.data["Ingredients"].charAt(k) == ",") {
						this.validationParameters.IngRecordArray[ingcnt][1] = 2;
					}
					if (record.data["Ingredients"].charAt(k) == "/") {
						this.validationParameters.IngRecordArray[ingcnt][1] = 0.5;
					}
					if (record.data["Ingredients"].charAt(k) == "\\") {
						this.validationParameters.IngRecordArray[ingcnt][1] = 0.5;
					}
					if (record.data["Ingredients"].charAt(k) == ".") {
						this.validationParameters.IngRecordArray[ingcnt][1] = 1;
					}
					ingcnt++;
				}
				else {
					if (record.data["Ingredients"].charAt(k) == ",") {
						this.validationParameters.IngRecordArray[index][1] = parseFloat(this.validationParameters.IngRecordArray[index][1]) + 2;
					}
					if (record.data["Ingredients"].charAt(k) == "/") {
						this.validationParameters.IngRecordArray[index][1] = parseFloat(this.validationParameters.IngRecordArray[index][1]) + 0.5;
					}
					if (record.data["Ingredients"].charAt(k) == "\\") {
						this.validationParameters.IngRecordArray[index][1] = parseFloat(this.validationParameters.IngRecordArray[index][1]) + 0.5;
					}
					if (record.data["Ingredients"].charAt(k) == ".") {
						this.validationParameters.IngRecordArray[index][1] = parseFloat(this.validationParameters.IngRecordArray[index][1]) + 1;
					}

				}

				LastIndex = k + 1;
			}

		}
		return true;
	},
	//4,3,0,3
	get_calc_chrg_toppings: function (p_start_cnt, p_gourment_cnt, p_substitute_cnt, p_round_cnt) {
		var v_oth_topping = 0, v_actual_substitutions = 0, v_eligible_substitutions = 0, p_chrg_toppings = 0;
		if (this.isEmpty(p_round_cnt)) p_round_cnt = 0;
		if (this.isEmpty(p_start_cnt)) p_start_cnt = 0;
		v_oth_topping = p_round_cnt - p_start_cnt; //Issue need checked?
		v_eligible_substitutions = p_gourment_cnt - p_start_cnt;
		if (v_eligible_substitutions > 0) {
			// -- If number of eligible substitution toppings are less than
			// or equals to substitutions allowed then the eligible substitutions
			//will become the actual substitutions
			if (v_eligible_substitutions <= p_substitute_cnt) {
				v_actual_substitutions = v_eligible_substitutions;
				// If number of eligible substitution toppings are greater than
				// to substitutions allowed then  substitutions allowed
				// will become the actual substitutions
			}
			else {
				if (v_eligible_substitutions > p_substitute_cnt) {
					v_actual_substitutions = p_substitute_cnt;
				}
			}
		}
		if (v_oth_topping < v_actual_substitutions) v_oth_topping = 0;
		if (v_oth_topping > 0) { p_chrg_toppings = v_oth_topping - v_actual_substitutions; }
		else { p_chrg_toppings = 0; }
		return p_chrg_toppings;
	},
	get_price: function (vtype) {
		record = this.itemRules.record;
		if (this.itemRules.ItemRuleArray[1] == 'gourmet') {
			this.validationParameters.ItemType = 'G';
		}
		else {
			this.validationParameters.ItemType = '';
		}
		if (!this.BuildToppingTemp(record)) {
			return this.itemValidation;
		}
		if (!this.check_mark_substitution_pass()) {
			return this.itemValidation;
		}
		if (!this.check_max_topping_pass()) {
			//return this.itemValidation;
		}
		if (record.data["Ingredients"].length > 0) {
			if (vtype == 'twin2') {
				this.get_prices_and_count(this.itemRules2.record, vtype);
			}
			if (vtype == 'twin1') {
				this.get_prices_and_count(this.itemRules1.record, vtype);
			}
			if (vtype != 'twin1' && vtype != 'twin2')
				this.get_prices_and_count(record, vtype);
		}
		else {
			this.itemValidation.ItemPrice = parseFloat(this.itemRules.ItemRuleArray[2]);
			this.itemValidation.Chargeable_Toppings = 0;
		}
		var v_fts = this.itemRules.ItemRuleArray[5];
		// alert(v_fts);
		if (!this.isEmpty(v_fts)) {
			for (var ruleCnt = 0; ruleCnt < this.itemRules.IngRuleArray.length; ruleCnt++) {
				var pricingRuleCat = this.itemRules.IngRuleArray[ruleCnt][9];
				if (this.isEmpty(this.itemValidation.PricingRulesArray[pricingRuleCat])) {
					var pricingRule = {};
					pricingRule.includedQty = this.itemRules.IngRuleArray[ruleCnt][2];
					pricingRule.selectedQty = 0;
					pricingRule.maxPrice = this.itemRules.IngRuleArray[ruleCnt][7];
					this.itemValidation.PricingRulesArray[pricingRuleCat] = pricingRule;
				}
			}
			for (var index in this.itemValidation.PricingRulesArray) {
				var v_ntc = this.itemValidation.PricingRulesArray[index].selectedQty;
				var v_ftc = this.itemValidation.PricingRulesArray[index].includedQty;
				if (this.check_free_component(v_fts, v_ntc, v_ftc) == false) {
					return this.itemValidation;
				}
				else {
					// alert("Recalculating againnnn..." + this.itemValidation.CallToAction);
				}
			}
		}
		return this.itemValidation;
	},
	get_free_component_selection: function (v_stc, v_free_comp_cnt) {

	},
	//please setRules first before call this function.
	//item_seqno is pizza seqno. it most applicable for twin.
	get_recal_price: function (mainrecord, item_seqno, v_special_handling) {
		//var v_special_handling= this.itemRules1.ItemRuleArray[1];
		var v_item_type = '';
		var v_1st_price = 0.0;
		var v_2nd_price = 0.0;
		var v_1st_toppings = 0;
		var v_2nd_toppings = 0;
		var v_1st_baseprice = 0.0;
		var v_2nd_baseprice = 0.0;
		var v_1st_free_top = 0;
		var v_2nd_free_top = 0;
		var v_1st_nsfp = 0;
		var v_2nd_nsfp = 0;
		var v_total_chargable_toppings = 0;
		var v_price = 0.0;
		var baseprice = parseFloat(this.itemRules.ItemRuleArray[2]);
		var v_configuration = this.itemRules.ItemRuleArray[3];
		this.itemValidation.NSTP = 0;
		mainrecord.set('Price', parseFloat(baseprice));
		if (v_special_handling == 1 && item_seqno == '1') {
			this.itemValidation.NSTP = 0;
			this.itemValidation.PricingRulesArray = {};
			this.setRules(item_seqno);
			this.get_price('twin1');

			//v_1st_baseprice=parseFloat(this.itemRules.ItemRuleArray[2]);
			v_1st_baseprice = parseFloat(this.itemRules.ItemRuleArray[2]);
			//v_1nd_baseprice=parseFloat(Math.round(this.itemValidation.ItemPrice*100)/100);
			v_1st_nsfp = parseFloat(this.itemValidation.NSTP);
			v_1st_dptp = parseFloat(this.itemValidation.v_dptp);
			item_seqno = 2;
			this.itemValidation.ToppingPrice = 0;
			this.itemValidation.NSTP = 0;
			this.setRules(item_seqno);
			this.get_price('twin2');
			v_2nd_baseprice = parseFloat(this.itemRules.ItemRuleArray[2]);
			//v_2nd_baseprice=parseFloat(Math.round(this.itemValidation.ItemPrice*100)/100);
			v_2nd_nsfp = parseFloat(this.itemValidation.NSTP);
			v_2nd_dptp = parseFloat(this.itemValidation.v_dptp);
			//Merge Price for twin.
			v_total_nsftp = v_1st_nsfp + v_2nd_nsfp;
			//v_total_chargable_toppings=v_1st_toppings+v_2nd_toppings;
			//Added by SB (06/02/2009) to calculate twin price
			for (var index in this.itemValidation.PricingRulesArray) {
				v_total_chargable_toppings = Math.ceil(((this.itemValidation.PricingRulesArray[index].selectedQty / 2) - this.itemValidation.PricingRulesArray[index].includedQty), 2);
				if (v_total_chargable_toppings > 0) {
					v_price = v_price + (v_total_chargable_toppings * this.itemValidation.PricingRulesArray[index].maxPrice);
				}
				console.info('v_total_chargable_toppings' + v_total_chargable_toppings);
				console.info('v_price' + v_price);
			}

			if (v_total_chargable_toppings < 0) {
				v_total_chargable_toppings = 0;
			}
			console.info(v_total_chargable_toppings);
			console.info('v_price' + v_price);
			v_twin_price = v_1st_baseprice + v_2nd_baseprice + v_price + (v_total_nsftp) + v_1st_dptp + v_2nd_dptp;
			if (this.itemValidation.ErrorCode != "") {
				//alert(this.itemValidation.ErrorMessage);
			}
			this.itemValidation.ItemPrice = parseFloat(v_twin_price);
			mainrecord.set('Price', parseFloat(v_twin_price));
			mainrecord.set('LastIngredientPrice', parseFloat(this.itemValidation.LastIngredientPrice));
			return this.itemValidation;
		}
		else {
			this.setRules(item_seqno);
			this.get_price('single');
			if (this.itemValidation.ErrorCode != "") { }
			mainrecord.set('Price', parseFloat(Math.round(this.itemValidation.ItemPrice * 100) / 100));
			mainrecord.set('LastIngredientPrice', parseFloat(this.itemValidation.LastIngredientPrice));
			return this.itemValidation;
		}
		if (v_configuration == 'N') {
			mainrecord.set('Price', parseFloat(baseprice));
			mainrecord.set('LastIngredientPrice', parseFloat(this.itemValidation.LastIngredientPrice));
			return this.itemValidation;

		}

	},
	isEmpty: function (v, allowBlank) {
		return v === null || v === undefined || (!allowBlank ? v === '' : false);
	},
	check_max_topping_pass: function () {
		for (var ingcnt = 0; ingcnt < this.validationParameters.IngRecordArray.length; ingcnt++) {
			if (!this.isEmpty(this.validationParameters.IngRecordArray[ingcnt][4]) && parseFloat(this.validationParameters.IngRecordArray[ingcnt][4]) > 0)
				if (parseFloat(this.validationParameters.IngRecordArray[ingcnt][1]) > parseFloat(this.validationParameters.IngRecordArray[ingcnt][4])) {
					this.itemValidation.ErrorCode = "61";
					//this.itemValidation.ErrorMessage="Item Code "+this.validationParameters.IngRecordArray[ingcnt][0]+ " fail to meet Max Topping Condition for Toppingcode "+this.validationParameters.IngRecordArray[ingcnt][0];
					this.itemValidation.ErrorMessage = "For " + this.validationParameters.IngRecordArray[ingcnt][0] + " you have exceeded the maximum quantity for " + this.validationParameters.IngRecordArray[ingcnt][0];
					return false;
				}
		}
		return true;

	},
	check_mark_substitution_pass: function () {
		for (var ingcnt = 0; ingcnt < this.validationParameters.IngRecordArray.length; ingcnt++) {
			if (this.isSubstituteTopping(this.validationParameters.IngRecordArray[ingcnt][0]) == true) {
				if (parseFloat(this.validationParameters.IngRecordArray[ingcnt][1]) <= 1) {
					this.validationParameters.IngRecordArray[ingcnt][3] = 0;
				}
				if (parseFloat(this.validationParameters.IngRecordArray[ingcnt][1]) == 2) {
					this.validationParameters.IngRecordArray[ingcnt][3] = 1;
				}

			}
			else {
				this.validationParameters.IngRecordArray[ingcnt][3] = 0;
			}
		}

		return true;
	},

	check_mutually_exclusiveness_pass: function () {
	},
	ToppingPrice: {
		P_STD_Topping_Count: 0,
		P_STD_TOP_PRICE: 0,
		P_NSTP: 0,
		P_Error: '',
		P_CHARGEABLE_TOPPINGS: '',
		P_CALCULATED_PRICE: ''
	},
	get_prices_and_count: function (record, ptype) {
		//console.info("**********Ingredient Count and Price*********")
		var v_rsftc = 0;
		var v_sftc = 0;
		var v_sub = 0;
		var v_esub = 0;
		var v_stc = 0;
		var v_ot = 0;
		var v_star_count = 0;
		var list_start_count = 0;
		var v_other_toppings = 0;
		var v_chargeable_toppings = 0;
		var v_substitution_count = 0;
		var v_retun = 0.0;
		var v_price = 0.0;
		var v_max_price = 0.0;
		var v_sql_error = 0;
		var v_prog = 0;
		var v_rtc = 0;
		var v_max_price = 0;
		var v_nstp = 0;
		var v_nsftp = 0;
		var item_type = "";
		var p_item_type = '';
		var v_dstp = 0;
		var toppingcatqty = 0;
		var v_dptp = 0;
		/*
		Updated by SB to add logic to handle multiple pricing rules for products
		June 3, 2009
		All the pricing rules are saved in a an array of object, pricingrules
		*/
		var pricingrulesarr = new Array();
		//Added by SB (06/03/2009) to copy pricing rules array from 1st to 2nd twin
		if (ptype == "twin2") {
			//set the pricingrulesarr from the 1st twin product for this
			pricingrulesarr = this.itemValidation.PricingRulesArray;
		}

		for (var ingcnt = 0; ingcnt < this.validationParameters.IngRecordArray.length; ingcnt++) {
			if (!this.isEmpty(this.validationParameters.IngRecordArray[ingcnt][0])) {
				//console.info(this.validationParameters.IngRecordArray[ingcnt])
				toppingcnt = parseFloat(this.validationParameters.IngRecordArray[ingcnt][5]);
				toppingincqty = parseFloat(this.validationParameters.IngRecordArray[ingcnt][8]);
				toppingcat = parseFloat(this.validationParameters.IngRecordArray[ingcnt][9]);
				toppingqty = parseFloat(this.validationParameters.IngRecordArray[ingcnt][1]);
				toppingprice = parseFloat(this.validationParameters.IngRecordArray[ingcnt][11]);
				toppingcatqty = parseFloat(this.validationParameters.IngRecordArray[ingcnt][10]);
				toppingbaseprice = parseFloat(this.validationParameters.IngRecordArray[ingcnt][7]);
				//console.log('Topping' +this.validationParameters.IngRecordArray[ingcnt][0]);
				//console.log('ToppingBasePrice' +toppingbaseprice);
				//console.log('toppingprice' +toppingprice);
				if (toppingprice == 0) {
					toppingprice = toppingbaseprice;
				}
				//toppingfree_cat=this.validationParameters.IngRecordArray[ingcnt][2];
				item_type = this.validationParameters.IngRecordArray[ingcnt][2];
				p_item_type = this.validationParameters.ItemType;
				toppingscnt = parseFloat(this.validationParameters.IngRecordArray[ingcnt][6]); //standard topping count
				//Defined Option Concept
				//console.log('toppingcat'+toppingcat  + ' toppingcatqty '+ toppingcatqty);
				if (toppingcat > 0) {
					//Updated by SB (06/02/2009) to add the pricing rules category in an array
					//for later reference when adding to the array of pricingRules objects
					if (this.isEmpty(pricingrulesarr)) {
						pricingrulesarr = {};
					}
					//if category is not already in the pricing rules array, create an object
					//and add it in
					if (this.isEmpty(pricingrulesarr[toppingcat])) {
						var pricingRule = {};
						pricingRule.includedQty = toppingcatqty;
						pricingRule.selectedQty = 0;
						pricingRule.maxPrice = toppingprice;
						pricingrulesarr[toppingcat] = pricingRule;
					}
					if (toppingcatqty > 0) {
						//if the record exists, get the stc and update the value
						if (!this.isEmpty(pricingrulesarr[toppingcat])) {
							pricingrulesarr[toppingcat].selectedQty = pricingrulesarr[toppingcat].selectedQty + Math.round((toppingqty) * 100) / 100;
							if (this.itemRules1.ItemRuleArray[1].substring(0, 4) == "twin") {
								v_dptp = v_dptp + toppingqty * (toppingbaseprice - toppingprice) / 4;

								//console.log("topping 8.1-premium"+v_dptp + " "+ toppingqty);

							}
							else {

								v_dptp = v_dptp + toppingqty * (toppingbaseprice - toppingprice);
								//console.log("topping 8.2-premium"+v_dptp + " "+ toppingqty);

							}

							//console.log("topping 8-premium"+v_dptp  + "  " + toppingqty);
						}
						else {
							var pricingRule = {};
							pricingRule.includedQty = toppingcatqty;
							pricingRule.selectedQty = 0;
							pricingRule.maxPrice = toppingprice;

							pricingrulesarr[toppingcat] = pricingRule;
						}
					}
					else {
						var chargeableTopCnt = toppingqty - toppingincqty;
						if (chargeableTopCnt > 0) {
							//if the record exists, get the stc and update the value
							if (!this.isEmpty(pricingrulesarr[toppingcat])) {
								pricingrulesarr[toppingcat].selectedQty = pricingrulesarr[toppingcat].selectedQty + Math.round((toppingqty - toppingincqty) * 100) / 100;
								//v_dptp= v_dptp+Math.round((toppingqty-toppingincqty)*100)/100*(toppingbaseprice-toppingprice);
								if (this.itemRules1.ItemRuleArray[1].substring(0, 4) == "twin") {
									v_dptp = v_dptp + (toppingqty - toppingincqty) * (toppingbaseprice - toppingprice) / 4;
									//console.log("topping 6-premium"+v_dptp + " "+ (toppingqty-toppingincqty));

								}
								else {
									v_dptp = v_dptp + (toppingqty - toppingincqty) * (toppingbaseprice - toppingprice);
									//console.log("topping 7-premium"+v_dptp + " "+ (toppingqty-toppingincqty));

								}
								//console.log("topping 5-premium"+v_dptp + " "+ (toppingqty-toppingincqty));
							}
							else {
								var pricingRule = {};
								pricingRule.includedQty = toppingcatqty;
								pricingRule.selectedQty = 0;
								pricingRule.maxPrice = toppingprice;

								pricingrulesarr[toppingcat] = pricingRule;
							}
							//		v_stc=v_stc+Math.round((toppingqty-toppingincqty)*100)/100;
						}
					}
					if (!this.isEmpty(pricingrulesarr[toppingcat])) {
						if (pricingrulesarr[toppingcat].maxPrice < toppingprice) {
							pricingrulesarr[toppingcat].maxPrice = toppingprice;	//set the max price
							this.itemValidation.ToppingPrice = toppingprice;
						}

					}
					//save the pricingrulesarr if current product is the 1st twin
					//this will be used when price calculation is done for both the twins
					this.itemValidation.PricingRulesArray = pricingrulesarr;
					/*Update ends*/
				}

				//Defined but not Option Concept
				if (toppingcat == 0 && toppingincqty > 0) {
					if ((toppingqty - toppingincqty) > 0) {
						v_dstp = v_dstp + Math.round((toppingqty - toppingincqty) * toppingprice);
						v_dptp = v_dptp + toppingqty * (toppingbaseprice - toppingprice);
					}
				}
				//if(toppingcnt==0)
				if (toppingcat == 0 && toppingincqty == 0) {
					if (this.itemRules1.ItemRuleArray[1].substring(0, 4) == "twin") {
						v_nstp = v_nstp + (Math.ceil(toppingqty / 2, 2) * toppingprice);
						v_dptp = v_dptp + toppingqty / 4 * (toppingbaseprice - toppingprice);
						//console.log("topping 1-premium"+v_dptp);
					}
					else {
						// Gray Area of Issue with Build Your Pizza. (Discuss with Paul.).
						v_nstp = v_nstp + (Math.round(toppingqty) * toppingprice);
						v_dptp = v_dptp + toppingqty * (toppingbaseprice - toppingprice);
						//console.log("topping 2-premium"+v_dptp);
					}
				}
				if (item_type == 'G') {
					if (toppingcnt > 0) {
						//Refer CUR_RSFTC
						v_rsftc = v_rsftc + toppingcnt; // topping count
						//REFER CUR_STC
						v_sftc = v_sftc + toppingscnt //standard topping count
						//REFER CUR_NSTP
						if (toppingcnt > 1) {
							v_nsftp = v_nsftp + ((toppingqty - 1) * toppingprice);
							v_dptp = v_dptp + (toppingqty - 1) * (toppingbaseprice - toppingprice);
							//console.log("topping 3-premium"+v_dptp);
						}

					}
				}
				if ((ingcnt + 1) == this.validationParameters.IngRecordArray.length) {
					this.itemValidation.LastIngredientPrice = toppingprice;
				}
				this.itemValidation.v_dptp = v_dptp;
				//console.log("topping -premium"+v_dptp);
			}
		}

		//var currentprice=parseFloat(record.data.BasePrice);
		var currentprice = parseFloat(this.itemRules.ItemRuleArray[2]) + v_dptp;

		this.itemValidation.ErrorCode = "";
		this.itemValidation.ErrorMessage = "";
		this.itemValidation.CallToAction = "";
		//this.f_calculate_price(currentprice,v_chargeable_toppings,v_max_price,v_nstp,v_nsftp,item_type,v_dstp)
		this.f_calculate_price(currentprice, pricingrulesarr, v_max_price, v_nstp, v_nsftp, item_type, v_dstp, ptype)
	},
	f_calculate_price: function (v_base_price, pricingrulesarr, v_max_price, v_nstp, v_nsftp, item_type, v_dstp, ptype) {
		var v_price = 0.0;
		var p_chargeabletop = 0;
		this.itemValidation.NSTP = 0;
		console.info(ptype);
		if (ptype == "twin1" || ptype == "twin2") {
			this.itemValidation.NSTP = v_nstp;
			this.itemValidation.ItemPrice = parseFloat(v_base_price + v_dstp);
		}
		else {
			if (this.validationParameters.ItemType == 'G') {
				this.itemValidation.NSTP = v_nstp;
				for (var index in pricingrulesarr) {
					p_chargeabletop = Math.ceil(pricingrulesarr[index].selectedQty, 2) - pricingrulesarr[index].includedQty;
					if (p_chargeabletop > 0) {
						v_price = v_price + (p_chargeabletop * pricingrulesarr[index].maxPrice);
					}
				}
				this.itemValidation.ItemPrice = parseFloat(v_base_price + v_price + v_nstp + v_nsftp + v_dstp);
			}
			else {
				this.itemValidation.NSTP = v_nstp;
				for (var index in pricingrulesarr) {
					p_chargeabletop = Math.ceil(pricingrulesarr[index].selectedQty, 2) - pricingrulesarr[index].includedQty;
					if (p_chargeabletop > 0) {
						v_price = v_price + (p_chargeabletop * pricingrulesarr[index].maxPrice);
					}
					//console.log('pricingrulesarr[index].maxPrice');
					//console.log(pricingrulesarr[index].maxPrice);
					//console.log('p_chargeabletop');
					//console.log(p_chargeabletop);
					//console.log('v_price');
					//console.log(v_price);
				}
				this.itemValidation.ItemPrice = parseFloat(v_base_price + v_price + v_nstp + v_dstp);
			}
		}
		//console.log("this.itemValidation.ItemPrice"+this.itemValidation.ItemPrice);
	},
	check_free_component: function (v_fts, v_ntc, v_ftc) {

		console.log('>>>');

		
		if (v_fts == 'Exact') {
			if (v_ntc < v_ftc) {
				this.itemValidation.ErrorCode = '131';
				this.itemValidation.ErrorMessage = lang.pconfig['Add'] + " " + (v_ftc - v_ntc) + " " + lang.pconfig['more choice(s)'];
				this.itemValidation.CallToAction = "For {ProductDescription} you are required to select " + (v_ftc - v_ntc) + " choice(s)";  //mobile
				return true;
			} else {
				if ((v_ntc - v_ftc) > 0) {
					this.itemValidation.ErrorCode = '131';
					this.itemValidation.ErrorMessage = lang.pconfig['Please remove'] + " " + (v_ntc - v_ftc) + " " + lang.pconfig['choice(s)'];
					return false;
				}
				else
					return true;
			}
		}
		if (v_fts == 'ExactPlus' || v_fts == 'Inform') {
			if (v_ntc < v_ftc) {
				this.itemValidation.ErrorCode = '133';
				this.itemValidation.ErrorMessage = lang.pconfig['Add'] + " " + (v_ftc - v_ntc) + " " + lang.pconfig['more choice(s)'];
				this.itemValidation.CallToAction = "For {ProductDescription} you are required to select " + (v_ftc - v_ntc) + " choice(s)";  //mobile
				return true;
			}
		}
		return true;
	}
}