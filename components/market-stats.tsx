"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, DollarSign, Activity } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface MarketStats {
  total_market_cap: number
  total_volume: number
  market_cap_change_percentage_24h: number
  active_cryptocurrencies: number
  markets: number
  market_cap_percentage: { [key: string]: number }
}

export function MarketStats() {
  const [stats, setStats] = useState<MarketStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMarketStats = async () => {
      try {
        // Mock data since we don't have a global stats endpoint
        setStats({
          total_market_cap: 2450000000000, // $2.45T
          total_volume: 89000000000, // $89B
          market_cap_change_percentage_24h: 1.2,
          active_cryptocurrencies: 13500,
          markets: 1050,
          market_cap_percentage: {
            btc: 52.1,
            eth: 17.8,
            others: 30.1,
          },
        })
        setLoading(false)
      } catch (error) {
        console.error("Error fetching market stats:", error)
        setLoading(false)
      }
    }

    fetchMarketStats()
  }, [])

  const formatMarketCap = (value: number) => {
    if (value >= 1e12) {
      return `$${(value / 1e12).toFixed(2)}T`
    } else if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`
    } else {
      return `$${value.toLocaleString()}`
    }
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px]" />
              <Skeleton className="h-4 w-[80px] mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Market Cap</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMarketCap(stats.total_market_cap)}</div>
          <p
            className={`text-xs flex items-center mt-1 ${
              stats.market_cap_change_percentage_24h >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {stats.market_cap_change_percentage_24h >= 0 ? (
              <TrendingUp className="mr-1 h-3 w-3" />
            ) : (
              <TrendingDown className="mr-1 h-3 w-3" />
            )}
            {Math.abs(stats.market_cap_change_percentage_24h).toFixed(2)}% from yesterday
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">24h Trading Volume</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMarketCap(stats.total_volume)}</div>
          <p className="text-xs text-muted-foreground mt-1">Across all exchanges</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Cryptocurrencies</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.active_cryptocurrencies.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground mt-1">Tracked currencies</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bitcoin Dominance</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.market_cap_percentage.btc.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground mt-1">Of total market cap</p>
        </CardContent>
      </Card>
    </div>
  )
}
