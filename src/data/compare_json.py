import json
import urllib.request

# Tests whether the project's API produces the same GeoJSON response as the
# reference file.
#
# Usage:
#   python3 compare_json.py

api_url = 'http://localhost/api/features.geojson'
file_path = 'SA_dashboard.geojson'

with urllib.request.urlopen(api_url) as f:
    a = json.dumps(json.load(f), sort_keys=True)

with open(file_path, 'r') as fp:
    b = json.dumps(json.load(fp), sort_keys=True)

if a == b:
    print("yay")
else:
    print("boo")
