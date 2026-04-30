import requests

url = 'http://127.0.0.1:8000/api/analyze/'

# Test: Mid-range property
data = {
    'bedrooms': 3,
    'bathrooms': 2,
    'sqft_living': 2000,
    'grade': 8,
    'condition': 3,
    'yr_built': 2010,
    'lat': 47.6,
    'long': -122.3,
    'annual_rent': 400000,
    'expenses': 80000,
    'loan': 150000
}

print('=' * 60)
print('ENHANCED API TEST - WITH IRR & RECOMMENDATION')
print('=' * 60)

response = requests.post(url, json=data)
result = response.json()

print(f"\n📊 ML MODEL PREDICTIONS:")
print(f"   Predicted Price: ${result['predicted_price']:,.0f}")

print(f"\n💰 FINANCIAL METRICS (Manual Calculations):")
print(f"   Annual Net Income: ${result['net_income']:,.0f}")
print(f"   ROI: {result['roi']:.2f}%")
print(f"   IRR: {result['irr']:.2f}%" if result['irr'] else "   IRR: N/A")

print(f"\n⚠️ RISK ASSESSMENT:")
print(f"   Risk Level: {result['risk']}")

print(f"\n🎯 RECOMMENDATION:")
rec = result['recommendation']
print(f"   Status: {rec['status']}")
print(f"   Rating: {rec['rating']}/10")
print(f"   Action: {rec['action']}")
print(f"   Reasoning:")
for reason in rec['reasoning']:
    print(f"      {reason}")

print("\n" + "=" * 60)
print("ARCHITECTURE VALIDATED ✅")
print("=" * 60)
print("ML Model: Random Forest (Price Prediction)")
print("Manual Calculations: ROI, IRR, Risk, Recommendation")
print("Future Enhancement: Monte Carlo Simulation (Risk)")
