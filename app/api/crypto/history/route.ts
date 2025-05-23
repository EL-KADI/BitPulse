import { type NextRequest, NextResponse } from "next/server"

function generateMockHistoricalData(id: string, days: number) {
  const mockData = []
  const today = new Date()

  const basePrice = id === "bitcoin" ? 67890.12 : id === "ethereum" ? 3456.78 : 10 + Math.random() * 990

  const trendDirection = Math.random() > 0.5 ? 1 : -1

  const volatility = 0.005 + Math.random() * 0.045

  for (let i = 0; i < days; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() - (days - i - 1))
    const timestamp = date.getTime()

    const trendFactor = 1 + trendDirection * volatility * (i / days)

    const dailyChange = 1 + (Math.random() * volatility * 2 - volatility)

    const price = basePrice * trendFactor * dailyChange

    mockData.push({
      timestamp,
      date: date.toISOString().split("T")[0],
      price,
    })
  }

  return {
    id,
    currency: "usd",
    data: mockData,
    fallback: true,
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get("id") || "bitcoin"
  const currency = searchParams.get("currency") || "usd"
  const days = searchParams.get("days") || "30"

  try {
    const apiKey = process.env.COINGECKO_API_KEY

    if (!apiKey) {
      return NextResponse.json(generateMockHistoricalData(id, Number(days)))
    }

    const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}&api_key=${apiKey}`

    const response = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        Accept: "application/json",
        "User-Agent": "BitPulse/1.0",
      },
    })

    if (response.status === 429) {
      return NextResponse.json(generateMockHistoricalData(id, Number(days)))
    }

    if (!response.ok) {
      return NextResponse.json(generateMockHistoricalData(id, Number(days)))
    }

    const data = await response.json()

    if (!data || !data.prices || data.prices.length === 0) {
      return NextResponse.json(generateMockHistoricalData(id, Number(days)))
    }

    const formattedData = data.prices.map((item: [number, number]) => ({
      timestamp: item[0],
      date: new Date(item[0]).toISOString().split("T")[0],
      price: item[1],
    }))

    return NextResponse.json({
      id,
      currency,
      data: formattedData,
    })
  } catch (error) {
    return NextResponse.json(generateMockHistoricalData(id, Number(days)))
  }
}
