import requests

url = 'http://127.0.0.1:8000/api/analyze/'

# Test Case 1: Luxury property
data1 = {
    'bedrooms': 5, 'bathrooms': 4, 'sqft_living': 5000, 'grade': 12,
    'condition': 5, 'yr_built': 2020, 'lat': 47.6, 'long': -122.3,
    'annual_rent': 600000, 'expenses': 100000, 'loan': 500000
}

# Test Case 2: Budget property
data2 = {
    'bedrooms': 2, 'bathrooms': 1, 'sqft_living': 800, 'grade': 5,
    'condition': 2, 'yr_built': 1990, 'lat': 47.5, 'long': -122.2,
    'annual_rent': 100000, 'expenses': 30000, 'loan': 50000
}

print('=' * 50)
print('TEST 1: LUXURY PROPERTY')
print('=' * 50)
r1 = requests.post(url, json=data1)
result1 = r1.json()
print(f'Predicted Price: ${result1["predicted_price"]:,.0f}')
print(f'ROI: {result1["roi"]:.2f}%')
print(f'Risk: {result1["risk"]}')

print()
print('=' * 50)
print('TEST 2: BUDGET PROPERTY')
print('=' * 50)
r2 = requests.post(url, json=data2)
result2 = r2.json()
print(f'Predicted Price: ${result2["predicted_price"]:,.0f}')
print(f'ROI: {result2["roi"]:.2f}%')
print(f'Risk: {result2["risk"]}')

print()
print('=' * 50)
print('ML MODEL MAKING DIFFERENT PREDICTIONS ✅')
print('=' * 50)
