/**
 * Stacks Analytics - DeFi analytics library for Stacks
 */

export interface PriceData {
  usd: number;
  btc: number;
  change24h: number;
  timestamp: number;
}

export interface TVLData {
  total: number;
  protocols: Record<string, number>;
  timestamp: number;
}

export interface VolumeData {
  volume24h: number;
  volume7d: number;
  volume30d: number;
  timestamp: number;
}

export interface ProtocolMetrics {
  name: string;
  tvl: number;
  volume24h: number;
  users24h: number;
  transactions24h: number;
}

export interface AnalyticsConfig {
  network: 'mainnet' | 'testnet';
  apiUrl: string;
  cacheTimeout: number;
}

const DEFAULT_CONFIG: AnalyticsConfig = {
  network: 'mainnet',
  apiUrl: 'https://api.hiro.so',
  cacheTimeout: 60000,
};

/**
 * Main analytics client
 */
export class StacksAnalytics {
  private config: AnalyticsConfig;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();

  constructor(config: Partial<AnalyticsConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Get STX price from multiple sources
   */
  async getSTXPrice(): Promise<PriceData> {
    const cacheKey = 'stx-price';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    try {
      // Fetch from CoinGecko
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=blockstack&vs_currencies=usd,btc&include_24hr_change=true'
      );
      const data = await response.json();

      const price: PriceData = {
        usd: data.blockstack?.usd || 0,
        btc: data.blockstack?.btc || 0,
        change24h: data.blockstack?.usd_24h_change || 0,
        timestamp: Date.now(),
      };

      this.setCache(cacheKey, price);
      return price;
    } catch (error) {
      console.error('Failed to fetch STX price:', error);
      return { usd: 0, btc: 0, change24h: 0, timestamp: Date.now() };
    }
  }

  /**
   * Get token price by contract
   */
  async getTokenPrice(contract: string): Promise<PriceData> {
    const cacheKey = `token-price-${contract}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    // TODO: Implement token price fetching from DEX pools
    const price: PriceData = {
      usd: 0,
      btc: 0,
      change24h: 0,
      timestamp: Date.now(),
    };

    this.setCache(cacheKey, price);
    return price;
  }

  /**
   * Get ecosystem-wide TVL
   */
  async getEcosystemTVL(): Promise<TVLData> {
    const cacheKey = 'ecosystem-tvl';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    // Fetch TVL from known protocols
    const protocols = await this.fetchProtocolTVLs();
    const total = Object.values(protocols).reduce((a, b) => a + b, 0);

    const tvl: TVLData = {
      total,
      protocols,
      timestamp: Date.now(),
    };

    this.setCache(cacheKey, tvl);
    return tvl;
  }

  /**
   * Get protocol-specific metrics
   */
  async getProtocolMetrics(protocol: string): Promise<ProtocolMetrics> {
    const cacheKey = `protocol-${protocol}`;
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    // TODO: Implement per-protocol metrics
    const metrics: ProtocolMetrics = {
      name: protocol,
      tvl: 0,
      volume24h: 0,
      users24h: 0,
      transactions24h: 0,
    };

    this.setCache(cacheKey, metrics);
    return metrics;
  }

  /**
   * Get 24h volume
   */
  async get24hVolume(): Promise<VolumeData> {
    const cacheKey = 'volume-24h';
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;

    // TODO: Aggregate volume from DEXes
    const volume: VolumeData = {
      volume24h: 0,
      volume7d: 0,
      volume30d: 0,
      timestamp: Date.now(),
    };

    this.setCache(cacheKey, volume);
    return volume;
  }

  /**
   * Fetch TVLs for known protocols
   */
  private async fetchProtocolTVLs(): Promise<Record<string, number>> {
    // Known protocol addresses
    const protocols: Record<string, string> = {
      alex: 'SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9',
      velar: 'SP1Y5YSTAHZ88XYK1VPDH24GY0HPX5J4JECTMY4A1',
      arkadiko: 'SP2C2YFP12AJZB4MABJBAJ55XECVS7E4PMMZ89YZR',
      zest: 'SP2VCQJGH7PHP2DJK7Z0V48AGBHQAW3R3ZW1QF4N',
    };

    const tvls: Record<string, number> = {};

    for (const [name, address] of Object.entries(protocols)) {
      try {
        const response = await fetch(
          `${this.config.apiUrl}/extended/v1/address/${address}/stx`
        );
        const data = await response.json();
        tvls[name] = Number(data.balance || 0) / 1_000_000;
      } catch {
        tvls[name] = 0;
      }
    }

    return tvls;
  }

  /**
   * Get from cache if not expired
   */
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    if (Date.now() - cached.timestamp > this.config.cacheTimeout) {
      this.cache.delete(key);
      return null;
    }
    return cached.data;
  }

  /**
   * Set cache with timestamp
   */
  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }
}

export default StacksAnalytics;
