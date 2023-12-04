data = {"kind":"notvalid","products":[{"line_id":1,"configuration_options":{"RT":{"sub_configuration_id":"drinks","product_options":{"2412":{"calorie_count":160,"price":1.29,"product_code":"SPDR-RT"}}},"FR":{"sub_configuration_id":"drinks","product_options":{"2412":{"calorie_count":None,"price":1.25,"product_code":"SPDR-FR"}}},"FT":{"sub_configuration_id":"drinks","product_options":{"2412":{"calorie_count":150,"price":1.29,"product_code":"SPDR-FT"}}},"CC":{"sub_configuration_id":"drinks","product_options":{"2412":{"calorie_count":140,"price":1.29,"product_code":"SPDR-CC"}}},"NE":{"sub_configuration_id":"drinks","product_options":{"2412":{"calorie_count":110,"price":1.29,"product_code":"SPDR-NE"}}},"BI":{"sub_configuration_id":"drinks","product_options":{"2412":{"calorie_count":160,"price":1.29,"product_code":"SPDR-BI"}}},"CZ":{"sub_configuration_id":"drinks","product_options":{"2412":{"calorie_count":0,"price":1.29,"product_code":"SPDR-CZ"}}},"FG":{"sub_configuration_id":"drinks","product_options":{"2412":{"calorie_count":None,"price":1.25,"product_code":"SPDR-FG"}}},"CS":{"sub_configuration_id":"drinks","product_options":{"2412":{"calorie_count":140,"price":1.29,"product_code":"SPDR-CS"}}},"GN":{"sub_configuration_id":"drinks","product_options":{"2412":{"calorie_count":130,"price":1.29,"product_code":"SPDR-GN"}}},"DC":{"sub_configuration_id":"drinks","product_options":{"2412":{"calorie_count":0,"price":1.29,"product_code":"SPDR-DC"}}},"SE":{"sub_configuration_id":"drinks","product_options":{"2412":{"calorie_count":140,"price":1.29,"product_code":"SPDR-SE"}}}},"product_options":{"2412":{"selection_rule":"Exact","calories":None,"base_price":3.29}},"sub_configurations":{"drinks":{"included_quantity":3,"is_required":True,"maximum_quantity":None}}}],"product_id":"product_2412","combo":[]}


import gzip
import json
import sys

data = json.dumps(data)
print '========  original data ========='
print data
print '========  original data ========='
print 'original json size = ' + str(sys.getsizeof(data))

print ''
print ''

print '========  compressed data ========='
compressed = gzip.zlib.compress(data).encode('base64')
print compressed
print '========  compressed data ========='
print 'compressed size = ' + str(sys.getsizeof(compressed))

print ''
print ''

print '======== js object ========='
json_data = {
    "js_data": compressed
}
encoded_json = json.dumps(json_data)
print encoded_json
print '======== js object ========='

print ''
print ''

print '======== decompressing... =========='
print ''
decoded_json = json.loads(encoded_json)
decompressed = gzip.zlib.decompress(decoded_json['js_data'].decode('base64'))
print decompressed
