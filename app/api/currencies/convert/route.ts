import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const from = searchParams.get("from") || "USD"
  const to = searchParams.get("to") || "EGP"
  const amount = searchParams.get("amount") || "1"
  const amountNum = Number.parseFloat(amount)

  try {
    const url = `https://open.er-api.com/v6/latest/${from}`

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

    if (!data.rates || !data.rates[to]) {
      throw new Error(`Rate for ${to} not found`)
    }

    const rate = data.rates[to]
    const result = amountNum * rate

    return NextResponse.json({
      from,
      to,
      amount: amountNum,
      result,
      rate,
      last_updated: data.time_last_update_utc || new Date().toISOString(),
    })
  } catch (error) {
    const fallbackRates = {
      USD: {
        EUR: 0.92,
        GBP: 0.79,
        JPY: 156.82,
        EGP: 50.85,
        AED: 3.67,
        SAR: 3.75,
        CAD: 1.36,
        AUD: 1.51,
        CNY: 7.23,
      },
      EUR: {
        USD: 1.09,
        GBP: 0.86,
        JPY: 170.46,
        EGP: 55.43,
        AED: 3.99,
        SAR: 4.08,
        CAD: 1.48,
        AUD: 1.64,
        CNY: 7.86,
      },
      GBP: {
        USD: 1.27,
        EUR: 1.17,
        JPY: 199.14,
        EGP: 64.58,
        AED: 4.67,
        SAR: 4.77,
        CAD: 1.73,
        AUD: 1.92,
        CNY: 9.18,
      },
    }

    let rate = 1.0

    if (from in fallbackRates && to in fallbackRates[from as keyof typeof fallbackRates]) {
      rate = fallbackRates[from as keyof typeof fallbackRates][to as any]
    } else if (from === to) {
      rate = 1.0
    } else if (to === "USD" && from in fallbackRates.USD) {
      rate = 1 / fallbackRates.USD[from as keyof typeof fallbackRates.USD]
    } else if (from === "USD" && to in fallbackRates.USD) {
      rate = fallbackRates.USD[to as keyof typeof fallbackRates.USD]
    }

    const result = amountNum * rate

    return NextResponse.json({
      from,
      to,
      amount: amountNum,
      result,
      rate,
      last_updated: new Date().toISOString(),
      fallback: true,
      error: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
