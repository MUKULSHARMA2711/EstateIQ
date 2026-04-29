import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Building2, User, Percent, Wallet, Landmark, LineChart } from "lucide-react";
import { InvestmentForm, FormValues } from "@/components/dashboard/InvestmentForm";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { IncomeExpenseChart, PricePredictionChart } from "@/components/dashboard/Charts";
import { RiskAnalysis } from "@/components/dashboard/RiskAnalysis";
import { PropertyTable } from "@/components/dashboard/PropertyTable";

export const Route = createFileRoute("/")({
  component: Dashboard,
  head: () => ({
    meta: [
      { title: "Real Estate Investment Analyzer — Smart Property Insights" },
      { name: "description", content: "Analyze ROI, EMI, cash flow and forecasts for your real estate investments with a modern fintech dashboard." },
    ],
  }),
});

const defaultValues: FormValues = {
  city: "New York",
  propertyType: "flat",
  bhk: 2,
  propertyArea: 1200,
  price: 350000,
  rent: 2800,
  loan: 280000,
  rate: 6.5,
  years: 30,
  expenses: 600,
};

function calculateEMI(principal: number, annualRate: number, years: number) {
  if (!principal || !annualRate || !years) return 0;
  const r = annualRate / 12 / 100;
  const n = years * 12;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

function Dashboard() {
  const [values, setValues] = useState<FormValues>(defaultValues);
  const [computed, setComputed] = useState<FormValues>(defaultValues);
  const [loading, setLoading] = useState(false);

  const metrics = useMemo(() => {
    const emi = calculateEMI(computed.loan, computed.rate, computed.years);
    const monthlyProfit = computed.rent - emi - computed.expenses;
    const annualProfit = monthlyProfit * 12;
    const downPayment = Math.max(computed.price - computed.loan, 1);
    const roi = (annualProfit / downPayment) * 100;
    const totalReturn = annualProfit + computed.price * 0.065; // appreciation
    return { emi, monthlyProfit, annualProfit, roi, totalReturn };
  }, [computed]);

  const handleCalculate = () => {
    setLoading(true);
    setTimeout(() => {
      setComputed(values);
      setLoading(false);
    }, 700);
  };

  const handleReset = () => {
    setValues(defaultValues);
    setComputed(defaultValues);
  };

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-xl bg-background/40 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-[var(--shadow-glow)]">
              <Building2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-tight">Real Estate Investment Analyzer</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Smart Property Investment Insights</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-secondary/60 border border-border/60 flex items-center justify-center hover:bg-secondary transition-colors">
            <User className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero intro */}
        <section className="animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Your Investment <span className="gradient-text">Dashboard</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Make data-driven property decisions with real-time ROI, cash flow analysis and 5-year forecasts.
          </p>
        </section>

        {/* Form */}
        <InvestmentForm
          values={values}
          onChange={setValues}
          onCalculate={handleCalculate}
          onReset={handleReset}
          loading={loading}
        />

        {/* Metrics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <MetricCard
            label="ROI"
            value={`${metrics.roi.toFixed(2)}%`}
            icon={Percent}
            trend={metrics.roi >= 8 ? "up" : "down"}
            trendValue={metrics.roi >= 8 ? "Strong return" : "Below benchmark"}
            accent="primary"
            tooltip="Return on Investment — annual profit relative to your down payment."
            delay={0}
          />
          <MetricCard
            label="Monthly Cash Flow"
            value={`${metrics.monthlyProfit < 0 ? "-" : ""}$${Math.abs(Math.round(metrics.monthlyProfit)).toLocaleString()}`}
            icon={Wallet}
            trend={metrics.monthlyProfit >= 0 ? "up" : "down"}
            trendValue={metrics.monthlyProfit >= 0 ? "Positive flow" : "Negative flow"}
            accent={metrics.monthlyProfit >= 0 ? "success" : "danger"}
            tooltip="Net monthly income after EMI and operating expenses."
            delay={80}
          />
          <MetricCard
            label="Monthly EMI"
            value={`$${Math.round(metrics.emi).toLocaleString()}`}
            icon={Landmark}
            accent="warning"
            tooltip="Equated Monthly Installment — your monthly mortgage payment."
            delay={160}
          />
          <MetricCard
            label="Total Annual Return"
            value={`$${Math.round(metrics.totalReturn).toLocaleString()}`}
            icon={LineChart}
            trend="up"
            trendValue="Incl. appreciation"
            accent="success"
            tooltip="Annual cash flow plus estimated property appreciation (~6.5%)."
            delay={240}
          />
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <IncomeExpenseChart
            monthlyRent={computed.rent}
            monthlyExpenses={computed.expenses}
            emi={metrics.emi}
            propertyPrice={computed.price}
          />
          <PricePredictionChart propertyPrice={computed.price} />
        </section>

        {/* Risk */}
        <RiskAnalysis baseRoi={metrics.roi} baseProfit={metrics.monthlyProfit} />

        {/* Comparison */}
        <PropertyTable />

        <footer className="text-center text-xs text-muted-foreground pt-6 pb-2">
          Demo dashboard · Figures are illustrative · Built for investor analysis
        </footer>
      </div>
    </main>
  );
}
