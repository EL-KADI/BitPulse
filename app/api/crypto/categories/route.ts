import { NextResponse } from "next/server"

export async function GET() {
  try {
    const apiKey = process.env.COINGECKO_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        data: getMockCategories(),
      })
    }

    const url = `https://api.coingecko.com/api/v3/coins/categories/list?api_key=${apiKey}`

    const response = await fetch(url, {
      next: { revalidate: 86400 },
      headers: {
        Accept: "application/json",
        "User-Agent": "BitPulse/1.0",
      },
    })

    if (response.status === 429) {
      return NextResponse.json({
        data: getMockCategories(),
      })
    }

    if (!response.ok) {
      return NextResponse.json({
        data: getMockCategories(),
      })
    }

    const data = await response.json()

    if (!data || !Array.isArray(data)) {
      return NextResponse.json({
        data: getMockCategories(),
      })
    }

    const formattedData = data.slice(0, 20).map((category: any) => ({
      category_id: category.category_id,
      name: category.name,
    }))

    return NextResponse.json({
      data: formattedData,
    })
  } catch (error) {
    return NextResponse.json({
      data: getMockCategories(),
    })
  }
}

function getMockCategories() {
  return [
    { category_id: "layer-1", name: "Layer 1 (L1)" },
    { category_id: "smart-contract-platform", name: "Smart Contract Platform" },
    { category_id: "decentralized-finance-defi", name: "Decentralized Finance (DeFi)" },
    { category_id: "exchange-based-tokens", name: "Exchange-based Tokens" },
    { category_id: "stablecoins", name: "Stablecoins" },
    { category_id: "meme-token", name: "Meme Tokens" },
    { category_id: "gaming", name: "Gaming" },
    { category_id: "metaverse", name: "Metaverse" },
    { category_id: "nft", name: "NFT" },
    { category_id: "artificial-intelligence", name: "Artificial Intelligence" },
    { category_id: "web3", name: "Web3" },
    { category_id: "privacy-coins", name: "Privacy Coins" },
    { category_id: "oracle", name: "Oracle" },
    { category_id: "storage", name: "Storage" },
    { category_id: "social-money", name: "Social Money" },
  ]
}
