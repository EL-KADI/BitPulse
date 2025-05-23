"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowUp, ArrowDown, AlertCircle, Wifi, WifiOff } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface PriceSummaryProps {
  title: string
  type: "currency" | "crypto"
  icon: React.ReactNode
  href: string
}

export function PriceSummary({ title, type, icon, href }: PriceSummaryProps) {
  const [price, setPrice] = useState<number | null>(null)
  const [change, setChange] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFallback, setIsFallback] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      let endpoint = ""

      switch (type) {
        case "currency":
          endpoint = "/api/currencies/latest?base=USD&target=EGP"
          break
        case "crypto":
          endpoint = "/api/crypto/latest?id=bitcoin"
          break
      }

      const response = await fetch(endpoint, {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.fallback) {
        setIsFallback(true)
      } else {
        setIsFallback(false)
      }

      if (type === "currency") {
        setPrice(data.rate)
        setChange(data.change || 0)
      } else if (type === "crypto") {
        setPrice(data.price)
        setChange(data.price_change_percentage_24h || 0)
      }

      setLoading(false)
      setRetryCount(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to fetch ${type} data`)

      setIsFallback(true)

      if (type === "currency") {
        setPrice(50.85)
        setChange(0.2)
      } else if (type === "crypto") {
        setPrice(67890.12)
        setChange(-1.2)
      }

      setLoading(false)

      if (retryCount < 2) {
        const retryDelay = 5000 * Math.pow(2, retryCount)

        setTimeout(() => {
          setRetryCount((prev) => prev + 1)
          fetchData()
        }, retryDelay)
      }
    }
  }

  useEffect(() => {
    fetchData()

    const intervalId = setInterval(fetchData, 120000)

    return () => clearInterval(intervalId)
  }, [type])

  const formatPrice = (value: number | null) => {
    if (value === null) return "—"

    if (type === "currency") {
      return value.toFixed(2)
    } else if (type === "crypto") {
      return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    return value.toString()
  }

  const getStatusBadge = () => {
    if (loading) {
      return (
        <Badge variant="secondary" className="text-xs">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-1" />
          Loading
        </Badge>
      )
    }

    if (error && !isFallback) {
      return (
        <Badge variant="destructive" className="text-xs">
          <WifiOff className="w-3 h-3 mr-1" />
          Error
        </Badge>
      )
    }

    if (isFallback) {
      return (
        <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          Demo
        </Badge>
      )
    }

    return (
      <Badge variant="default" className="text-xs bg-green-100 text-green-800">
        <Wifi className="w-3 h-3 mr-1" />
        Live
      </Badge>
    )
  }

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          {getStatusBadge()}
          <div className="h-5 w-5 text-muted-foreground">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-[120px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold">{formatPrice(price)}</div>
            {change !== null && (
              <p className={`text-xs ${change >= 0 ? "text-green-500" : "text-red-500"} flex items-center mt-1`}>
                {change >= 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                {Math.abs(change).toFixed(2)}%
              </p>
            )}
            {error && !isFallback && (
              <p className="text-xs text-red-500 mt-1 flex items-center">
                <AlertCircle className="mr-1 h-3 w-3" />
                {error.length > 30 ? `${error.substring(0, 30)}...` : error}
              </p>
            )}
          </>
        )}
      </CardContent>
      <CardFooter>
        <Link href={href} className="text-xs text-muted-foreground hover:text-primary flex items-center">
          View details <ArrowRight className="ml-1 h-3 w-3" />
        </Link>
      </CardFooter>
    </Card>
  )
}
