import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const base = searchParams.get("base") || "USD"
  const target = searchParams.get("target") || "EGP"
  const days = Number.parseInt(searchParams.get("days") || "30")

  try {
    const defaultRates: Record<string, number> = {
      "USD-EGP": 50.85,
      "EUR-USD": 1.09,
      "USD-GBP": 0.79,
      "USD-JPY": 156.82,
      "USD-AED": 3.67,
      "USD-SAR": 3.75,
      "USD-CAD": 1.36,
      "USD-AUD": 1.51,
      "USD-CNY": 7.23,
    }

    const rate =
      defaultRates[`${base}-${target}`] ||
      (defaultRates[`${target}-${base}`] ? 1 / defaultRates[`${target}-${base}`] : 10)

    const historicalData = []
    const today = new Date()

    for (let i = 0; i < days; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`

      const daysFactor = i / days
      const randomFactor = 0.99 + Math.random() * 0.02
      const trendFactor = 1 + daysFactor * 0.03 * (Math.random() > 0.5 ? 1 : -1)

      const dailyRate = rate * randomFactor * trendFactor

      historicalData.push({
        date: formattedDate,
        rate: Math.round(dailyRate * 10000) / 10000,
      })
    }

    return NextResponse.json({
      base,
      target,
      data: historicalData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
      fallback: true,
      message: "Using generated historical data as real-time API requires paid subscription",
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to generate historical currency data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
