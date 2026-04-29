import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { loadPropertyData, PropertyData } from "@/data/property-loader";

interface PropertyDisplay {
  location: string;
  propertytype: string;
  bhk: number;
  sqft: number;
  price: number;
  pricepersqft: number;
}

const riskColor: Record<string, string> = {
  Low: "bg-success/20 text-success border-success/30",
  Medium: "bg-warning/20 text-warning border-warning/30",
  High: "bg-destructive/20 text-destructive border-destructive/30",
};

function calculateRisk(pricepersqft: number, avgPricepersqft: number): "Low" | "Medium" | "High" {
  const ratio = pricepersqft / avgPricepersqft;
  if (ratio < 0.8) return "Low";
  if (ratio > 1.2) return "High";
  return "Medium";
}

export function PropertyTable() {
  const [properties, setProperties] = useState<PropertyDisplay[]>([]);
  const [avgPricepersqft, setAvgPricepersqft] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await loadPropertyData();
      if (data.length > 0) {
        const avg = data.reduce((sum, p) => sum + p.pricepersqft, 0) / data.length;
        setAvgPricepersqft(avg);
        // Show top 5 properties sorted by price
        const sorted = data
          .sort((a, b) => b.totalprice - a.totalprice)
          .slice(0, 5)
          .map(p => ({
            location: p.location,
            propertytype: p.propertytype,
            bhk: p.bhk,
            sqft: p.sqft,
            price: p.totalprice,
            pricepersqft: p.pricepersqft,
          }));
        setProperties(sorted);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="glass-card rounded-2xl p-6 animate-slide-up">
        <div className="mb-5">
          <h2 className="text-xl font-semibold">Top Properties</h2>
          <p className="text-sm text-muted-foreground">Loading market data...</p>
        </div>
      </div>
    );
  }

  const best = properties.reduce((a, b) => (a.price > b.price ? a : b));

  return (
    <div className="glass-card rounded-2xl p-6 animate-slide-up">
      <div className="mb-5">
        <h2 className="text-xl font-semibold">Top Properties</h2>
        <p className="text-sm text-muted-foreground">View premium listings from market data</p>
      </div>
      <div className="overflow-x-auto -mx-2">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">BHK / Sqft</th>
              <th className="px-4 py-3 font-medium">Total Price</th>
              <th className="px-4 py-3 font-medium">Price/Sqft</th>
              <th className="px-4 py-3 font-medium">Risk Level</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p, idx) => {
              const isBest = p === best;
              const risk = calculateRisk(p.pricepersqft, avgPricepersqft);
              return (
                <tr
                  key={idx}
                  className={`border-b border-border/30 last:border-0 transition-colors hover:bg-white/5 ${
                    isBest ? "bg-primary/10" : ""
                  }`}
                >
                  <td className="px-4 py-4 font-medium">
                    <div className="flex items-center gap-2">
                      {isBest && <Star className="w-4 h-4 text-warning fill-warning" />}
                      <span>{p.location}</span>
                      {isBest && (
                        <span className="text-[10px] uppercase tracking-wide font-semibold text-primary bg-primary/15 px-2 py-0.5 rounded-full">
                          Premium
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">{p.propertytype}</td>
                  <td className="px-4 py-4">
                    {p.bhk > 0 ? `${p.bhk} BHK` : "N/A"} / {p.sqft.toLocaleString()} sqft
                  </td>
                  <td className="px-4 py-4 font-semibold">₹{(p.price / 10000000).toFixed(2)}Cr</td>
                  <td className="px-4 py-4">₹{Math.round(p.pricepersqft).toLocaleString()}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${riskColor[risk]}`}>
                      {risk}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
