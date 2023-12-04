const comboTestSuite = {
	testSuiteName: 'Mega munch combo validation test',
	productSlug: 'mega-munch-combo_11618',
	testCases: [
		// {
		// 	testCaseName: 'Empty cart',
		// 	addToCartRequest: {
		// 		store_id: 117,
		// 		is_delivery: true,
		// 		products: [{
		// 			product_id: 'combo_11618',
		// 			quantity: 1,
		// 			product_option_id: 2921,
		// 			config_options: [],
		// 			line_id: 3,
		// 			child_items: [

		// 			]
		// 		}]

		// 	},
		// 	expectedJsResults: {
		// 		"errorCode": 0,
		// 		"productPrice": 24.99,
		// 		"productCalories": '600 to 1040 Cals/serving, serves 5',
		// 		"validation": {
		// 			"isConfigValid": false,
		// 			"children": {
		// 				"1": {
		// 					"isConfigValid": true,
		// 					"validationMsg": "Choose 3 TOPPINGS",
		// 					"configurations": {
		// 						"specialinstructions": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"freetoppings": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"toppings": {
		// 							"hasIncludedOptions": true,
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"doughsaucecheese": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						}
		// 					},
		// 					"isNotApplicable": false
		// 				},
		// 				"5": {
		// 					"isConfigValid": false,
		// 					"validationMsg": "Choose 4 DRINKS",
		// 					"configurations": {
		// 						"drinks": {
		// 							"isSelectionRequired": true,
		// 							"isMaximumAmountReached": false
		// 						}
		// 					},
		// 					"isNotApplicable": false
		// 				},
		// 				"3": {
		// 					"isConfigValid": false,
		// 					"validationMsg": "Choose 1 DIPPING SAUCE",
		// 					"configurations": {
		// 						"dippingsauce": {
		// 							"isSelectionRequired": true,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"classicbreaded": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						}
		// 					},
		// 					"isNotApplicable": false
		// 				},
		// 				"4": {
		// 					"isConfigValid": false,
		// 					"validationMsg": "Choose 1 DIPPING SAUCE",
		// 					"configurations": {
		// 						"dippingsauce": {
		// 							"isSelectionRequired": true,
		// 							"isMaximumAmountReached": false
		// 						}
		// 					},
		// 					"isNotApplicable": false
		// 				},
		// 				"2": {
		// 					"isConfigValid": false,
		// 					"validationMsg": "Choose 1 DIPPING SAUCE",
		// 					"configurations": {
		// 						"dippingsauce": {
		// 							"isSelectionRequired": true,
		// 							"isMaximumAmountReached": false
		// 						}
		// 					},
		// 					"isNotApplicable": false
		// 				}
		// 			},
		// 			"notConfiguredLineIds": [
		// 				3,
		// 				2,
		// 				1,
		// 				4,
		// 				5
		// 			],
		// 			"validationMsg": "There are one or more items requiring configuration."
		// 		}
		// 	}
		// }, // Not Valid add to cart request with empty fields product
		// {
		// 	testCaseName: 'Not Valid add to cart request with only one Dipping Sauce Configured',
		// 	addToCartRequest: {
		// 		store_id: 117,
		// 		is_delivery: true,
		// 		products: [{
		// 			product_id: 'combo_11618',
		// 			quantity: 1,
		// 			product_option_id: 0,
		// 			config_options: [],
		// 			child_items: [
		// 				{
		// 					product_id: '1961',
		// 					quantity: 1,
		// 					config_options: [
		// 						{
		// 							config_code: 'BC',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						}
		// 					],
		// 					product_option_id: 1961,
		// 					line_id: 2
		// 				}
		// 			]
		// 		}]

		// 	},
		// 	expectedJsResults: {
		// 		"errorCode": 0,
		// 		"productPrice": 24.99,
		// 		"productCalories": '600 to 1040 Cals/serving, serves 5',
		// 		"validation": {
		// 			"isConfigValid": false,
		// 			"children": {
		// 				"1": {
		// 					"isConfigValid": true,
		// 					"validationMsg": "Choose 3 TOPPINGS",
		// 					"configurations": {
		// 						"specialinstructions": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"freetoppings": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"toppings": {
		// 							"hasIncludedOptions": true,
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"doughsaucecheese": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						}
		// 					},
		// 					"isNotApplicable": false
		// 				},
		// 				"5": {
		// 					"isConfigValid": false,
		// 					"validationMsg": "Choose 4 DRINKS",
		// 					"configurations": {
		// 						"drinks": {
		// 							"isSelectionRequired": true,
		// 							"isMaximumAmountReached": false
		// 						}
		// 					},
		// 					"isNotApplicable": false
		// 				},
		// 				"3": {
		// 					"isConfigValid": false,
		// 					"validationMsg": "Choose 1 DIPPING SAUCE",
		// 					"configurations": {
		// 						"dippingsauce": {
		// 							"isSelectionRequired": true,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"classicbreaded": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						}
		// 					},
		// 					"isNotApplicable": false
		// 				},
		// 				"2": {
		// 					"isConfigValid": true,
		// 					"validationMsg": "",
		// 					"configurations": {
		// 						"dippingsauce": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						}
		// 					},
		// 					"isNotApplicable": false
		// 				},
		// 				"4": {
		// 					"isConfigValid": false,
		// 					"validationMsg": "Choose 1 DIPPING SAUCE",
		// 					"configurations": {
		// 						"dippingsauce": {
		// 							"isSelectionRequired": true,
		// 							"isMaximumAmountReached": false
		// 						}
		// 					},
		// 					"isNotApplicable": false
		// 				}
		// 			},
		// 			"notConfiguredLineIds": [
		// 				1, 3, 4, 5
		// 			],
		// 			"validationMsg": "There are one or more items requiring configuration."
		// 		}
		// 	}
		// },
		// {
		// 	testCaseName: 'Not Valid add to cart request with only Configured Dipping Sauce and Chicken Bites',
		// 	addToCartRequest: {
		// 		store_id: 117,
		// 		is_delivery: true,
		// 		products: [{
		// 			product_id: 'combo_11618',
		// 			quantity: 1,
		// 			product_option_id: 0,
		// 			config_options: [],
		// 			child_items: [
		// 				{
		// 					product_id: '1961',
		// 					quantity: 1,
		// 					config_options: [
		// 						{
		// 							config_code: 'BC',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						}
		// 					],
		// 					product_option_id: 1961,
		// 					line_id: 2
		// 				},
		// 				{
		// 					product_id: '8694',
		// 					quantity: 1,
		// 					config_options: [
		// 						{
		// 							config_code: 'BC',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						}
		// 					],
		// 					product_option_id: 8694,
		// 					line_id: 4
		// 				}
		// 			]
		// 		}]

		// 	},
		// 	expectedJsResults: {
		// 		"errorCode": 0,
		// 		"productPrice": 24.99,
		// 		"productCalories": '600 to 1040 Cals/serving, serves 5',
		// 		"validation": {
		// 			"isConfigValid": false,
		// 			"children": {
		// 				"1": {
		// 					"isConfigValid": true,
		// 					"validationMsg": "Choose 3 TOPPINGS",
		// 					"configurations": {
		// 						"specialinstructions": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"freetoppings": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"toppings": {
		// 							"hasIncludedOptions": true,
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"doughsaucecheese": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						}
		// 					},
		// 					"isNotApplicable": false
		// 				},
		// 				"5": {
		// 					"isConfigValid": false,
		// 					"validationMsg": "Choose 4 DRINKS",
		// 					"configurations": {
		// 						"drinks": {
		// 							"isSelectionRequired": true,
		// 							"isMaximumAmountReached": false
		// 						}
		// 					},
		// 					"isNotApplicable": false
		// 				},
		// 				"3": {
		// 					"isConfigValid": true,
		// 					"validationMsg": "",
		// 					"configurations": {
		// 						"dippingsauce": {
		// 							"isSelectionRequired": true,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"classicbreaded": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						}
		// 					},
		// 					"isNotApplicable": true
		// 				},
		// 				"2": {
		// 					"isConfigValid": true,
		// 					"validationMsg": "",
		// 					"configurations": {
		// 						"dippingsauce": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						}
		// 					},
		// 					"isNotApplicable": false
		// 				},
		// 				"4": {
		// 					"isConfigValid": true,
		// 					"validationMsg": "",
		// 					"configurations": {
		// 						"dippingsauce": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						}
		// 					},
		// 					"isNotApplicable": false
		// 				}
		// 			},
		// 			"notConfiguredLineIds": [
		// 				1,
		// 				5
		// 			],
		// 			"validationMsg": "There are one or more items requiring configuration."
		// 		}
		// 	}
		// },
		{
			testCaseName: 'Valid add to cart request but pizza (line_id=1) is not configured. Message on front-end should pop up',
			addToCartRequest: {
				store_id: 117,
				is_delivery: true,
				products: [{
					product_id: 'combo_11618',
					quantity: 1,
					product_option_id: 0,
					config_options: [],
					child_items: [
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
				}]

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
				  "notConfiguredLineIds": [
					1
				  ]
				}
			  }

		},
		// {
		// 	testCaseName: 'Valid add to cart request. Pizza has only default toppings. Pizza(id: template) is at the end of the array',
		// 	addToCartRequest: {
		// 		store_id: 117,
		// 		is_delivery: true,
		// 		products: [{
		// 			product_id: 'combo_11618',
		// 			quantity: 1,
		// 			product_option_id: 0,
		// 			config_options: [],
		// 			child_items: [
		// 				{
		// 					product_id: '1961',
		// 					quantity: 1,
		// 					config_options: [
		// 						{
		// 							config_code: 'BC',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						}
		// 					],
		// 					product_option_id: 1961,
		// 					line_id: 2
		// 				},
		// 				{
		// 					product_id: '8694',
		// 					quantity: 1,
		// 					config_options: [
		// 						{
		// 							config_code: 'BC',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						}
		// 					],
		// 					product_option_id: 8694,
		// 					line_id: 4
		// 				},
		// 				{
		// 					product_id: '5359',
		// 					quantity: 1,
		// 					config_options: [
		// 						{
		// 							config_code: 'BI',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						},
		// 						{
		// 							config_code: 'CC',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						},
		// 						{
		// 							config_code: 'CS',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						},
		// 						{
		// 							config_code: 'CZ',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						}
		// 					],
		// 					product_option_id: 5359,
		// 					line_id: 5
		// 				},
		// 				{
		// 					product_id: 'template',
		// 					quantity: 1,
		// 					config_options: [
		// 						{
		// 							config_code: 'MZ',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						},
		// 						{
		// 							config_code: 'RD',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						},
		// 						{
		// 							config_code: 'SH',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						}
		// 					],
		// 					product_option_id: 2921,
		// 					line_id: 1
		// 				}
		// 			]

		// 		}]
		// 	},
		// 	expectedJsResults: {
		// 		"errorCode": 0,
		// 		"productPrice": 24.99,
		// 		"productCalories": "600 to 1040 Cals/serving, serves 5",
		// 		"validation": {
		// 		  "isConfigValid": true,
		// 		  "children": {
		// 			"1": {
		// 			  "isConfigValid": true,
		// 			  "validationMsg": "Choose 3 TOPPINGS",
		// 			  "configurations": {
		// 				"specialinstructions": {
		// 				  "isSelectionRequired": false,
		// 				  "isMaximumAmountReached": false
		// 				},
		// 				"freetoppings": {
		// 				  "isSelectionRequired": false,
		// 				  "isMaximumAmountReached": false
		// 				},
		// 				"toppings": {
		// 				  "hasIncludedOptions": true,
		// 				  "isSelectionRequired": false,
		// 				  "isMaximumAmountReached": false
		// 				},
		// 				"doughsaucecheese": {
		// 				  "isSelectionRequired": false,
		// 				  "isMaximumAmountReached": false
		// 				}
		// 			  },
		// 			  "isNotApplicable": false
		// 			},
		// 			"2": {
		// 			  "isConfigValid": true,
		// 			  "validationMsg": "",
		// 			  "configurations": {
		// 				"dippingsauce": {
		// 				  "isSelectionRequired": false,
		// 				  "isMaximumAmountReached": false
		// 				}
		// 			  },
		// 			  "isNotApplicable": false
		// 			},
		// 			"3": {
		// 			  "isConfigValid": true,
		// 			  "validationMsg": "",
		// 			  "configurations": {
		// 				"dippingsauce": {
		// 				  "isSelectionRequired": true,
		// 				  "isMaximumAmountReached": false
		// 				},
		// 				"classicbreaded": {
		// 				  "isSelectionRequired": false,
		// 				  "isMaximumAmountReached": false
		// 				}
		// 			  },
		// 			  "isNotApplicable": true
		// 			},
		// 			"4": {
		// 			  "isConfigValid": true,
		// 			  "validationMsg": "",
		// 			  "configurations": {
		// 				"dippingsauce": {
		// 				  "isSelectionRequired": false,
		// 				  "isMaximumAmountReached": false
		// 				}
		// 			  },
		// 			  "isNotApplicable": false
		// 			},
		// 			"5": {
		// 			  "isConfigValid": true,
		// 			  "validationMsg": "",
		// 			  "configurations": {
		// 				"drinks": {
		// 				  "isSelectionRequired": false,
		// 				  "isMaximumAmountReached": true
		// 				}
		// 			  },
		// 			  "isNotApplicable": false
		// 			}
		// 		  },
		// 		  "notConfiguredLineIds": []
		// 		}
		// 	  }
		// },
		// {
		// 	testCaseName: 'Valid add to cart request. Pizza has only default toppings. Pizza(id: template) is at the begining of the array',
		// 	addToCartRequest: {
		// 		store_id: 117,
		// 		is_delivery: true,
		// 		products: [{
		// 			product_id: 'combo_11618',
		// 			quantity: 1,
		// 			product_option_id: 0,
		// 			config_options: [],
		// 			child_items: [
		// 				{
		// 					product_id: 'template',
		// 					quantity: 1,
		// 					config_options: [
		// 						{
		// 							config_code: 'MZ',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						},
		// 						{
		// 							config_code: 'RD',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						},
		// 						{
		// 							config_code: 'SH',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						}
		// 					],
		// 					product_option_id: 2921,
		// 					line_id: 1
		// 				},
		// 				{
		// 					product_id: '1961',
		// 					quantity: 1,
		// 					config_options: [
		// 						{
		// 							config_code: 'BC',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						}
		// 					],
		// 					product_option_id: 1961,
		// 					line_id: 2
		// 				},
		// 				{
		// 					product_id: '8694',
		// 					quantity: 1,
		// 					config_options: [
		// 						{
		// 							config_code: 'BC',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						}
		// 					],
		// 					product_option_id: 8694,
		// 					line_id: 4
		// 				},
		// 				{
		// 					product_id: '5359',
		// 					quantity: 1,
		// 					config_options: [
		// 						{
		// 							config_code: 'BI',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						},
		// 						{
		// 							config_code: 'CC',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						},
		// 						{
		// 							config_code: 'CS',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						},
		// 						{
		// 							config_code: 'CZ',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						}
		// 					],
		// 					product_option_id: 5359,
		// 					line_id: 5
		// 				}
		// 			]

		// 		}]
		// 	},
		// 	expectedJsResults: {
		// 		"errorCode": 0,
		// 		"productPrice": 24.99,
		// 		"productCalories": "600 to 1040 Cals/serving, serves 5",
		// 		"validation": {
		// 		  "isConfigValid": true,
		// 		  "children": {
		// 			"1": {
		// 			  "isConfigValid": true,
		// 			  "validationMsg": "Choose 3 TOPPINGS",
		// 			  "configurations": {
		// 				"specialinstructions": {
		// 				  "isSelectionRequired": false,
		// 				  "isMaximumAmountReached": false
		// 				},
		// 				"freetoppings": {
		// 				  "isSelectionRequired": false,
		// 				  "isMaximumAmountReached": false
		// 				},
		// 				"toppings": {
		// 				  "hasIncludedOptions": true,
		// 				  "isSelectionRequired": false,
		// 				  "isMaximumAmountReached": false
		// 				},
		// 				"doughsaucecheese": {
		// 				  "isSelectionRequired": false,
		// 				  "isMaximumAmountReached": false
		// 				}
		// 			  },
		// 			  "isNotApplicable": false
		// 			},
		// 			"2": {
		// 			  "isConfigValid": true,
		// 			  "validationMsg": "",
		// 			  "configurations": {
		// 				"dippingsauce": {
		// 				  "isSelectionRequired": false,
		// 				  "isMaximumAmountReached": false
		// 				}
		// 			  },
		// 			  "isNotApplicable": false
		// 			},
		// 			"3": {
		// 			  "isConfigValid": true,
		// 			  "validationMsg": "",
		// 			  "configurations": {
		// 				"dippingsauce": {
		// 				  "isSelectionRequired": true,
		// 				  "isMaximumAmountReached": false
		// 				},
		// 				"classicbreaded": {
		// 				  "isSelectionRequired": false,
		// 				  "isMaximumAmountReached": false
		// 				}
		// 			  },
		// 			  "isNotApplicable": true
		// 			},
		// 			"4": {
		// 			  "isConfigValid": true,
		// 			  "validationMsg": "",
		// 			  "configurations": {
		// 				"dippingsauce": {
		// 				  "isSelectionRequired": false,
		// 				  "isMaximumAmountReached": false
		// 				}
		// 			  },
		// 			  "isNotApplicable": false
		// 			},
		// 			"5": {
		// 			  "isConfigValid": true,
		// 			  "validationMsg": "",
		// 			  "configurations": {
		// 				"drinks": {
		// 				  "isSelectionRequired": false,
		// 				  "isMaximumAmountReached": true
		// 				}
		// 			  },
		// 			  "isNotApplicable": false
		// 			}
		// 		  },
		// 		  "notConfiguredLineIds": []
		// 		}
		// 	  }
		// },
		// {
		// 	testCaseName: 'Not Valid add to cart request with only one Dipping Sauce Configured first and then Pizza Configured',
		// 	addToCartRequest: {
		// 		store_id: 117,
		// 		is_delivery: true,
		// 		products: [
		// 		  {
		// 			product_id: 'combo_11618',
		// 			quantity: 1,
		// 			product_option_id: 0,
		// 			config_options: [],
		// 			child_items: [
		// 			  {
		// 				product_id: 'template',
		// 				quantity: 1,
		// 				config_options: [
		// 				  {
		// 					config_code: 'RD',
		// 					direction: 'whole',
		// 					quantity: 1
		// 				  },
		// 				  {
		// 					config_code: 'SH',
		// 					direction: 'whole',
		// 					quantity: 1
		// 				  },
		// 				  {
		// 					config_code: 'MZ',
		// 					direction: 'whole',
		// 					quantity: 1
		// 				  },
		// 				  {
		// 					config_code: 'BO',
		// 					direction: 'whole',
		// 					quantity: 1
		// 				  }
		// 				],
		// 				product_option_id: 2921,
		// 				line_id: 1
		// 			  },
		// 			  {
		// 				product_id: '1961',
		// 				quantity: 1,
		// 				config_options: [
		// 				  {
		// 					config_code: 'BL',
		// 					direction: 'whole',
		// 					quantity: 1
		// 				  }
		// 				],
		// 				product_option_id: 1961,
		// 				line_id: 2
		// 			  }
		// 			]
		// 		  }
		// 		]
		// 	  },
		// 	expectedJsResults: {
		// 		"errorCode": 0,
		// 		"productPrice": 24.99,
		// 		"productCalories": "600 to 1040 Cals/serving, serves 5",
		// 		"validation": {
		// 		  "isConfigValid": false,
		// 		  "children": {
		// 			"1": {
		// 			  "isConfigValid": true,
		// 			  "validationMsg": "Choose 2 TOPPINGS",
		// 			  "configurations": {
		// 				"specialinstructions": {
		// 				  "isSelectionRequired": false,
		// 				  "isMaximumAmountReached": false
		// 				},
		// 				"freetoppings": {
		// 				  "isSelectionRequired": false,
		// 				  "isMaximumAmountReached": false
		// 				},
		// 				"toppings": {
		// 				  "hasIncludedOptions": true,
		// 				  "isSelectionRequired": false,
		// 				  "isMaximumAmountReached": false
		// 				},
		// 				"doughsaucecheese": {
		// 				  "isSelectionRequired": false,
		// 				  "isMaximumAmountReached": false
		// 				}
		// 			  },
		// 			  "isNotApplicable": false
		// 			},
		// 			"2": {
		// 			  "isConfigValid": true,
		// 			  "validationMsg": "",
		// 			  "configurations": {
		// 				"dippingsauce": {
		// 				  "isSelectionRequired": false,
		// 				  "isMaximumAmountReached": false
		// 				}
		// 			  },
		// 			  "isNotApplicable": false
		// 			},
		// 			"3": {
		// 			  "isConfigValid": false,
		// 			  "validationMsg": "Choose 1 DIPPING SAUCE",
		// 			  "configurations": {
		// 				"dippingsauce": {
		// 				  "isSelectionRequired": true,
		// 				  "isMaximumAmountReached": false
		// 				},
		// 				"classicbreaded": {
		// 				  "isSelectionRequired": false,
		// 				  "isMaximumAmountReached": false
		// 				}
		// 			  },
		// 			  "isNotApplicable": false
		// 			},
		// 			"4": {
		// 			  "isConfigValid": false,
		// 			  "validationMsg": "Choose 1 DIPPING SAUCE",
		// 			  "configurations": {
		// 				"dippingsauce": {
		// 				  "isSelectionRequired": true,
		// 				  "isMaximumAmountReached": false
		// 				}
		// 			  },
		// 			  "isNotApplicable": false
		// 			},
		// 			"5": {
		// 			  "isConfigValid": false,
		// 			  "validationMsg": "Choose 4 DRINKS",
		// 			  "configurations": {
		// 				"drinks": {
		// 				  "isSelectionRequired": true,
		// 				  "isMaximumAmountReached": false
		// 				}
		// 			  },
		// 			  "isNotApplicable": false
		// 			}
		// 		  },
		// 		  "notConfiguredLineIds": [
		// 			3,
		// 			4,
		// 			5
		// 		  ],
		// 		  "validationMsg": "There are one or more items requiring configuration."
		// 		}
		// 	  }
		// },
		// {
		// 	testCaseName: 'Valid add to cart request. Pizza has only default toppings.Extra instructions added for base cheese and sauce ',
		// 	addToCartRequest: {
		// 		store_id: 117,
		// 		is_delivery: true,
		// 		products: [{
		// 			product_id: 'combo_11618',
		// 			quantity: 1,
		// 			product_option_id: 0,
		// 			config_options: [],
		// 			child_items: [
		// 				{
		// 					product_id: '1961',
		// 					quantity: 1,
		// 					config_options: [
		// 						{
		// 							config_code: 'BC',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						}
		// 					],
		// 					product_option_id: 1961,
		// 					line_id: 2
		// 				},
		// 				{
		// 					product_id: '8694',
		// 					quantity: 1,
		// 					config_options: [
		// 						{
		// 							config_code: 'BC',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						}
		// 					],
		// 					product_option_id: 8694,
		// 					line_id: 4
		// 				},
		// 				{
		// 					product_id: '5359',
		// 					quantity: 1,
		// 					config_options: [
		// 						{
		// 							config_code: 'BI',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						},
		// 						{
		// 							config_code: 'CC',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						},
		// 						{
		// 							config_code: 'CS',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						},
		// 						{
		// 							config_code: 'CZ',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						}
		// 					],
		// 					product_option_id: 5359,
		// 					line_id: 5
		// 				},
		// 				{
		// 					product_id: 'template',
		// 					quantity: 1,
		// 					config_options: [
		// 						{
		// 							config_code: 'MZ',
		// 							direction: 'whole',
		// 							quantity: 1,
		// 							sub_config_option: 'CT'
		// 						},
		// 						{
		// 							config_code: 'RD',
		// 							direction: 'whole',
		// 							quantity: 1
		// 						},
		// 						{
		// 							config_code: 'SH',
		// 							direction: 'whole',
		// 							quantity: 1,
		// 							sub_config_option: 'YB'
		// 						}
		// 					],
		// 					product_option_id: 2921,
		// 					line_id: 1
		// 				}
		// 			]

		// 		}]
		// 	},
		// 	expectedJsResults: {
		// 		"errorCode": 0,
		// 		"productPrice": 24.99,
		// 		"productCalories": "600 to 1040 Cals/serving, serves 5",
		// 		"validation": {
		// 			"isConfigValid": true,
		// 			"children": {
		// 				"1": {
		// 					"isConfigValid": true,
		// 					"validationMsg": "Choose 3 TOPPINGS",
		// 					"configurations": {
		// 						"specialinstructions": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"freetoppings": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"toppings": {
		// 							"hasIncludedOptions": true,
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"doughsaucecheese": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						}
		// 					},
		// 					"isNotApplicable": false
		// 				},
		// 				"2": {
		// 					"isConfigValid": true,
		// 					"validationMsg": "",
		// 					"configurations": {
		// 						"dippingsauce": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						}
		// 					},
		// 					"isNotApplicable": false
		// 				},
		// 				"3": {
		// 					"isConfigValid": true,
		// 					"validationMsg": "",
		// 					"configurations": {
		// 						"dippingsauce": {
		// 							"isSelectionRequired": true,
		// 							"isMaximumAmountReached": false
		// 						},
		// 						"classicbreaded": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						}
		// 					},
		// 					"isNotApplicable": true
		// 				},
		// 				"4": {
		// 					"isConfigValid": true,
		// 					"validationMsg": "",
		// 					"configurations": {
		// 						"dippingsauce": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": false
		// 						}
		// 					},
		// 					"isNotApplicable": false
		// 				},
		// 				"5": {
		// 					"isConfigValid": true,
		// 					"validationMsg": "",
		// 					"configurations": {
		// 						"drinks": {
		// 							"isSelectionRequired": false,
		// 							"isMaximumAmountReached": true
		// 						}
		// 					},
		// 					"isNotApplicable": false
		// 				}
		// 			},
		// 			"notConfiguredLineIds": []
		// 		}
		// 	}
		// }
	]
}


describe(`Test suite: ${comboTestSuite.testSuiteName}`, () => {

	let productSlug = comboTestSuite.productSlug;
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
	comboTestSuite.testCases.forEach((testCase) => {
		const addToCartRequest = testCase.addToCartRequest;
		const expectedJsResults = testCase.expectedJsResults;
		it(`Test case: ${testCase.testCaseName}`, () => {
			console.log(`Test case: ${testCase.testCaseName}`)
			const sdkResult = ppSdk.getProductInfo(addToCartRequest);

			expect(sdkResult).to.deep.equal(expectedJsResults);
		})
	});
})

