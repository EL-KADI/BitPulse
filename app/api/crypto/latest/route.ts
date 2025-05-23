import { type NextRequest, NextResponse } from "next/server"

function generateMockData(id: string) {
  const formattedId = id.replace(/-/g, " ")
  const words = formattedId.split(" ")
  const symbol = words
    .map((word) => word[0])
    .join("")
    .toUpperCase()

  return {
    id: id,
    symbol: symbol,
    name: words.map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
    image: `/placeholder.svg?height=48&width=48`,
    price: 10 + Math.random() * 1000,
    market_cap: 1000000000 + Math.random() * 10000000000,
    market_cap_rank: Math.floor(Math.random() * 100) + 1,
    total_volume: 500000000 + Math.random() * 5000000000,
    high_24h: 10 + Math.random() * 1100,
    low_24h: 10 + Math.random() * 900,
    price_change_24h: Math.random() * 100 - 50,
    price_change_percentage_24h: Math.random() * 10 - 5,
    price_change_percentage_1h_in_currency: Math.random() * 5 - 2.5,
    price_change_percentage_7d_in_currency: Math.random() * 15 - 7.5,
    last_updated: new Date().toISOString(),
    fallback: true,
  }
}

function getRealisticMockData(id: string) {
  const mockPrices = {
    bitcoin: {
      price: 67890.12,
      change_24h: -1.2,
      change_1h: 0.1,
      change_7d: 2.5,
      market_cap: 1300000000000,
      volume: 32000000000,
    },
    ethereum: {
      price: 3456.78,
      change_24h: 1.5,
      change_1h: -0.2,
      change_7d: -0.8,
      market_cap: 420000000000,
      volume: 18000000000,
    },
    solana: {
      price: 156.42,
      change_24h: 3.2,
      change_1h: 0.8,
      change_7d: 8.1,
      market_cap: 72000000000,
      volume: 3200000000,
    },
    cardano: {
      price: 0.58,
      change_24h: -0.8,
      change_1h: -0.1,
      change_7d: 1.2,
      market_cap: 20000000000,
      volume: 850000000,
    },
    dogecoin: {
      price: 0.38,
      change_24h: 2.7,
      change_1h: 0.4,
      change_7d: 5.4,
      market_cap: 55000000000,
      volume: 2800000000,
    },
  }

  if (id in mockPrices) {
    const data = mockPrices[id as keyof typeof mockPrices]
    return {
      id: id,
      symbol:
        id === "bitcoin"
          ? "BTC"
          : id === "ethereum"
            ? "ETH"
            : id === "solana"
              ? "SOL"
              : id === "cardano"
                ? "ADA"
                : "DOGE",
      name: id.charAt(0).toUpperCase() + id.slice(1),
      image: `/placeholder.svg?height=48&width=48`,
      price: data.price,
      market_cap: data.market_cap,
      market_cap_rank: id === "bitcoin" ? 1 : id === "ethereum" ? 2 : id === "solana" ? 5 : id === "cardano" ? 9 : 8,
      total_volume: data.volume,
      high_24h: data.price * (1 + Math.random() * 0.05),
      low_24h: data.price * (1 - Math.random() * 0.05),
      price_change_24h: data.price * (data.change_24h / 100),
      price_change_percentage_24h: data.change_24h,
      price_change_percentage_1h_in_currency: data.change_1h,
      price_change_percentage_7d_in_currency: data.change_7d,
      last_updated: new Date().toISOString(),
      fallback: true,
    }
  }

  return generateMockData(id)
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const id = searchParams.get("id") || "bitcoin"
  const currency = searchParams.get("currency") || "usd"

  try {
    const apiKey = process.env.COINGECKO_API_KEY

    if (!apiKey) {
      return NextResponse.json(getRealisticMockData(id))
    }

    const url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${id}&api_key=${apiKey}`

    const response = await fetch(url, {
      next: { revalidate: 300 },
      headers: {
        Accept: "application/json",
        "User-Agent": "BitPulse/1.0",
      },
    })

    if (response.status === 429) {
      return NextResponse.json(getRealisticMockData(id))
    }

    if (!response.ok) {
      return NextResponse.json(getRealisticMockData(id))
    }

    const data = await response.json()

    if (!data || data.length === 0) {
      return NextResponse.json(getRealisticMockData(id))
    }

    const coinData = data[0]

    return NextResponse.json({
      id: coinData.id,
      symbol: coinData.symbol,
      name: coinData.name,
      image: coinData.image,
      price: coinData.current_price,
      market_cap: coinData.market_cap,
      market_cap_rank: coinData.market_cap_rank,
      total_volume: coinData.total_volume,
      high_24h: coinData.high_24h,
      low_24h: coinData.low_24h,
      price_change_24h: coinData.price_change_24h,
      price_change_percentage_24h: coinData.price_change_percentage_24h,
      price_change_percentage_7d_in_currency: coinData.price_change_percentage_7d_in_currency,
      price_change_percentage_1h_in_currency: coinData.price_change_percentage_1h_in_currency,
      last_updated: coinData.last_updated,
    })
  } catch (error) {
    return NextResponse.json(getRealisticMockData(id))
  }
}
