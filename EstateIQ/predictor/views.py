from rest_framework.decorators import api_view
from rest_framework.response import Response
from .model import predict_price
import numpy as np
from scipy.optimize import newton

# City coordinates mapping (latitude, longitude)
CITY_COORDINATES = {
    'Ahmedabad': (23.0225, 72.5714),
    'Amritsar': (31.6340, 74.8723),
    'Bangalore': (12.9716, 77.5946),
    'Bhilai': (21.2274, 81.4298),
    'Bhopal': (23.1815, 77.4104),
    'Bhubaneswar': (20.2961, 85.8245),
    'Bilaspur': (21.5994, 82.1534),
    'Chennai': (13.0827, 80.2707),
    'Coimbatore': (11.0066, 76.9655),
    'Cuttack': (20.4625, 85.8830),
    'Dehradun': (30.1975, 78.2784),
    'Dhanbad': (23.7957, 86.4304),
    'Durgapur': (23.5003, 87.3124),
    'Dwarka': (28.5921, 77.0460),
    'Ernakulam': (9.9312, 76.2844),
    'Faridabad': (28.4089, 77.3178),
    'Gurgaon': (28.4595, 77.0266),
    'Guwahati': (26.1445, 91.7362),
    'Gwalior': (26.2183, 78.1629),
    'Haridwar': (29.9457, 78.1642),
    'Howrah': (22.5958, 88.2636),
    'Hyderabad': (17.3850, 78.4867),
    'Indore': (22.7196, 75.8577),
    'Jaipur': (26.9124, 75.7873),
    'Jalandhar': (31.7260, 75.5762),
    'Jamshedpur': (22.8046, 86.1829),
    'Jodhpur': (26.2389, 73.0243),
    'Kanpur': (26.4499, 80.3319),
    'Karimnagar': (18.4386, 79.1288),
    'Kochi': (9.9312, 76.2844),
    'Kolkata': (22.5726, 88.3639),
    'Kozhikode': (11.2588, 75.7804),
    'Lucknow': (26.8467, 80.9462),
    'Ludhiana': (30.9010, 75.8573),
    'Madurai': (9.9252, 78.1198),
    'Mangalore': (12.9352, 74.8597),
    'Mumbai': (19.0760, 72.8777),
    'Muzaffarpur': (26.1209, 85.3854),
    'Mysore': (12.2958, 76.6394),
    'Nagpur': (21.1458, 79.0882),
    'NewDelhi': (28.7041, 77.1025),
    'Noida': (28.5921, 77.3869),
    'Panipat': (29.3910, 77.1010),
    'Patna': (25.5941, 85.1376),
    'Pondicherry': (12.0096, 79.7675),
    'Pune': (18.5204, 73.8567),
    'Raipur': (21.2514, 81.6296),
    'Ranchi': (23.3441, 85.3096),
    'Rishikesh': (30.0888, 78.2679),
    'Rohini': (28.8196, 77.0566),
    'Shimla': (31.7724, 77.1089),
    'Thane': (19.2183, 72.9781),
    'Trichy': (10.7905, 78.7047),
    'Udaipur': (24.5854, 73.7125),
    'Vadodara': (22.3072, 73.1812),
    'Warangal': (17.9689, 79.5941),
}

# Property type encoding
PROPERTY_TYPE_ENCODE = {
    'Flat': 1,
    'House': 2,
    'Villa': 3,
}

def calculate_irr(initial_investment, cash_flows, guess=0.1):
    """
    Calculate Internal Rate of Return (IRR)
    
    Args:
        initial_investment: negative value (money going out)
        cash_flows: list of positive annual cash flows
        guess: initial guess for Newton's method
    
    Returns:
        IRR as percentage, or None if calculation fails
    """
    try:
        # NPV function: sum of discounted cash flows
        def npv(rate):
            return initial_investment + sum(cf / (1 + rate) ** (i + 1) for i, cf in enumerate(cash_flows))
        
        # Calculate IRR using Newton's method
        irr = newton(npv, guess, maxiter=100)
        return irr * 100  # Convert to percentage
    except:
        return None

