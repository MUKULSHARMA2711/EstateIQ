import { Calculator, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCities, getPropertyTypes } from "@/data/property-loader";

export interface FormValues {
  city: string;
  propertyType: string;
  bhk: number;
  propertyArea: number;
  price: number;
  rent: number;
  loan: number;
  rate: number;
  years: number;
  expenses: number;
}

interface Props {
  values: FormValues;
  onChange: (v: FormValues) => void;
  onCalculate: () => void;
  onReset: () => void;
  loading: boolean;
}

const bhkOptions = ["1", "2", "3", "4", "5"];

const numericFields = [
  { key: "price" as const, label: "Property Price", prefix: "₹" },
  { key: "rent" as const, label: "Monthly Rent", prefix: "₹" },
  { key: "loan" as const, label: "Loan Amount", prefix: "₹" },
  { key: "rate" as const, label: "Interest Rate", suffix: "%" },
  { key: "years" as const, label: "Loan Duration", suffix: "yrs" },
  { key: "expenses" as const, label: "Monthly Expenses", prefix: "₹" },
];

export function InvestmentForm({ values, onChange, onCalculate, onReset, loading }: Props) {
  const [cities, setCities] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const citiesData = await getCities();
      const typesData = await getPropertyTypes();
      setCities(citiesData);
      setPropertyTypes(typesData);
      setLoadingData(false);
    };
    loadData();
  }, []);

  return (
    <div className="glass-card rounded-2xl p-6 md:p-8 animate-slide-up">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-1">Investment Inputs</h2>
        <p className="text-sm text-muted-foreground">Enter property details to analyze your investment</p>
      </div>

      {/* Property Details Section */}
      <div className="mb-6 pb-6 border-b border-border/40">
        <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">Property Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              City
            </Label>
            <Select value={values.city} onValueChange={(city) => onChange({ ...values, city })} disabled={loadingData}>
              <SelectTrigger id="city" className="bg-input/60 border-border/60 h-11 focus-visible:ring-primary/50">
                <SelectValue placeholder={loadingData ? "Loading cities..." : "Select a city"} />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Property Type */}
          <div className="space-y-2">
            <Label htmlFor="propertyType" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Property Type
            </Label>
            <Select value={values.propertyType} onValueChange={(type) => onChange({ ...values, propertyType: type })} disabled={loadingData}>
              <SelectTrigger id="propertyType" className="bg-input/60 border-border/60 h-11 focus-visible:ring-primary/50">
                <SelectValue placeholder={loadingData ? "Loading types..." : "Select type"} />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* BHK */}
          <div className="space-y-2">
            <Label htmlFor="bhk" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              BHK
            </Label>
            <Select value={values.bhk.toString()} onValueChange={(bhk) => onChange({ ...values, bhk: Number(bhk) })}>
              <SelectTrigger id="bhk" className="bg-input/60 border-border/60 h-11 focus-visible:ring-primary/50">
                <SelectValue placeholder="Select BHK" />
              </SelectTrigger>
              <SelectContent>
                {bhkOptions.map((bhk) => (
                  <SelectItem key={bhk} value={bhk}>
                    {bhk} BHK
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Property Area */}
          <div className="space-y-2">
            <Label htmlFor="propertyArea" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Property Area
            </Label>
            <div className="relative">
              <Input
                id="propertyArea"
                type="number"
                value={values.propertyArea}
                onChange={(e) => onChange({ ...values, propertyArea: Number(e.target.value) })}
                placeholder="0"
                className="bg-input/60 border-border/60 h-11 pr-12 focus-visible:ring-primary/50"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                sq ft
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Details Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">Investment Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {numericFields.map((f) => (
            <div key={f.key} className="space-y-2">
              <Label htmlFor={f.key} className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {f.label}
              </Label>
              <div className="relative">
                {f.prefix && (
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    {f.prefix}
                  </span>
                )}
                <Input
                  id={f.key}
                  type="number"
                  value={values[f.key]}
                  onChange={(e) => onChange({ ...values, [f.key]: Number(e.target.value) })}
                  className={`bg-input/60 border-border/60 h-11 ${f.prefix ? "pl-7" : ""} ${f.suffix ? "pr-12" : ""} focus-visible:ring-primary/50`}
                />
                {f.suffix && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    {f.suffix}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Button
          onClick={onCalculate}
          disabled={loading}
          className="gradient-primary text-primary-foreground font-semibold h-12 px-8 rounded-xl shadow-[var(--shadow-glow)] hover:shadow-[0_0_50px_oklch(0.65_0.22_265/0.4)] hover:scale-[1.02] transition-all duration-300 border-0"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Calculating...
            </>
          ) : (
            <>
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Investment
            </>
          )}
        </Button>
        <Button
          onClick={onReset}
          variant="outline"
          className="h-12 px-6 rounded-xl border-border/60 bg-secondary/40 hover:bg-secondary/80"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
}
