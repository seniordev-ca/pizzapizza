
const comboTestSuitePricing = {
	testSuiteName: 'Mega Munch Combo',
	productSlug: 'mega-munch-combo_11618',
	testCases: [
		{
			testCaseName: 'Empty cart',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [{
					product_id: 'combo_11618',
					quantity: 1,
					product_option_id: 2921,
					config_options: [],
					line_id: 3,
					child_items: [

					]
				}]

			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 24.99,
				"productCalories": '600 to 1040 Cals/serving, serves 5',
				"validation": {
					"isConfigValid": false,
					"children": {
						"1": {
							"isConfigValid": true,
							"validationMsg": "Choose 3 TOPPINGS",
							"configurations": {
								"specialinstructions": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"freetoppings": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"toppings": {
									"hasIncludedOptions": true,
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"doughsaucecheese": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"5": {
							"isConfigValid": false,
							"validationMsg": "Choose 4 DRINKS",
							"configurations": {
								"drinks": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"3": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								},
								"classicbreaded": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"4": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"2": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": [3, 2, 1, 4, 5],
					"validationMsg": "There are one or more items requiring configuration."
				}
			}
		},

		{
			testCaseName: 'Not Valid add to cart request with empty children product and 2x quantity should give double price',
			addToCartRequest: {
				"store_id": 117,
				"is_delivery": true,
				"products": [{
					"product_id": "combo_11618",
					"product_option_id": 0,
					"quantity": 2,
					"child_items": [
					],
					"config_options": [
	
					]
				}]

			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 49.98,
				"productCalories": '600 to 1040 Cals/serving, serves 5',
				"validation": {
					"isConfigValid": false,
					"children": {
						"1": {
							"isConfigValid": true,
							"validationMsg": "Choose 3 TOPPINGS",
							"configurations": {
								"specialinstructions": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"freetoppings": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"toppings": {
									"hasIncludedOptions": true,
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"doughsaucecheese": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"5": {
							"isConfigValid": false,
							"validationMsg": "Choose 4 DRINKS",
							"configurations": {
								"drinks": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"3": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								},
								"classicbreaded": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"4": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"2": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": [
						1, 2, 3, 4, 5
					],
					"validationMsg": "There are one or more items requiring configuration."
				}
			}
		},
		{
			testCaseName: 'Not valid add to cart request. pizza is XL and chicken bites configured. price should be 28 CAD',
			addToCartRequest:{
				store_id: 117,
				is_delivery: true,
				products: [
				  {
					product_id: 'combo_11618',
					quantity: 1,
					product_option_id: 0,
					config_options: [],
					child_items: [
					  {
						product_id: 'template',
						quantity: 1,
						config_options: [
						  {
							config_code: 'RD',
							direction: 'whole',
							quantity: 1
						  },
						  {
							config_code: 'MZ',
							direction: 'whole',
							quantity: 1
						  },
						  {
							config_code: 'SH',
							direction: 'whole',
							quantity: 1
						  }
						],
						product_option_id: 3447,
						line_id: 1
					  },
					  {
						product_id: '8694',
						quantity: 1,
						config_options: [
						  {
							config_code: 'CJ',
							direction: 'whole',
							quantity: 1
						  }
						],
						product_option_id: 8694,
						line_id: 4
					  }
					]
				  }
				]
			  },
			  expectedJsResults: {
				"errorCode": 0,
				"productPrice": 28.49,
				"productCalories": "590 to 990 Cals/serving, serves 6",
				"validation": {
				  "isConfigValid": false,
				  "children": {
					"1": {
					  "isConfigValid": true,
					  "validationMsg": "Choose 3 TOPPINGS",
					  "configurations": {
						"specialinstructions": {
						  "isSelectionRequired": false,
						  "isMaximumAmountReached": false
						},
						"freetoppings": {
						  "isSelectionRequired": false,
						  "isMaximumAmountReached": false
						},
						"toppings": {
						  "hasIncludedOptions": true,
						  "isSelectionRequired": false,
						  "isMaximumAmountReached": false
						},
						"doughsaucecheese": {
						  "isSelectionRequired": false,
						  "isMaximumAmountReached": false
						}
					  },
					  "isNotApplicable": false
					},
					"2": {
					  "isConfigValid": false,
					  "validationMsg": "Choose 1 DIPPING SAUCE",
					  "configurations": {
						"dippingsauce": {
						  "isSelectionRequired": true,
						  "isMaximumAmountReached": false
						}
					  },
					  "isNotApplicable": false
					},
					"3": {
					  "isConfigValid": true,
					  "validationMsg": "",
					  "configurations": {
						"dippingsauce": {
						  "isSelectionRequired": true,
						  "isMaximumAmountReached": false
						},
						"classicbreaded": {
						  "isSelectionRequired": false,
						  "isMaximumAmountReached": false
						}
					  },
					  "isNotApplicable": true
					},
					"4": {
					  "isConfigValid": true,
					  "validationMsg": "",
					  "configurations": {
						"dippingsauce": {
						  "isSelectionRequired": false,
						  "isMaximumAmountReached": false
						}
					  },
					  "isNotApplicable": false
					},
					"5": {
					  "isConfigValid": false,
					  "validationMsg": "Choose 4 DRINKS",
					  "configurations": {
						"drinks": {
						  "isSelectionRequired": true,
						  "isMaximumAmountReached": false
						}
					  },
					  "isNotApplicable": false
					}
				  },
				  "notConfiguredLineIds": [
					2,
					5
				  ],
				  "validationMsg": "There are one or more items requiring configuration."
				}
			  }
		},
		{
			testCaseName: 'Validation for ONLY pizza in cart  with 3 BO toppings and 1 JP topping',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products:[{
					product_id: 'combo_11618',
					quantity: 1,
					product_option_id: 2921,
					config_options: [],
					line_id: 1,
					child_items: [
						{
							product_id: 'template',
							quantity: 1,
							config_options: [
								{
									config_code: 'BO',
									direction: 'whole',
									quantity: 3
								},
								{
									config_code: 'JP',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'RD',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'MZ',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'SH',
									direction: 'whole',
									quantity: 1
								}
							],
							product_option_id: 2921,
							line_id: 1
						}
					]
				}]

			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 26.84,
				"productCalories": "600 to 1040 Cals/serving, serves 5",
				"validation": {
				  "isConfigValid": false,
				  "children": {
					"1": {
					  "isConfigValid": true,
					  "validationMsg": "",
					  "configurations": {
						"specialinstructions": {
						  "isSelectionRequired": false,
						  "isMaximumAmountReached": false
						},
						"freetoppings": {
						  "isSelectionRequired": false,
						  "isMaximumAmountReached": false
						},
						"toppings": {
						  "isSelectionRequired": false,
						  "isMaximumAmountReached": false
						},
						"doughsaucecheese": {
						  "isSelectionRequired": false,
						  "isMaximumAmountReached": false
						}
					  },
					  "isNotApplicable": false
					},
					"5": {
					  "isConfigValid": false,
					  "validationMsg": "Choose 4 DRINKS",
					  "configurations": {
						"drinks": {
						  "isSelectionRequired": true,
						  "isMaximumAmountReached": false
						}
					  },
					  "isNotApplicable": false
					},
					"3": {
					  "isConfigValid": false,
					  "validationMsg": "Choose 1 DIPPING SAUCE",
					  "configurations": {
						"dippingsauce": {
						  "isSelectionRequired": true,
						  "isMaximumAmountReached": false
						},
						"classicbreaded": {
						  "isSelectionRequired": false,
						  "isMaximumAmountReached": false
						}
					  },
					  "isNotApplicable": false
					},
					"4": {
					  "isConfigValid": false,
					  "validationMsg": "Choose 1 DIPPING SAUCE",
					  "configurations": {
						"dippingsauce": {
						  "isSelectionRequired": true,
						  "isMaximumAmountReached": false
						}
					  },
					  "isNotApplicable": false
					},
					"2": {
					  "isConfigValid": false,
					  "validationMsg": "Choose 1 DIPPING SAUCE",
					  "configurations": {
						"dippingsauce": {
						  "isSelectionRequired": true,
						  "isMaximumAmountReached": false
						}
					  },
					  "isNotApplicable": false
					}
				  },
				  "notConfiguredLineIds": [
					2, 3, 4, 5 
				  ],
				  "validationMsg": "There are one or more items requiring configuration."
				}
			  }
		},
		{
			testCaseName: 'Validation for ONLY Extra Large pizza in cart  with 4 regular different toppings. (one topping over included quantity is 2.05 CAD. Price should be 30.05)',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products:[{
					product_id: 'combo_11618',
					quantity: 1,
					product_option_id: 3447,
					config_options: [],
					line_id: 1,
					child_items: [
						{
							product_id: 'template',
							quantity: 1,
							config_options: [
								{
									config_code: 'BO',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'JP',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'BR',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'RP',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'RD',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'MZ',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'SH',
									direction: 'whole',
									quantity: 1
								}
							],
							product_option_id: 3447,
							line_id: 1
						}
					]
				}]

			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 30.54,
				"productCalories": '590 to 990 Cals/serving, serves 6',
				"validation": {
					"isConfigValid": false,
					"children": {
						"1": {
							"isConfigValid": true,
							"validationMsg": "",
							"configurations": {
								"specialinstructions": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"freetoppings": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"toppings": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"doughsaucecheese": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"5": {
							"isConfigValid": false,
							"validationMsg": "Choose 4 DRINKS",
							"configurations": {
								"drinks": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"3": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								},
								"classicbreaded": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"4": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"2": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": [
						2, 3, 4, 5
					],
					"validationMsg": "There are one or more items requiring configuration."
				}
			}
		},
		{
			testCaseName: 'Valid add to cart request',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [
					{
						product_id: 'combo_11618',
						quantity: 1,
						product_option_id: 0,
						config_options: [],
						child_items: [
							{
								product_id: 'template',
								quantity: 1,
								config_options: [
									{
										config_code: 'CI',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'BO',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'BR',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'MZ',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'RD',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'SH',
										direction: 'whole',
										quantity: 1
									}
								],
								product_option_id: 2921,
								line_id: 1
							},
							{
								product_id: '1961',
								quantity: 1,
								config_options: [
									{
										config_code: 'BC',
										direction: 'whole',
										quantity: 1
									}
								],
								product_option_id: 1961,
								line_id: 2
							},
							{
								product_id: '8694',
								quantity: 1,
								config_options: [
									{
										config_code: 'BC',
										direction: 'whole',
										quantity: 1
									}
								],
								product_option_id: 8694,
								line_id: 4
							},
							{
								product_id: '5359',
								quantity: 1,
								config_options: [
									{
										config_code: 'BI',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'CC',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'CS',
										direction: 'whole',
										quantity: 1
									},
									{
										config_code: 'CZ',
										direction: 'whole',
										quantity: 1
									}
								],
								product_option_id: 5359,
								line_id: 5
							}
						]
					}
				]
},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 24.99,
				"productCalories": "600 to 1040 Cals/serving, serves 5",
				"validation": {
				  "isConfigValid": true,
				  "children": {
					"1": {
					  "isConfigValid": true,
					  "validationMsg": "",
					  "configurations": {
						"specialinstructions": {
						  "isSelectionRequired": false,
						  "isMaximumAmountReached": false
						},
						"freetoppings": {
						  "isSelectionRequired": false,
						  "isMaximumAmountReached": false
						},
						"toppings": {
						  "isSelectionRequired": false,
						  "isMaximumAmountReached": false
						},
						"doughsaucecheese": {
						  "isSelectionRequired": false,
						  "isMaximumAmountReached": false
						}
					  },
					  "isNotApplicable": false
					},
					"2": {
					  "isConfigValid": true,
					  "validationMsg": "",
					  "configurations": {
						"dippingsauce": {
						  "isSelectionRequired": false,
						  "isMaximumAmountReached": false
						}
					  },
					  "isNotApplicable": false
					},
					"3": {
					  "isConfigValid": true,
					  "validationMsg": "",
					  "configurations": {
						"dippingsauce": {
						  "isSelectionRequired": true,
						  "isMaximumAmountReached": false
						},
						"classicbreaded": {
						  "isSelectionRequired": false,
						  "isMaximumAmountReached": false
						}
					  },
					  "isNotApplicable": true
					},
					"4": {
					  "isConfigValid": true,
					  "validationMsg": "",
					  "configurations": {
						"dippingsauce": {
						  "isSelectionRequired": false,
						  "isMaximumAmountReached": false
						}
					  },
					  "isNotApplicable": false
					},
					"5": {
					  "isConfigValid": true,
					  "validationMsg": "",
					  "configurations": {
						"drinks": {
						  "isSelectionRequired": false,
						  "isMaximumAmountReached": true
						}
					  },
					  "isNotApplicable": false
					}
				  },
				  "notConfiguredLineIds": []
				}
			  }
		},



		{
			testCaseName: 'Missing child items array or wrong array length should give error code 25',
			addToCartRequest: {
				"store_id": 117,
				"is_delivery": true,
				"products": [{
					"product_id": "combo_11618",
					"product_option_id": 0,
					"quantity": 1,
					"config_options": [
	
					]
				}]
 
			},
			expectedJsResults: {
				errorCode: 25,
				errorMessage: 'Missing child items array or wrong array length',
				debugErrorMessage: '{"child_items_len":null,"js_data_products_len":5}'
			}
		},



		{
			testCaseName: 'ExtraLarge Pizza (line_id=1) chosen for combo. Price should be 28 CAD. Other Items are not configured',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [{
					product_id: 'combo_11618',
					quantity: 1,
					product_option_id: 3447,
					config_options: [],
					line_id: 1,
					child_items: [
						{
							product_id: 'template',
							quantity: 1,
							config_options: [
								{
									config_code: 'RD',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'MZ',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'SH',
									direction: 'whole',
									quantity: 1
								}
							],
							product_option_id: 3447,
							line_id: 1
						}
					]
				}]

			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 28.49,
				"productCalories": "590 to 990 Cals/serving, serves 6",
				"validation": {
					"isConfigValid": false,
					"children": {
						"1": {
							"isConfigValid": true,
							"validationMsg": "Choose 3 TOPPINGS",
							"configurations": {
								"specialinstructions": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"freetoppings": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"toppings": {
									"hasIncludedOptions": true,
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"doughsaucecheese": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"5": {
							"isConfigValid": false,
							"validationMsg": "Choose 4 DRINKS",
							"configurations": {
								"drinks": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"3": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								},
								"classicbreaded": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"4": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"2": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": [
						2, 3, 4, 5 
					],
					"validationMsg": "There are one or more items requiring configuration."
				}
			}
		},
		{
			testCaseName: 'Adding one "extra charge" topping to pizza. Price should increase to 25.50. Other Items are not configured.',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [{
					product_id: 'combo_11618',
					quantity: 1,
					product_option_id: 2921,
					config_options: [],
					line_id: 1,
					child_items: [
						{
							product_id: 'template',
							quantity: 1,
							config_options: [
								{
									config_code: 'BG',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'BO',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'JP',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'RD',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'MZ',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'SH',
									direction: 'whole',
									quantity: 1
								}
							],
							product_option_id: 2921,
							line_id: 1
						}
					]
				}]
 
			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 25.99,
				"productCalories": "600 to 1040 Cals/serving, serves 5",
				"validation": {
					"isConfigValid": false,
					"children": {
						"1": {
							"isConfigValid": true,
							"validationMsg": "",
							"configurations": {
								"specialinstructions": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"freetoppings": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"toppings": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"doughsaucecheese": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"5": {
							"isConfigValid": false,
							"validationMsg": "Choose 4 DRINKS",
							"configurations": {
								"drinks": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"3": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								},
								"classicbreaded": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"4": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"2": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": [
						2, 3, 4, 5
					],
					"validationMsg": "There are one or more items requiring configuration."
				}
			}

		},
		{
			testCaseName: 'Adding same"extra charge" topping in quantity of 2 to pizza. Price should increase to 26.50. Other items not configured',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products:[{
					product_id: 'combo_11618',
					quantity: 1,
					product_option_id: 2921,
					config_options: [],
					line_id: 1,
					child_items: [
						{
							product_id: 'template',
							quantity: 1,
							config_options: [
								{
									config_code: 'BG',
									direction: 'whole',
									quantity: 2
								},
								{
									config_code: 'BO',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'RD',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'MZ',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'SH',
									direction: 'whole',
									quantity: 1
								}
							],
							product_option_id: 2921,
							line_id: 1
						}
					]
				}]

			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 26.99,
				"productCalories": "600 to 1040 Cals/serving, serves 5",
				"validation": {
					"isConfigValid": false,
					"children": {
						"1": {
							"isConfigValid": true,
							"validationMsg": "",
							"configurations": {
								"specialinstructions": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"freetoppings": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"toppings": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"doughsaucecheese": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"5": {
							"isConfigValid": false,
							"validationMsg": "Choose 4 DRINKS",
							"configurations": {
								"drinks": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"3": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								},
								"classicbreaded": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"4": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"2": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": [
						2, 3, 4, 5
					],
					"validationMsg": "There are one or more items requiring configuration."
				}
			}
		},
		{
			testCaseName: ' 6 different regular half toppings are added. Price should be 24.50',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products:[{
					product_id: 'combo_11618',
					quantity: 1,
					product_option_id: 0,
					config_options: [],
					child_items: [
						{
							product_id: 'template',
							quantity: 1,
							config_options: [
								{
									config_code: 'CI',
									direction: 'right',
									quantity: 1
								},
								{
									config_code: 'BO',
									direction: 'right',
									quantity: 1
								},
								{
									config_code: 'BR',
									direction: 'right',
									quantity: 1
								},
								{
									config_code: 'CI',
									direction: 'right',
									quantity: 1
								},
								{
									config_code: 'FM',
									direction: 'right',
									quantity: 1
								},
								{
									config_code: 'GO',
									direction: 'right',
									quantity: 1
								},
								{
									config_code: 'MZ',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'RD',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'SH',
									direction: 'whole',
									quantity: 1
								}
							],
							product_option_id: 2921,
							line_id: 1
						}
					]
				}]

			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 24.99,
				"productCalories": "600 to 1040 Cals/serving, serves 5",
				"validation": {
					"isConfigValid": false,
					"children": {
						"1": {
							"isConfigValid": true,
							"validationMsg": "",
							"configurations": {
								"specialinstructions": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"freetoppings": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"toppings": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"doughsaucecheese": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"5": {
							"isConfigValid": false,
							"validationMsg": "Choose 4 DRINKS",
							"configurations": {
								"drinks": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"3": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								},
								"classicbreaded": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"4": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"2": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": [
						2, 3, 4, 5
					],
					"validationMsg": "There are one or more items requiring configuration."
				}
			}
		},
		{
			testCaseName: '6 halfs of premium toppings. Price should be 27.50',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products:[{
					product_id: 'combo_11618',
					quantity: 1,
					product_option_id: 0,
					config_options: [],
					child_items: [
						{
							product_id: 'template',
							quantity: 1,
							config_options: [
								{
									config_code: 'BG',
									direction: 'right',
									quantity: 1
								},
								{
									config_code: 'CH',
									direction: 'right',
									quantity: 1
								},
								{
									config_code: 'KQ',
									direction: 'right',
									quantity: 1
								},
								{
									config_code: 'MC',
									direction: 'right',
									quantity: 1
								},
								{
									config_code: 'MK',
									direction: 'right',
									quantity: 1
								},
								{
									config_code: 'MZ',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'RD',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'SH',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'SK',
									direction: 'right',
									quantity: 1
								}
							],
							product_option_id: 2931,
							line_id: 1
						}
					]
				}]

			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 27.99,
				"productCalories": "630 to 1240 Cals/serving, serves 3",
				"validation": {
					"isConfigValid": false,
					"children": {
						"1": {
							"isConfigValid": true,
							"validationMsg": "",
							"configurations": {
								"specialinstructions": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"freetoppings": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"toppings": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"doughsaucecheese": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"5": {
							"isConfigValid": false,
							"validationMsg": "Choose 4 DRINKS",
							"configurations": {
								"drinks": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"3": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								},
								"classicbreaded": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"4": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"2": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": [
						2, 3, 4, 5
					],
					"validationMsg": "There are one or more items requiring configuration."
				}
			}
		},
		{
			testCaseName: ' 2 halfs of regular toppings and 4 halfs of premium toppings. Price should be 26.50',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products:[{
					product_id: 'combo_11618',
					quantity: 1,
					product_option_id: 0,
					config_options: [],
					child_items: [
						{
							product_id: 'template',
							quantity: 1,
							config_options: [
								{
									config_code: 'CI',
									direction: 'left',
									quantity: 1
								},
								{
									config_code: 'BG',
									direction: 'right',
									quantity: 1
								},
								{
									config_code: 'BO',
									direction: 'left',
									quantity: 1
								},
								{
									config_code: 'MC',
									direction: 'right',
									quantity: 1
								},
								{
									config_code: 'MK',
									direction: 'right',
									quantity: 1
								},
								{
									config_code: 'MZ',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'RD',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'SH',
									direction: 'whole',
									quantity: 1
								},
								{
									config_code: 'SK',
									direction: 'right',
									quantity: 1
								}
							],
							product_option_id: 2921,
							line_id: 1
						}
					]
				}]

			},
			expectedJsResults: {
				"errorCode": 0,
				"productPrice": 26.99,
				"productCalories": "600 to 1040 Cals/serving, serves 5",
				"validation": {
					"isConfigValid": false,
					"children": {
						"1": {
							"isConfigValid": true,
							"validationMsg": "",
							"configurations": {
								"specialinstructions": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"freetoppings": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"toppings": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								},
								"doughsaucecheese": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"5": {
							"isConfigValid": false,
							"validationMsg": "Choose 4 DRINKS",
							"configurations": {
								"drinks": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"3": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								},
								"classicbreaded": {
									"isSelectionRequired": false,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"4": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						},
						"2": {
							"isConfigValid": false,
							"validationMsg": "Choose 1 DIPPING SAUCE",
							"configurations": {
								"dippingsauce": {
									"isSelectionRequired": true,
									"isMaximumAmountReached": false
								}
							},
							"isNotApplicable": false
						}
					},
					"notConfiguredLineIds": [
						2, 3, 4, 5
					],
					"validationMsg": "There are one or more items requiring configuration."
				}
			}
		}
	]
}

describe(`Test suite: ${comboTestSuitePricing.testSuiteName}`, () => {

	let productSlug = comboTestSuitePricing.productSlug;
	let currentProductConfig = null;
	/**
	 * Fetch product config from local data fetched by nodeJs script before testing
	 */
	before(() => {
		const isServer = typeof window === 'undefined';
		if (isServer) {
			require(`../dist/pp-sdk-bundle`);
			return new Promise((resolve) => {
				currentProductConfig = require(`../unit-tests-infrastructure/server-data/${productSlug}.json`);
				const chai = require('chai');
				expect = chai.expect;    // Using Expect style
				resolve();
			})
		} else {
			return new Promise((resolve) => {
				$.get(`unit-tests-infrastructure/server-data/${productSlug}.json`, (data) => {
					currentProductConfig = data;
					resolve();
				});
			})
		}
	});

	/**
	 * Passing product config to SDK
	 * SDK should return success message
	 */
	it(`Initiating SDK for product`, () => {
		const sdkResult = ppSdk.initProduct(currentProductConfig.js_data, 'web', 'en');
		const expectedJsResponse = {
			errorCode: 0
		};
		expect(expectedJsResponse).to.deep.equal(sdkResult);
	});

	/**
	 * Test every addToCart <-> expected results pairs for current product
	 */
	comboTestSuitePricing.testCases.forEach((testCase) => {
		const addToCartRequest = testCase.addToCartRequest;
		const expectedJsResults = testCase.expectedJsResults;
		it(`Test case: ${testCase.testCaseName}`, () => {
			const sdkResult = ppSdk.getProductInfo(addToCartRequest);

			expect(sdkResult).to.deep.equal(expectedJsResults);
		})
	});
})

