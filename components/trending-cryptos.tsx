"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Flame } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface TrendingCrypto {
  id: string
  symbol: string
  name: string
  thumb: string
  market_cap_rank: number
  price_btc: number
}

export function TrendingCryptos() {
  const [trending, setTrending] = useState<TrendingCrypto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch("/api/crypto/list?per_page=10&order=gecko_desc")
        if (response.ok) {
          const data = await response.json()
          const trendingData = data.data.slice(0, 7).map((crypto: any) => ({
            id: crypto.id,
            symbol: crypto.symbol,
            name: crypto.name,
            thumb: crypto.image,
            market_cap_rank: crypto.market_cap_rank,
            price_btc: crypto.current_price / 67890.12,
          }))
          setTrending(trendingData)
        } else {
          setTrending(getMockTrendingData())
        }
        setLoading(false)
      } catch (error) {
        console.error("Error fetching trending cryptos:", error)
        setTrending(getMockTrendingData())
        setLoading(false)
      }
    }

    fetchTrending()
  }, [])

  const getMockTrendingData = () => [
    {
      id: "bitcoin",
      symbol: "BTC",
      name: "Bitcoin",
      thumb: "/placeholder.svg?height=24&width=24",
      market_cap_rank: 1,
      price_btc: 1,
    },
    {
      id: "ethereum",
      symbol: "ETH",
      name: "Ethereum",
      thumb: "/placeholder.svg?height=24&width=24",
      market_cap_rank: 2,
      price_btc: 0.051,
    },
    {
      id: "solana",
      symbol: "SOL",
      name: "Solana",
      thumb: "/placeholder.svg?height=24&width=24",
      market_cap_rank: 5,
      price_btc: 0.0023,
    },
    {
      id: "binancecoin",
      symbol: "BNB",
      name: "BNB",
      thumb: "/placeholder.svg?height=24&width=24",
      market_cap_rank: 4,
      price_btc: 0.009,
    },
    {
      id: "cardano",
      symbol: "ADA",
      name: "Cardano",
      thumb: "/placeholder.svg?height=24&width=24",
      market_cap_rank: 9,
      price_btc: 0.0000085,
    },
    {
      id: "dogecoin",
      symbol: "DOGE",
      name: "Dogecoin",
      thumb: "/placeholder.svg?height=24&width=24",
      market_cap_rank: 8,
      price_btc: 0.0000056,
    },
    {
      id: "avalanche-2",
      symbol: "AVAX",
      name: "Avalanche",
      thumb: "/placeholder.svg?height=24&width=24",
      market_cap_rank: 10,
      price_btc: 0.00062,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Flame className="w-5 h-5 mr-2 text-orange-500" />
          Trending Cryptocurrencies
        </CardTitle>
        <CardDescription>Most searched cryptocurrencies in the last 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-4 w-[60px]" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {trending.map((crypto, index) => (
              <Link
                key={crypto.id}
                href={`/crypto/${crypto.id}`}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                    {index + 1}
                  </Badge>
                  <Image
                    src={crypto.thumb || "/placeholder.svg?height=24&width=24"}
                    alt={crypto.name}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                  <div>
                    <div className="font-medium text-sm">{crypto.name}</div>
                    <div className="text-xs text-muted-foreground">{crypto.symbol}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">₿ {crypto.price_btc.toFixed(6)}</div>
                  <div className="text-xs text-muted-foreground">#{crypto.market_cap_rank}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
