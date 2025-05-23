import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const page = Number.parseInt(searchParams.get("page") || "1")
  const perPage = Number.parseInt(searchParams.get("per_page") || "50")
  const category = searchParams.get("category") || ""
  const order = searchParams.get("order") || "market_cap_desc"

  try {
    const apiKey = process.env.COINGECKO_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        data: getMockCryptoData(),
        page,
        per_page: perPage,
        total_count: getMockCryptoData().length,
        fallback: true,
      })
    }

    let url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=${order}&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=1h%2C24h%2C7d&api_key=${apiKey}`

    if (category && category !== "all") {
      url += `&category=${category}`
    }

    const response = await fetch(url, {
      next: { revalidate: 300 },
      headers: {
        Accept: "application/json",
        "User-Agent": "BitPulse/1.0",
      },
    })

    if (response.status === 429) {
      return NextResponse.json({
        data: getMockCryptoData(),
        page,
        per_page: perPage,
        total_count: getMockCryptoData().length,
        fallback: true,
      })
    }

    if (!response.ok) {
      return NextResponse.json({
        data: getMockCryptoData(),
        page,
        per_page: perPage,
        total_count: getMockCryptoData().length,
        fallback: true,
      })
    }

    const data = await response.json()

    if (!data || !Array.isArray(data)) {
      return NextResponse.json({
        data: getMockCryptoData(),
        page,
        per_page: perPage,
        total_count: getMockCryptoData().length,
        fallback: true,
      })
    }

    const formattedData = data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol?.toUpperCase(),
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      market_cap_rank: coin.market_cap_rank,
      fully_diluted_valuation: coin.fully_diluted_valuation,
      total_volume: coin.total_volume,
      high_24h: coin.high_24h,
      low_24h: coin.low_24h,
      price_change_24h: coin.price_change_24h,
      price_change_percentage_24h: coin.price_change_percentage_24h,
      price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency,
      price_change_percentage_1h_in_currency: coin.price_change_percentage_1h_in_currency,
      market_cap_change_24h: coin.market_cap_change_24h,
      market_cap_change_percentage_24h: coin.market_cap_change_percentage_24h,
      circulating_supply: coin.circulating_supply,
      total_supply: coin.total_supply,
      max_supply: coin.max_supply,
      ath: coin.ath,
      ath_change_percentage: coin.ath_change_percentage,
      ath_date: coin.ath_date,
      atl: coin.atl,
      atl_change_percentage: coin.atl_change_percentage,
      atl_date: coin.atl_date,
      last_updated: coin.last_updated,
    }))

    return NextResponse.json({
      data: formattedData,
      page,
      per_page: perPage,
      total_count: formattedData.length,
    })
  } catch (error) {
    return NextResponse.json({
      data: getMockCryptoData(),
      page,
      per_page: perPage,
      total_count: getMockCryptoData().length,
      fallback: true,
    })
  }
}

function getMockCryptoData() {
  return [
    {
      id: "bitcoin",
      symbol: "BTC",
      name: "Bitcoin",
      image: "/placeholder.svg?height=32&width=32",
      current_price: 67890.12,
      market_cap: 1300000000000,
      market_cap_rank: 1,
      total_volume: 32000000000,
      high_24h: 68500,
      low_24h: 67000,
      price_change_24h: -800,
      price_change_percentage_24h: -1.2,
      price_change_percentage_7d_in_currency: 2.5,
      price_change_percentage_1h_in_currency: 0.1,
    },
    {
      id: "ethereum",
      symbol: "ETH",
      name: "Ethereum",
      image: "/placeholder.svg?height=32&width=32",
      current_price: 3456.78,
      market_cap: 420000000000,
      market_cap_rank: 2,
      total_volume: 18000000000,
      high_24h: 3500,
      low_24h: 3400,
      price_change_24h: 50,
      price_change_percentage_24h: 1.5,
      price_change_percentage_7d_in_currency: -0.8,
      price_change_percentage_1h_in_currency: -0.2,
    },
    {
      id: "tether",
      symbol: "USDT",
      name: "Tether",
      image: "/placeholder.svg?height=32&width=32",
      current_price: 1.0,
      market_cap: 95000000000,
      market_cap_rank: 3,
      total_volume: 45000000000,
      high_24h: 1.001,
      low_24h: 0.999,
      price_change_24h: 0.001,
      price_change_percentage_24h: 0.1,
      price_change_percentage_7d_in_currency: 0.0,
      price_change_percentage_1h_in_currency: 0.0,
    },
    {
      id: "binancecoin",
      symbol: "BNB",
      name: "BNB",
      image: "/placeholder.svg?height=32&width=32",
      current_price: 612.45,
      market_cap: 89000000000,
      market_cap_rank: 4,
      total_volume: 2100000000,
      high_24h: 620,
      low_24h: 605,
      price_change_24h: 8.45,
      price_change_percentage_24h: 1.4,
      price_change_percentage_7d_in_currency: 3.2,
      price_change_percentage_1h_in_currency: 0.3,
    },
    {
      id: "solana",
      symbol: "SOL",
      name: "Solana",
      image: "/placeholder.svg?height=32&width=32",
      current_price: 156.42,
      market_cap: 72000000000,
      market_cap_rank: 5,
      total_volume: 3200000000,
      high_24h: 160,
      low_24h: 152,
      price_change_24h: 4.92,
      price_change_percentage_24h: 3.2,
      price_change_percentage_7d_in_currency: 8.1,
      price_change_percentage_1h_in_currency: 0.8,
    },
    {
      id: "usd-coin",
      symbol: "USDC",
      name: "USDC",
      image: "/placeholder.svg?height=32&width=32",
      current_price: 1.0,
      market_cap: 32000000000,
      market_cap_rank: 6,
      total_volume: 8500000000,
      high_24h: 1.001,
      low_24h: 0.999,
      price_change_24h: 0.0,
      price_change_percentage_24h: 0.0,
      price_change_percentage_7d_in_currency: 0.0,
      price_change_percentage_1h_in_currency: 0.0,
    },
    {
      id: "ripple",
      symbol: "XRP",
      name: "XRP",
      image: "/placeholder.svg?height=32&width=32",
      current_price: 0.62,
      market_cap: 35000000000,
      market_cap_rank: 7,
      total_volume: 1800000000,
      high_24h: 0.64,
      low_24h: 0.61,
      price_change_24h: 0.003,
      price_change_percentage_24h: 0.5,
      price_change_percentage_7d_in_currency: -2.1,
      price_change_percentage_1h_in_currency: 0.1,
    },
    {
      id: "dogecoin",
      symbol: "DOGE",
      name: "Dogecoin",
      image: "/placeholder.svg?height=32&width=32",
      current_price: 0.38,
      market_cap: 55000000000,
      market_cap_rank: 8,
      total_volume: 2800000000,
      high_24h: 0.39,
      low_24h: 0.37,
      price_change_24h: 0.01,
      price_change_percentage_24h: 2.7,
      price_change_percentage_7d_in_currency: 5.4,
      price_change_percentage_1h_in_currency: 0.4,
    },
    {
      id: "cardano",
      symbol: "ADA",
      name: "Cardano",
      image: "/placeholder.svg?height=32&width=32",
      current_price: 0.58,
      market_cap: 20000000000,
      market_cap_rank: 9,
      total_volume: 850000000,
      high_24h: 0.59,
      low_24h: 0.57,
      price_change_24h: -0.005,
      price_change_percentage_24h: -0.8,
      price_change_percentage_7d_in_currency: 1.2,
      price_change_percentage_1h_in_currency: -0.1,
    },
    {
      id: "avalanche-2",
      symbol: "AVAX",
      name: "Avalanche",
      image: "/placeholder.svg?height=32&width=32",
      current_price: 42.15,
      market_cap: 16000000000,
      market_cap_rank: 10,
      total_volume: 680000000,
      high_24h: 43.2,
      low_24h: 41.8,
      price_change_24h: 0.85,
      price_change_percentage_24h: 2.1,
      price_change_percentage_7d_in_currency: 4.7,
      price_change_percentage_1h_in_currency: 0.3,
    },
  ]
}
