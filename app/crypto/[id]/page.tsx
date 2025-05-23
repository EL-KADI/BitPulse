import Image from "next/image";
import {
  ArrowLeft,
  ExternalLink,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PriceChart } from "@/components/price-chart";

interface CryptoDetailPageProps {
  params: {
    id: string;
  };
}

async function getCryptoData(id: string) {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "https://bit-pulse-iota.vercel.app/");

    const response = await fetch(`${baseUrl}/api/crypto/latest?id=${id}`, {
      next: { revalidate: 300 },
    });

    if (response.ok) {
      const data = await response.json();
      return data;
    }

    console.log(`API request failed for ${id}, using fallback data`);
    return generateMockData(id);
  } catch (error) {
    console.error("Error fetching crypto data:", error);
    return generateMockData(id);
  }
}

function generateMockData(id: string) {
  const formattedId = id.replace(/-/g, " ");
  const words = formattedId.split(" ");
  const symbol = words
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const cryptoImages: Record<string, string> = {
    bitcoin: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
    ethereum:
      "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
    solana: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
    cardano: "https://assets.coingecko.com/coins/images/975/large/cardano.png",
    dogecoin: "https://assets.coingecko.com/coins/images/5/large/dogecoin.png",
    ripple:
      "https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png",
    polkadot:
      "https://assets.coingecko.com/coins/images/12171/large/polkadot.png",
    avalanche:
      "https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png",
  };

  return {
    id: id,
    symbol: symbol,
    name: words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    image:
      cryptoImages[id] || `/placeholder.svg?height=48&width=48&text=${symbol}`,
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
  };
}

export default async function CryptoDetailPage({
  params,
}: CryptoDetailPageProps) {
  const crypto = await getCryptoData(params.id);

  const formatPrice = (price: number) => {
    if (price < 0.01) {
      return `$${price.toFixed(6)}`;
    } else if (price < 1) {
      return `$${price.toFixed(4)}`;
    } else {
      return `$${price.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }
  };

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${marketCap.toLocaleString()}`;
    }
  };

  const isPositiveChange = crypto.price_change_percentage_24h >= 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/crypto">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cryptocurrencies
          </Button>
        </Link>

        <div className="flex items-center space-x-4 mb-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={crypto.image || "/placeholder.svg"}
              alt={crypto.name}
              fill
              sizes="48px"
              className="object-cover"
              unoptimized
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{crypto.name}</h1>
            <div className="flex items-center space-x-2">
              <span className="text-muted-foreground">{crypto.symbol}</span>
              {crypto.market_cap_rank && (
                <Badge variant="secondary">
                  Rank #{crypto.market_cap_rank}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-4xl font-bold">{formatPrice(crypto.price)}</div>
          <div
            className={`flex items-center space-x-1 ${
              isPositiveChange ? "text-green-500" : "text-red-500"
            }`}
          >
            {isPositiveChange ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
            <span className="text-lg font-medium">
              {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
            </span>
            <span className="text-sm text-muted-foreground">(24h)</span>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <PriceChart
            title={`${crypto.name} Price Chart`}
            description={`${crypto.symbol}/USD price over time`}
            endpoint={`/api/crypto/history?id=${crypto.id}`}
            color="rgb(59, 130, 246)"
            yAxisSymbol="$ "
            timeRanges={[
              { label: "24H", days: 1 },
              { label: "7D", days: 7 },
              { label: "30D", days: 30 },
              { label: "90D", days: 90 },
              { label: "1Y", days: 365 },
            ]}
          />

          <Card>
            <CardHeader>
              <CardTitle>Market Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">
                    Market Cap
                  </div>
                  <div className="text-lg font-semibold">
                    {crypto.market_cap
                      ? formatMarketCap(crypto.market_cap)
                      : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    24h Volume
                  </div>
                  <div className="text-lg font-semibold">
                    {crypto.total_volume
                      ? formatMarketCap(crypto.total_volume)
                      : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">24h High</div>
                  <div className="text-lg font-semibold">
                    {crypto.high_24h ? formatPrice(crypto.high_24h) : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">24h Low</div>
                  <div className="text-lg font-semibold">
                    {crypto.low_24h ? formatPrice(crypto.low_24h) : "—"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    All-Time High
                  </div>
                  <div className="text-lg font-semibold">—</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">
                    All-Time Low
                  </div>
                  <div className="text-lg font-semibold">—</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price Change (1h)</span>
                <span
                  className={
                    crypto.price_change_percentage_1h_in_currency >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }
                >
                  {crypto.price_change_percentage_1h_in_currency
                    ? `${crypto.price_change_percentage_1h_in_currency.toFixed(
                        2
                      )}%`
                    : "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Price Change (24h)
                </span>
                <span
                  className={
                    isPositiveChange ? "text-green-500" : "text-red-500"
                  }
                >
                  {crypto.price_change_percentage_24h.toFixed(2)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Market Cap Rank</span>
                <span>#{crypto.market_cap_rank || "—"}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                asChild
              >
                <a
                  href={`https://coingecko.com/en/coins/${crypto.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on CoinGecko
                </a>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start"
                asChild
              >
                <a
                  href={`https://coinmarketcap.com/currencies/${crypto.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View on CoinMarketCap
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About {crypto.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {crypto.name} ({crypto.symbol}) is a cryptocurrency that ranks #
                {crypto.market_cap_rank || "—"} by market capitalization. The
                current price is {formatPrice(crypto.price)} with a 24-hour
                trading volume of{" "}
                {crypto.total_volume
                  ? formatMarketCap(crypto.total_volume)
                  : "—"}
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
