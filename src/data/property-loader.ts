export interface PropertyData {
  bhk: number;
  propertytype: string;
  location: string;
  sqft: number;
  pricepersqft: number;
  totalprice: number;
}

let cachedData: PropertyData[] = [];
let cachedCities: string[] = [];
let cachedPropertyTypes: string[] = [];

export async function loadPropertyData(): Promise<PropertyData[]> {
  if (cachedData.length > 0) {
    return cachedData;
  }

  try {
    const response = await fetch('/House_Price_Data.csv');
    const csv = await response.text();
    const lines = csv.split('\n').filter(line => line.trim());
    
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const data: PropertyData[] = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const obj: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index];
        if (header === 'bhk') {
          obj[header] = parseInt(value) || 0;
        } else if (header === 'sqft' || header === 'pricepersqft' || header === 'totalprice') {
          obj[header] = parseInt(value) || 0;
        } else {
          obj[header] = value || '';
        }
      });
      
      return obj as PropertyData;
    });

    cachedData = data.filter(d => d.location && d.totalprice && d.sqft);
    return cachedData;
  } catch (error) {
    console.error('Error loading property data:', error);
    return [];
  }
}

export async function getCities(): Promise<string[]> {
  if (cachedCities.length > 0) {
    return cachedCities;
  }

  const data = await loadPropertyData();
  const cities = Array.from(new Set(data.map(d => d.location)))
    .filter(city => city && city.length > 0)
    .sort();
  
  cachedCities = cities;
  return cities;
}

export async function getPropertyTypes(): Promise<string[]> {
  if (cachedPropertyTypes.length > 0) {
    return cachedPropertyTypes;
  }

  const data = await loadPropertyData();
  const types = Array.from(new Set(data.map(d => d.propertytype)))
    .filter(type => type && type.length > 0)
    .sort();
  
  cachedPropertyTypes = types;
  return types;
}

export async function getPropertiesByLocation(location: string): Promise<PropertyData[]> {
  const data = await loadPropertyData();
  return data.filter(d => d.location === location);
}

export async function getPropertiesByType(type: string): Promise<PropertyData[]> {
  const data = await loadPropertyData();
  return data.filter(d => d.propertytype === type);
}

export async function getPropertiesByLocationAndType(location: string, type: string): Promise<PropertyData[]> {
  const data = await loadPropertyData();
  return data.filter(d => d.location === location && d.propertytype === type);
}

export function calculateStats(data: PropertyData[]) {
  if (data.length === 0) {
    return {
      totalProperties: 0,
      avgPrice: 0,
      avgSqft: 0,
      avgPricePerSqft: 0,
      avgBHK: 0,
    };
  }

  const totalProperties = data.length;
  const avgPrice = data.reduce((sum, p) => sum + p.totalprice, 0) / totalProperties;
  const avgSqft = data.reduce((sum, p) => sum + p.sqft, 0) / totalProperties;
  const avgPricePerSqft = data.reduce((sum, p) => sum + p.pricepersqft, 0) / totalProperties;
  const bhkData = data.filter(p => p.bhk > 0);
  const avgBHK = bhkData.length > 0 
    ? bhkData.reduce((sum, p) => sum + p.bhk, 0) / bhkData.length
    : 0;

  return {
    totalProperties,
    avgPrice,
    avgSqft,
    avgPricePerSqft,
    avgBHK,
  };
}
