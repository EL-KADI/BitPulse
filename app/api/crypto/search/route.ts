import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q") || ""

  if (!query || query.length < 2) {
    return NextResponse.json({ data: [] })
  }

  try {
    const apiKey = process.env.COINGECKO_API_KEY

    if (!apiKey) {
      throw new Error("API key not configured")
    }

    const url = `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(query)}&api_key=${apiKey}`

    const response = await fetch(url, { next: { revalidate: 3600 } })

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()

    if (!data || !data.coins) {
      throw new Error("Invalid response format")
    }

    const formattedData = data.coins.slice(0, 10).map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol?.toUpperCase(),
      name: coin.name,
      thumb: coin.thumb,
      large: coin.large,
      market_cap_rank: coin.market_cap_rank,
    }))

    return NextResponse.json({
      data: formattedData,
    })
  } catch (error) {
    const mockResults = [
      {
        id: "bitcoin",
        symbol: "BTC",
        name: "Bitcoin",
        thumb: "/placeholder.svg?height=32&width=32",
        market_cap_rank: 1,
      },
      {
        id: "ethereum",
        symbol: "ETH",
        name: "Ethereum",
        thumb: "/placeholder.svg?height=32&width=32",
        market_cap_rank: 2,
      },
    ].filter(
      (coin) =>
        coin.name.toLowerCase().includes(query.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(query.toLowerCase()),
    )

    return NextResponse.json({
      data: mockResults,
    })
  }
}
