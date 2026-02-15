# Stacks Analytics

DeFi analytics library for Stacks blockchain. Track prices, TVL, volume, and market data across Stacks DeFi protocols.

## Features

- **Price Feeds**: Real-time STX, sBTC, and token prices
- **TVL Tracking**: Protocol-level and ecosystem-wide TVL
- **Volume Analysis**: 24h, 7d, 30d trading volumes
- **Market Data**: Market cap, circulating supply, holder stats
- **Historical Data**: Price and TVL history with customizable timeframes
- **Whale Tracking**: Monitor large transactions and whale activity (NEW)

## Installation

```bash
npm install stacks-analytics
```

## Quick Start

```typescript
import { StacksAnalytics } from 'stacks-analytics';

const analytics = new StacksAnalytics();

// Get STX price
const price = await analytics.getSTXPrice();
console.log(`STX Price: $${price.usd}`);

// Get ecosystem TVL
const tvl = await analytics.getEcosystemTVL();
console.log(`Total TVL: $${tvl.total.toLocaleString()}`);

// Get protocol metrics
const protocol = await analytics.getProtocolMetrics('alex');
console.log(`ALEX TVL: $${protocol.tvl.toLocaleString()}`);
```

## API Reference

### Price Functions

#### `getSTXPrice()`

Returns current STX price in USD and BTC.

```typescript
const price = await analytics.getSTXPrice();
// { usd: 1.25, btc: 0.00002, change24h: 2.5 }
```

#### `getTokenPrice(contract: string)`

Returns price for any SIP-010 token.

```typescript
const price = await analytics.getTokenPrice('SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.alex-token');
```

### TVL Functions

#### `getEcosystemTVL()`

Returns total TVL across all tracked protocols.

#### `getProtocolTVL(protocol: string)`

Returns TVL for a specific protocol.

### Volume Functions

#### `get24hVolume()`

Returns 24-hour trading volume.

#### `getVolumeHistory(days: number)`

Returns historical volume data.

### Whale Tracking Functions

#### `getWhaleTransactions(threshold?: number, limit?: number)`

Returns large STX transfers above the threshold (default: 100,000 STX).

```typescript
const whales = await analytics.getWhaleTransactions(100000, 50);
// Returns array of WhaleTransaction objects
```

#### `getWhaleStats(threshold?: number)`

Returns aggregated whale statistics for the last 24 hours.

```typescript
const stats = await analytics.getWhaleStats();
console.log(`Whale transactions: ${stats.totalWhaleTransactions24h}`);
console.log(`Whale volume: ${stats.totalWhaleVolume24h.toLocaleString()} STX`);
console.log(`Largest: ${stats.largestTransaction?.amount} STX`);
```

#### `isWhale(address: string, threshold?: number)`

Check if an address is a whale (default threshold: 1M STX balance).

```typescript
const isWhale = await analytics.isWhale('SP...');
// Returns true/false
```

## Supported Protocols

| Protocol | Type | Contract |
|----------|------|----------|
| ALEX | DEX | SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9.alex-vault |
| Velar | DEX | SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1.velar-core |
| Arkadiko | CDP | SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR.arkadiko-vault |
| Zest | Lending | SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N.zest-core |

## Configuration

```typescript
const analytics = new StacksAnalytics({
  network: 'mainnet',
  apiUrl: 'https://api.hiro.so',
  cacheTimeout: 60000, // 1 minute
});
```

## License

MIT License - see [LICENSE](LICENSE)
