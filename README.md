# BitPulse - Financial Data Dashboard

A modern, real-time financial data dashboard built with Next.js that tracks currencies, gold prices, and cryptocurrencies.

## Features

- 📈 **Real-time Currency Exchange Rates** - Track major currency pairs with live updates
- 🥇 **Gold Price Tracking** - Monitor gold prices in multiple currencies
- 🪙 **Cryptocurrency Data** - Complete cryptocurrency market data with charts
- 🌙 **Dark Mode Support** - Beautiful dark/light theme switching
- 📱 **Responsive Design** - Works perfectly on all devices
- 📊 **Interactive Charts** - Historical price charts with multiple timeframes
- 🔍 **Search & Filter** - Find specific currencies or cryptocurrencies easily

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- API keys from the required services (see below)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <your-repo-url>
   cd bitpulse
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Set up environment variables**
   
   Copy the `.env.local` file and add your API keys:
   \`\`\`bash
   cp .env.local .env.local.example
   \`\`\`
   
   Then edit `.env.local` with your actual API keys:
   \`\`\`env
   EXCHANGE_RATE_API_KEY=your_actual_exchange_rate_api_key
   GOLD_API_KEY=your_actual_gold_api_key
   COINGECKO_API_KEY=your_actual_coingecko_api_key
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## API Keys Setup

### 1. ExchangeRate-API
- Visit [https://exchangerate-api.com/](https://exchangerate-api.com/)
- Sign up for a free account
- Get your API key from the dashboard
- Free tier: 1,500 requests/month

### 2. GoldAPI
- Visit [https://goldapi.io/](https://goldapi.io/)
- Sign up for a free account
- Get your API key from the dashboard
- Free tier: 100 requests/month

### 3. CoinGecko API
- Visit [https://coingecko.com/en/api](https://coingecko.com/en/api)
- Sign up for a free account
- Get your API key from the dashboard
- Free tier: 10,000 requests/month

## Project Structure

\`\`\`
bitpulse/
├── app/                    # Next.js 13+ App Router
│   ├── api/               # API routes
│   │   ├── currencies/    # Currency exchange APIs
│   │   ├── gold/          # Gold price APIs
│   │   └── crypto/        # Cryptocurrency APIs
│   ├── crypto/            # Cryptocurrency pages
│   ├── currencies/        # Currency pages
│   ├── gold/              # Gold price pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── crypto-list.tsx   # Cryptocurrency list
│   ├── price-chart.tsx   # Price charts
│   └── navbar.tsx        # Navigation
├── lib/                  # Utility functions
└── public/              # Static assets
\`\`\`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Deploy to Vercel

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in project settings

3. **Environment Variables on Vercel**
   Add these in your Vercel project settings:
   - `EXCHANGE_RATE_API_KEY`
   - `GOLD_API_KEY` 
   - `COINGECKO_API_KEY`
   - `NEXT_PUBLIC_BASE_URL` (set to your Vercel domain)

## Features Overview

### Currency Exchange
- Real-time exchange rates for major currencies
- Currency converter with live rates
- Historical exchange rate charts
- Support for 10+ major currencies

### Gold Prices
- Live gold prices in USD, EUR, and EGP
- Gold price charts with multiple timeframes
- Price per gram in different purities (24K, 22K, 18K)
- Market insights and trends

### Cryptocurrencies
- Complete cryptocurrency market data
- 13,500+ cryptocurrencies supported
- Real-time price updates
- Market cap, volume, and price change data
- Interactive price charts
- Search and filter functionality
- Trending cryptocurrencies
- Market statistics and insights

### User Experience
- Dark/Light mode toggle
- Responsive design for all devices
- Fast loading with optimized caching
- Error handling with fallback data
- Mobile-friendly navigation

## Technologies Used

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + shadcn/ui
- **Charts**: Chart.js with react-chartjs-2
- **Theme**: next-themes for dark mode
- **Icons**: Lucide React
- **TypeScript**: Full type safety

## API Rate Limiting

The application includes intelligent rate limiting handling:
- Automatic fallback to cached/mock data when rate limits are hit
- Graceful error handling for API failures
- Optimized request patterns to minimize API calls

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/your-username/bitpulse/issues) page
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## Acknowledgments

- [ExchangeRate-API](https://exchangerate-api.com/) for currency data
- [GoldAPI](https://goldapi.io/) for gold price data  
- [CoinGecko](https://coingecko.com/) for cryptocurrency data
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
\`\`\`

```gitignore file=".gitignore"
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