def get_recommendation(roi, irr, net_income, predicted_price):
    """
    Generate investment recommendation based on financial metrics
    
    Args:
        roi: Return on Investment (%)
        irr: Internal Rate of Return (%)
        net_income: Annual net income ($)
        predicted_price: Property predicted price ($)
    
    Returns:
        recommendation: dict with status, reasoning, and action
    """
    recommendation = {
        "status": "HOLD",
        "rating": 0,  # 0-10 scale
        "reasoning": [],
        "action": "Needs more analysis"
    }
    
    # Evaluate ROI
    if roi > 8:
        recommendation["rating"] += 3
        recommendation["reasoning"].append("✅ Excellent ROI (>8%)")
    elif roi > 5:
        recommendation["rating"] += 2
        recommendation["reasoning"].append("✅ Good ROI (5-8%)")
    elif roi > 3:
        recommendation["rating"] += 1
        recommendation["reasoning"].append("⚠️ Moderate ROI (3-5%)")
    else:
        recommendation["reasoning"].append("❌ Poor ROI (<3%)")
    
    # Evaluate IRR
    if irr and irr > 0:
        if irr > 15:
            recommendation["rating"] += 3
            recommendation["reasoning"].append("✅ Strong IRR (>15%)")
        elif irr > 10:
            recommendation["rating"] += 2
            recommendation["reasoning"].append("✅ Good IRR (10-15%)")
        elif irr > 5:
            recommendation["rating"] += 1
            recommendation["reasoning"].append("⚠️ Moderate IRR (5-10%)")
        else:
            recommendation["reasoning"].append("❌ Weak IRR (<5%)")
    
    # Evaluate cash flow
    if net_income > 0:
        if net_income > predicted_price * 0.05:  # >5% annual income
            recommendation["rating"] += 2
            recommendation["reasoning"].append("✅ Strong positive cash flow")
        elif net_income > 0:
            recommendation["rating"] += 1
            recommendation["reasoning"].append("⚠️ Positive but low cash flow")
    else:
        recommendation["reasoning"].append("❌ Negative cash flow (loss-making)")
    
    # Determine final recommendation
    if recommendation["rating"] >= 7:
        recommendation["status"] = "BUY"
        recommendation["action"] = "Strong investment - Proceed with analysis"
    elif recommendation["rating"] >= 5:
        recommendation["status"] = "CONSIDER"
        recommendation["action"] = "Viable investment - Due diligence recommended"
    elif recommendation["rating"] >= 3:
        recommendation["status"] = "HOLD"
        recommendation["action"] = "Marginal investment - Seek better opportunities"
    else:
        recommendation["status"] = "AVOID"
        recommendation["action"] = "Poor investment - Look elsewhere"
    
    return recommendation

