var a = {


    "js_data": {
        "kind": "combo", // it will always be single or combo until we feel the need for other variations
        "products": [
            {
                "line_id": 1, // To bind with product from config
                "group_id": 1,
                "product_options": { // Base price for single ONLY,
                    "<product_option_id_1>": {
                        "base_price": 23,
                        "calories": 23,
                        "selection_rule": "<enum=Exact/ExactPlus/No>"
                    },
                    "<product_option_id_2>": {
                        "base_price": 34,
                        "calories": 45,
                        "selection_rule": "<enum=Exact/ExactPlus/No>"
                    }
                },
                "configuration_options": {
                    "DO": { // [0][0]   entry code
                        "configuration_id": "veggie",
                        "product_options": {
                            "<product_option_id>": {
                                "included_quantity": 2, // [5][0] quantity that doesn't lower the price if taken off
                                "product_code": "LRG-DO", //  [1][0]    product code
                                "price": '<price_monetary_value>', // [7][0] price of the item
                                "calories": '<calories_monetary_value>' // Calories from config
                            }
                        }
                    }
                },
                "configurations": {
                    "toppings": {
                        "included_quantity": 1, // [2][i] included quantity "please add 2 more choices"
                        "maximum_quantity": 2,  // [3][0] maximum quantity of the product,
                        "is_required": true,    // [4][0]  mandatory Indicator : Y or N,
                        "name": {
                            "english": "TOPPINGS",
                            "french": "FRENCH TOPPINGS"
                        }
                    }
                }
            }
        ],
        "combo": [
            {
                "combo_id": 9000, // will be used by backend
                "product_option_ids": [111, 222, 333], // these will be product option ids
                "base_price": 7.99
            },
            {
                "combo_id": 9001,
                "product_option_ids": [444, 555, 666],
                "base_price": 8.99
            },
            {
                "combo_id": 9002,
                "product_option_ids": [777, 888, 999],
                "base_price": 9.99
            }
        ]
    }

}