"use client"

import { useState, useEffect } from "react"
import { ArrowRight, RefreshCw, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Currency {
  code: string
  name: string
}

export function CurrencyConverter() {
  const [amount, setAmount] = useState("1")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState("EGP")
  const [result, setResult] = useState<number | null>(null)
  const [rate, setRate] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFallback, setIsFallback] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [currencies, setCurrencies] = useState<Currency[]>([
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "EGP", name: "Egyptian Pound" },
    { code: "AED", name: "UAE Dirham" },
    { code: "SAR", name: "Saudi Riyal" },
    { code: "CAD", name: "Canadian Dollar" },
    { code: "AUD", name: "Australian Dollar" },
    { code: "CNY", name: "Chinese Yuan" },
  ])

  const handleConvert = async () => {
    if (!amount || isNaN(Number.parseFloat(amount)) || Number.parseFloat(amount) <= 0) {
      setError("Please enter a valid amount")
      return
    }

    try {
      setLoading(true)
      setError(null)
      setIsFallback(false)

      const response = await fetch(`/api/currencies/convert?from=${fromCurrency}&to=${toCurrency}&amount=${amount}`)

      if (!response.ok) {
        throw new Error(`API Error (${response.status})`)
      }

      const data = await response.json()

      if (data.fallback) {
        setIsFallback(true)
      }

      setResult(data.result)
      setRate(data.rate)
      setLastUpdated(data.last_updated)
      setLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert currency")
      setLoading(false)

      const fallbackRates: Record<string, number> = {
        "USD-EGP": 50.85,
        "EUR-USD": 1.09,
        "USD-GBP": 0.79,
        "USD-JPY": 156.82,
      }

      const key = `${fromCurrency}-${toCurrency}`
      const reverseKey = `${toCurrency}-${fromCurrency}`

      let fallbackRate = 1.0

      if (fallbackRates[key]) {
        fallbackRate = fallbackRates[key]
      } else if (fallbackRates[reverseKey]) {
        fallbackRate = 1 / fallbackRates[reverseKey]
      } else if (fromCurrency === toCurrency) {
        fallbackRate = 1.0
      }

      setRate(fallbackRate)
      setResult(Number.parseFloat(amount) * fallbackRate)
      setLastUpdated(new Date().toISOString())
      setIsFallback(true)
    }
  }

  const handleSwap = () => {
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
  }

  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      handleConvert()
    }
  }, [fromCurrency, toCurrency])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
        <CardDescription>Convert between major currencies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="amount" className="text-sm font-medium">
              Amount
            </label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onBlur={handleConvert}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-end">
            <div className="grid gap-2">
              <label htmlFor="from-currency" className="text-sm font-medium">
                From
              </label>
              <Select value={fromCurrency} onValueChange={(value) => setFromCurrency(value)}>
                <SelectTrigger id="from-currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button variant="ghost" size="icon" onClick={handleSwap} className="mb-0.5" aria-label="Swap currencies">
              <ArrowRight className="h-4 w-4" />
            </Button>

            <div className="grid gap-2">
              <label htmlFor="to-currency" className="text-sm font-medium">
                To
              </label>
              <Select value={toCurrency} onValueChange={(value) => setToCurrency(value)}>
                <SelectTrigger id="to-currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code} - {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleConvert} disabled={loading} className="w-full">
            {loading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              "Convert"
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result !== null && rate !== null && !error && (
            <div className="mt-4 p-4 border rounded-md">
              <div className="text-2xl font-bold text-center">
                {Number.parseFloat(amount).toFixed(2)} {fromCurrency} = {result.toFixed(2)} {toCurrency}
              </div>
              <div className="text-sm text-muted-foreground text-center mt-2">
                1 {fromCurrency} = {rate.toFixed(4)} {toCurrency}
              </div>
              {lastUpdated && (
                <div className="text-xs text-muted-foreground text-center mt-1">
                  Last updated: {new Date(lastUpdated).toLocaleString()}
                </div>
              )}
              {isFallback && (
                <div className="text-xs text-amber-600 text-center mt-1 flex items-center justify-center">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Using demo data
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