@api_view(['POST'])
def analyze_property(request):
    """
    API endpoint to analyze property and predict ROI
    
    Data flow:
    1. Random Forest Model: Predicts property price from 60 features
    2. Manual Calculations: ROI, IRR, Risk assessment based on loan percentage (0-10%)
    3. Recommendation: Based on financial metrics
    
    Formulas Used:
    - Predicted Price: ML Random Forest Model
    - Loan Amount: (loan_amount if provided else predicted_price × (loan_percentage / 100))
    - Monthly EMI: (loan_amount × rate × (1+rate)^n) / ((1+rate)^n - 1)
    - Annual Interest: Monthly EMI × 12
    - Net Annual Income: annual_rent - expenses - annual_interest
    - ROI: (net_income / predicted_price) × 100
    - IRR: Internal Rate of Return over 30-year mortgage
    """
    try:
        data = request.data

        # Check if full 60 features are provided
        if 'features' in data:
            features = [float(x) for x in data['features']]
            if len(features) != 60:
                return Response({"error": f"Expected 60 features, got {len(features)}"}, status=400)
        else:
            # Use the fields available in dataset and pad with zeros
            city = data.get('city', 'Mumbai')
            lat, long = CITY_COORDINATES.get(city, (19.0760, 72.8777))  # Default to Mumbai
            propertytype = data.get('propertytype', 'Flat')
            propertytype_code = PROPERTY_TYPE_ENCODE.get(propertytype, 1)
            
            features = [
                float(data.get('bedrooms', 0)),
                propertytype_code,
                float(data.get('sqft', 0)),
                lat,
                long
            ]
            # Pad with 55 zeros to reach 60 features
            features.extend([0] * 55)

        # ===== ML MODEL: PRICE PREDICTION =====
        predicted_price = predict_price(features)

        # ===== MANUAL CALCULATIONS =====
        rent = float(data.get('annual_rent', 0))
        expenses = float(data.get('expenses', 0))

        # Loan can be provided either as absolute amount (₹) or as % of predicted price.
        # If both are provided, loan_amount takes precedence.
        loan_amount_input = data.get('loan_amount', None)
        max_loan_amount = predicted_price * 0.10

        if loan_amount_input not in (None, '', 'null'):
            loan_amount = max(0.0, float(loan_amount_input))
            loan_amount = min(loan_amount, max_loan_amount)
            loan_percentage = (loan_amount / predicted_price) * 100 if predicted_price > 0 else 0.0
        else:
            loan_percentage = float(data.get('loan_percentage', 5))  # Default 5%
            # Validate loan percentage (0-10%)
            loan_percentage = max(0, min(10, loan_percentage))
            # Calculate actual loan amount from percentage
            loan_amount = predicted_price * (loan_percentage / 100)
        
        # Calculate EMI (Equated Monthly Installment)
        # Assuming: 9% annual interest rate, 30-year mortgage (360 months)
        annual_interest_rate = 0.09
        monthly_interest_rate = annual_interest_rate / 12
        num_months = 360  # 30 years
        
        if monthly_interest_rate > 0:
            # EMI formula: P × [r(1+r)^n] / [(1+r)^n - 1]
            numerator = loan_amount * monthly_interest_rate * ((1 + monthly_interest_rate) ** num_months)
            denominator = ((1 + monthly_interest_rate) ** num_months) - 1
            monthly_emi = numerator / denominator if denominator != 0 else 0
        else:
            monthly_emi = loan_amount / num_months
        
        annual_emi = monthly_emi * 12
        
        # Calculate annual net income
        # Net Income = Rent - Expenses - EMI (loan repayment)
        net_income = rent - expenses - annual_emi
        
        # Calculate ROI (Return on Investment)
        roi = (net_income / predicted_price) * 100 if predicted_price > 0 else 0

        # Calculate IRR (Internal Rate of Return)
        # Assumption: 30-year mortgage, same cash flow each year
        initial_investment = -predicted_price
        annual_cash_flows = [net_income] * 30
        irr = calculate_irr(initial_investment, annual_cash_flows)

        # Determine risk level
        if roi > 8 and (irr is None or irr > 10):
            risk = "Low"
        elif roi > 4 or (irr and irr > 5):
            risk = "Medium"
        else:
            risk = "High"

        # Generate investment recommendation
        recommendation = get_recommendation(roi, irr, net_income, predicted_price)

        return Response({
            "predicted_price": float(predicted_price),
            "loan_amount": float(loan_amount),
            "loan_percentage": float(loan_percentage),
            "annual_emi": float(annual_emi),
            "net_income": float(net_income),
            "roi": float(roi),
            "irr": float(irr) if irr else None,
            "risk": risk,
            "recommendation": recommendation
        })

    except KeyError as e:
        return Response({"error": f"Missing required field: {str(e)}"}, status=400)
    except ValueError as e:
        return Response({"error": f"Invalid data type: {str(e)}"}, status=400)
    except Exception as e:
        return Response({"error": f"Prediction error: {str(e)}"}, status=500)


