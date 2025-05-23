import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const base = searchParams.get("base") || "USD"
  const target = searchParams.get("target")

  try {
    const url = `https://open.er-api.com/v6/latest/${base}`

    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    if (data.result !== "success" && !data.rates) {
      throw new Error("Invalid API response format")
    }

    if (target) {
      if (!data.rates[target]) {
        throw new Error(`Target currency ${target} not found`)
      }

      return NextResponse.json({
        base,
        target,
        rate: data.rates[target],
        change: 0,
        last_updated: data.time_last_update_utc || new Date().toISOString(),
      })
    }

    return NextResponse.json({
      base,
      rates: data.rates,
      last_updated: data.time_last_update_utc || new Date().toISOString(),
    })
  } catch (error) {
    const fallbackRates = {
      USD: 1,
      EUR: 0.92,
      GBP: 0.79,
      JPY: 156.82,
      EGP: 50.85,
      AED: 3.67,
      SAR: 3.75,
      CAD: 1.36,
      AUD: 1.51,
      CNY: 7.23,
    }

    if (target) {
      if (base === "USD") {
        return NextResponse.json({
          base,
          target,
          rate: fallbackRates[target as keyof typeof fallbackRates] || 1,
          change: 0,
          last_updated: new Date().toISOString(),
          fallback: true,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }

      if (target === "USD") {
        const baseRate = fallbackRates[base as keyof typeof fallbackRates]
        if (baseRate) {
          return NextResponse.json({
            base,
            target,
            rate: 1 / baseRate,
            change: 0,
            last_updated: new Date().toISOString(),
            fallback: true,
            error: error instanceof Error ? error.message : "Unknown error",
          })
        }
      }

      return NextResponse.json({
        base,
        target,
        rate: 1,
        change: 0,
        last_updated: new Date().toISOString(),
        fallback: true,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }

    return NextResponse.json({
      base,
      rates: fallbackRates,
      last_updated: new Date().toISOString(),
      fallback: true,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
