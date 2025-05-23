"use client"

import { useEffect, useState } from "react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type ChartOptions,
} from "chart.js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface PriceChartProps {
  title: string
  description?: string
  endpoint: string
  color?: string
  yAxisSymbol?: string
  timeRanges?: { label: string; days: number }[]
}

export function PriceChart({
  title,
  description,
  endpoint,
  color = "rgb(59, 130, 246)",
  yAxisSymbol = "$",
  timeRanges = [
    { label: "7D", days: 7 },
    { label: "30D", days: 30 },
    { label: "90D", days: 90 },
  ],
}: PriceChartProps) {
  const [chartData, setChartData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selectedRange, setSelectedRange] = useState(timeRanges[1])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        const url = `${endpoint}${endpoint.includes("?") ? "&" : "?"}days=${selectedRange.days}`
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }

        const data = await response.json()

        if (!data || !data.data || data.data.length === 0) {
          throw new Error("No data available")
        }

        const formattedData = {
          labels: data.data.map((item: any) => {
            const date = new Date(item.date)
            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
          }),
          datasets: [
            {
              label: title,
              data: data.data.map((item: any) => item.price || item.rate),
              borderColor: color,
              backgroundColor: `${color}33`,
              fill: true,
              tension: 0.4,
              pointRadius: 0,
              pointHoverRadius: 4,
              borderWidth: 2,
            },
          ],
        }

        setChartData(formattedData)
        setLoading(false)
      } catch (err) {
        setError(true)
        setLoading(false)
      }
    }

    fetchData()
  }, [endpoint, selectedRange, color, title])

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
        callbacks: {
          label: (context) => {
            let label = context.dataset.label || ""
            if (label) {
              label += ": "
            }
            if (context.parsed.y !== null) {
              label += `${yAxisSymbol}${context.parsed.y.toFixed(2)}`
            }
            return label
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxRotation: 0,
          autoSkip: true,
          maxTicksLimit: 8,
        },
      },
      y: {
        grid: {
          borderDash: [5, 5],
        },
        ticks: {
          callback: (value) => `${yAxisSymbol}${value}`,
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex space-x-1">
            {timeRanges.map((range) => (
              <Button
                key={range.label}
                variant={selectedRange.days === range.days ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRange(range)}
                className="text-xs px-2 h-7"
              >
                {range.label}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Failed to load chart data
            </div>
          ) : chartData ? (
            <Line data={chartData} options={chartOptions} />
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}
