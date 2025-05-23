import { PriceChart } from "@/components/price-chart"
import { CurrencyConverter } from "@/components/currency-converter"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function CurrenciesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Traditional Currencies</h1>
        <p className="text-muted-foreground mt-2">Track exchange rates and convert between major currencies</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-8">
          <PriceChart
            title="USD/EGP Exchange Rate"
            description="US Dollar to Egyptian Pound"
            endpoint="/api/currencies/history?base=USD&target=EGP"
            color="rgb(59, 130, 246)"
            yAxisSymbol="EGP "
          />

          <PriceChart
            title="EUR/USD Exchange Rate"
            description="Euro to US Dollar"
            endpoint="/api/currencies/history?base=EUR&target=USD"
            color="rgb(99, 102, 241)"
            yAxisSymbol="$ "
          />
        </div>

        <div className="space-y-8">
          <CurrencyConverter />

          <Card>
            <CardHeader>
              <CardTitle>Major Exchange Rates</CardTitle>
              <CardDescription>Current rates against USD</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">EUR/USD</span>
                    <span>1.0923</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">GBP/USD</span>
                    <span>1.2715</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">USD/JPY</span>
                    <span>156.82</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">USD/CAD</span>
                    <span>1.3642</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">USD/CHF</span>
                    <span>0.9042</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">AUD/USD</span>
                    <span>0.6612</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">USD/EGP</span>
                    <span>50.85</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span className="font-medium">USD/CNY</span>
                    <span>7.2275</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Last updated: May 23, 2025, 04:00 UTC</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
