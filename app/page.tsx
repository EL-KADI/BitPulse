import Link from "next/link"
import { ArrowRight, DollarSign, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PriceSummary } from "@/components/price-summary"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Real-time Financial Data at Your Fingertips
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Track currencies and cryptocurrencies with interactive charts and real-time updates.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/currencies">Explore Currencies</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/crypto">View Cryptocurrencies</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Quick Price Summary</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <PriceSummary title="USD/EGP" type="currency" icon={<DollarSign className="h-5 w-5" />} href="/currencies" />
          <PriceSummary title="Bitcoin (BTC)" type="crypto" icon={<TrendingUp className="h-5 w-5" />} href="/crypto" />
        </div>
      </section>

      <section className="py-8 md:py-12">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Explore Financial Data</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Traditional Currencies</CardTitle>
              <CardDescription>Track exchange rates and convert between major currencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                <DollarSign className="h-16 w-16 text-primary" />
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Real-time exchange rates
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Currency converter
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Historical exchange rates
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/currencies">
                  View Currencies <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Cryptocurrencies</CardTitle>
              <CardDescription>Track major cryptocurrencies and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-4">
                <TrendingUp className="h-16 w-16 text-primary" />
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Real-time crypto prices
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Major cryptocurrencies
                </li>
                <li className="flex items-center">
                  <span className="mr-2">•</span>
                  Historical price charts
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/crypto">
                  View Cryptocurrencies <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>
    </div>
  )
}
