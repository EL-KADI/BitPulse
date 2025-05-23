"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface Cryptocurrency {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  market_cap: number
  market_cap_rank: number
  total_volume: number
  price_change_percentage_24h: number
  price_change_percentage_7d_in_currency: number
  price_change_percentage_1h_in_currency: number
}

interface Category {
  category_id: string
  name: string
}

export function CryptoList() {
  const [cryptos, setCryptos] = useState<Cryptocurrency[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("market_cap_desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true)
        const response = await fetch("/api/crypto/categories")
        if (response.ok) {
          const data = await response.json()
          setCategories(data.data || [])
        } else {
          console.log("Failed to fetch categories, using default list")
          setCategories([
            { category_id: "layer-1", name: "Layer 1 (L1)" },
            { category_id: "smart-contract-platform", name: "Smart Contract Platform" },
            { category_id: "decentralized-finance-defi", name: "Decentralized Finance (DeFi)" },
            { category_id: "stablecoins", name: "Stablecoins" },
            { category_id: "meme-token", name: "Meme Tokens" },
          ])
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
        setCategories([
          { category_id: "layer-1", name: "Layer 1 (L1)" },
          { category_id: "smart-contract-platform", name: "Smart Contract Platform" },
          { category_id: "decentralized-finance-defi", name: "Decentralized Finance (DeFi)" },
          { category_id: "stablecoins", name: "Stablecoins" },
          { category_id: "meme-token", name: "Meme Tokens" },
        ])
      } finally {
        setCategoriesLoading(false)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchCryptos = async () => {
      try {
        setLoading(true)

        let url = `/api/crypto/list?page=${currentPage}&per_page=50&order=${sortBy}`
        if (selectedCategory !== "all") {
          url += `&category=${selectedCategory}`
        }

        const response = await fetch(url)
        if (!response.ok) {
          throw new Error("Failed to fetch cryptocurrencies")
        }

        const data = await response.json()
        setCryptos(data.data || [])
        setTotalPages(Math.ceil((data.total_count || 0) / 50))
        setLoading(false)
      } catch (error) {
        console.error("Error fetching cryptocurrencies:", error)
        setLoading(false)
      }
    }

    fetchCryptos()
  }, [currentPage, sortBy, selectedCategory])

  const filteredCryptos = useMemo(() => {
    if (!searchQuery) return cryptos

    return cryptos.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [cryptos, searchQuery])

  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return `$${price.toFixed(6)}`
    } else if (price < 1) {
      return `$${price.toFixed(4)}`
    } else {
      return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`
    } else {
      return `$${marketCap.toLocaleString()}`
    }
  }

  const formatPercentage = (percentage: number) => {
    const isPositive = percentage >= 0
    return (
      <span className={`flex items-center ${isPositive ? "text-green-500" : "text-red-500"}`}>
        {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
        {Math.abs(percentage).toFixed(2)}%
      </span>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Cryptocurrencies</CardTitle>
        <CardDescription>Complete list of cryptocurrencies with real-time data</CardDescription>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search cryptocurrencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory} disabled={categoriesLoading}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.category_id} value={category.category_id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="market_cap_desc">Market Cap (High to Low)</SelectItem>
              <SelectItem value="market_cap_asc">Market Cap (Low to High)</SelectItem>
              <SelectItem value="volume_desc">Volume (High to Low)</SelectItem>
              <SelectItem value="id_asc">Name (A to Z)</SelectItem>
              <SelectItem value="gecko_desc">Trending</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[80px]" />
                <Skeleton className="h-4 w-[60px]" />
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">#</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">1h %</TableHead>
                    <TableHead className="text-right">24h %</TableHead>
                    <TableHead className="text-right">7d %</TableHead>
                    <TableHead className="text-right">Market Cap</TableHead>
                    <TableHead className="text-right">Volume (24h)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCryptos.map((crypto) => (
                    <TableRow key={crypto.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{crypto.market_cap_rank || "—"}</TableCell>
                      <TableCell>
                        <Link href={`/crypto/${crypto.id}`} className="flex items-center space-x-3 hover:text-primary">
                          <Image
                            src={crypto.image || "/placeholder.svg?height=24&width=24"}
                            alt={crypto.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <div>
                            <div className="font-medium">{crypto.name}</div>
                            <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
                          </div>
                        </Link>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatPrice(crypto.current_price)}</TableCell>
                      <TableCell className="text-right">
                        {crypto.price_change_percentage_1h_in_currency !== null
                          ? formatPercentage(crypto.price_change_percentage_1h_in_currency)
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {crypto.price_change_percentage_24h !== null
                          ? formatPercentage(crypto.price_change_percentage_24h)
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {crypto.price_change_percentage_7d_in_currency !== null
                          ? formatPercentage(crypto.price_change_percentage_7d_in_currency)
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {crypto.market_cap ? formatMarketCap(crypto.market_cap) : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        {crypto.total_volume ? formatMarketCap(crypto.total_volume) : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {filteredCryptos.length === 0 && !loading && (
              <div className="text-center py-8 text-muted-foreground">
                No cryptocurrencies found matching your search criteria.
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
