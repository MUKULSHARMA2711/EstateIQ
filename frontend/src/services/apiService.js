const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

export const analyzeProperty = async (formData) => {
  try {
    // Send only the fields available in the dataset
    const payload = {
      bedrooms: parseFloat(formData.bedrooms),
      propertytype: formData.propertytype,
      city: formData.city,
      sqft: parseFloat(formData.sqft),
      annual_rent: parseFloat(formData.annual_rent),
      expenses: parseFloat(formData.expenses),
      loan_percentage: parseFloat(formData.loan_percentage),
    };

    if (formData.loan_amount !== undefined && formData.loan_amount !== null && formData.loan_amount !== '') {
      payload.loan_amount = parseFloat(formData.loan_amount);
    }

    const response = await fetch(`${API_BASE_URL}/analyze/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'API Error');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error analyzing property:', error);
    throw error;
  }
};
