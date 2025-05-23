import { PriceChart } from "@/components/price-chart";
import { CryptoList } from "@/components/crypto-list";
import { TrendingCryptos } from "@/components/trending-cryptos";
import { MarketStats } from "@/components/market-stats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CryptoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Cryptocurrencies</h1>
        <p className="text-muted-foreground mt-2">
          Track all cryptocurrencies and their performance
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Market Overview</h2>
        <MarketStats />
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-8">
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Featured Cryptocurrencies</h2>
            <Tabs defaultValue="bitcoin" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="bitcoin">Bitcoin</TabsTrigger>
                <TabsTrigger value="ethereum">Ethereum</TabsTrigger>
                <TabsTrigger value="solana">Solana</TabsTrigger>
                <TabsTrigger value="cardano">Cardano</TabsTrigger>
              </TabsList>
              <TabsContent value="bitcoin">
                <PriceChart
                  title="Bitcoin (BTC/USD)"
                  description="Bitcoin price in USD"
                  endpoint="/api/crypto/history?id=bitcoin"
                  color="rgb(247, 147, 26)"
                  yAxisSymbol="$ "
                  timeRanges={[
                    { label: "7D", days: 7 },
                    { label: "30D", days: 30 },
                    { label: "90D", days: 90 },
                    { label: "1Y", days: 365 },
                  ]}
                />
              </TabsContent>
              <TabsContent value="ethereum">
                <PriceChart
                  title="Ethereum (ETH/USD)"
                  description="Ethereum price in USD"
                  endpoint="/api/crypto/history?id=ethereum"
                  color="rgb(98, 126, 234)"
                  yAxisSymbol="$ "
                  timeRanges={[
                    { label: "7D", days: 7 },
                    { label: "30D", days: 30 },
                    { label: "90D", days: 90 },
                    { label: "1Y", days: 365 },
                  ]}
                />
              </TabsContent>
              <TabsContent value="solana">
                <PriceChart
                  title="Solana (SOL/USD)"
                  description="Solana price in USD"
                  endpoint="/api/crypto/history?id=solana"
                  color="rgb(20, 241, 149)"
                  yAxisSymbol="$ "
                  timeRanges={[
                    { label: "7D", days: 7 },
                    { label: "30D", days: 30 },
                    { label: "90D", days: 90 },
                    { label: "1Y", days: 365 },
                  ]}
                />
              </TabsContent>
              <TabsContent value="cardano">
                <PriceChart
                  title="Cardano (ADA/USD)"
                  description="Cardano price in USD"
                  endpoint="/api/crypto/history?id=cardano"
                  color="rgb(0, 51, 173)"
                  yAxisSymbol="$ "
                  timeRanges={[
                    { label: "7D", days: 7 },
                    { label: "30D", days: 30 },
                    { label: "90D", days: 90 },
                    { label: "1Y", days: 365 },
                  ]}
                />
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">All Cryptocurrencies</h2>
            <CryptoList />
          </div>
        </div>

        <div className="space-y-8">
          <TrendingCryptos />

          <Card>
            <CardHeader>
              <CardTitle>Crypto Market Insights</CardTitle>
              <CardDescription>
                Key factors affecting cryptocurrency prices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">Market Factors</h3>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      Regulatory developments can significantly impact crypto
                      prices
                    </li>
                    <li>
                      Institutional adoption continues to drive market growth
                    </li>
                    <li>
                      Market sentiment and technical factors influence
                      short-term movements
                    </li>
                    <li>
                      Bitcoin halving events historically precede bull markets
                    </li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Recent Trends</h3>
                  <p className="text-sm">
                    The cryptocurrency market has matured significantly in 2025,
                    with increased institutional participation and regulatory
                    clarity. Layer-2 scaling solutions and interoperability
                    protocols continue to drive innovation.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Popular Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      DeFi
                    </span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Layer 1
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                      Gaming
                    </span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
                      Metaverse
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                      Meme
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fear & Greed Index</CardTitle>
              <CardDescription>Market sentiment indicator</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-500 mb-2">
                  64
                </div>
                <div className="text-sm text-muted-foreground mb-4">Greed</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: "64%" }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Based on volatility, market momentum, social media, and
                  surveys
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
