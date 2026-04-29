import { TrendingUp, Minus, TrendingDown } from "lucide-react";

interface Props {
  baseRoi: number;
  baseProfit: number;
}

export function RiskAnalysis({ baseRoi, baseProfit }: Props) {
  const cases = [
    {
      label: "Best Case",
      sub: "+10% market upturn",
      icon: TrendingUp,
      roi: baseRoi * 1.1,
      profit: baseProfit * 1.1,
      tone: "success",
      gradient: "from-success/20 via-success/5 to-transparent",
      iconBg: "bg-success/20 text-success",
    },
    {
      label: "Normal Case",
      sub: "Expected scenario",
      icon: Minus,
      roi: baseRoi,
      profit: baseProfit,
      tone: "primary",
      gradient: "from-primary/20 via-primary/5 to-transparent",
      iconBg: "bg-primary/20 text-primary",
    },
    {
      label: "Worst Case",
      sub: "-10% market downturn",
      icon: TrendingDown,
      roi: baseRoi * 0.9,
      profit: baseProfit * 0.9,
      tone: "danger",
      gradient: "from-destructive/20 via-destructive/5 to-transparent",
      iconBg: "bg-destructive/20 text-destructive",
    },
  ];

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-semibold">Risk Analysis</h2>
        <p className="text-sm text-muted-foreground">Scenario-based outlook on your investment</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {cases.map((c, i) => (
          <div
            key={c.label}
            className={`glass-card rounded-2xl p-6 bg-gradient-to-br ${c.gradient} hover:-translate-y-1 transition-all duration-300 animate-slide-up`}
            style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}
          >
            <div className={`w-11 h-11 rounded-xl ${c.iconBg} flex items-center justify-center mb-4`}>
              <c.icon className="w-5 h-5" />
            </div>
            <p className="text-sm text-muted-foreground">{c.label}</p>
            <p className="text-xs text-muted-foreground/70 mb-3">{c.sub}</p>
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">ROI</span>
                <span className="text-2xl font-bold">{c.roi.toFixed(2)}%</span>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-muted-foreground">Monthly</span>
                <span className="text-lg font-semibold">₹{Math.round(c.profit).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
