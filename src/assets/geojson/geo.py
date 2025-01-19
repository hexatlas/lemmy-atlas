import json

def transform_geojson(geojson_data):
    for feature in geojson_data['features']:
        properties = feature['properties']
        
        # Create a new properties dictionary with only the desired fields
        new_properties = {
            'name': properties.get('name'),
            'country': properties.get('country'),
            'emoji': properties.get('emoji'),
            'image': properties.get('image'),
            'ISO3166-2': properties.get('iso_3166-2'),
            'ISO3166-3': properties.get('alpha-3'),
            'sub-region': properties.get('sub-region'),
            'intermediate-region': properties.get('intermediate-region'),
            'region': properties.get('region'),
            'country-code': properties.get('country-code'),
            'sub-region-code': properties.get('sub-region-code'),
            'intermediate-region-code': properties.get('intermediate-region-code'),
            'region-code': properties.get('region-code'),
            'id': properties.get('id')
        }
        
        # Replace the old properties with the new one
        feature['properties'] = new_properties
    
    return geojson_data

# Load the GeoJSON file
with open('administrative_regions_extended.json', 'r') as f:
    geojson_data = json.load(f)

# Transform the GeoJSON
transformed_geojson = transform_geojson(geojson_data)

# Save the transformed GeoJSON to a new file
with open('administrative_regions_extended_2.json', 'w') as f:
    json.dump(transformed_geojson, f, indent=2)

print("GeoJSON transformed and saved to 'transformed_output.geojson'")