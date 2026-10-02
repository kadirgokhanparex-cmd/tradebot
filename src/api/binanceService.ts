import { BINANCE_CONFIG, BinanceTicker, BinanceKline, BinanceOrderBook, BinanceExchangeInfo, BinanceAccountInfo, BinanceOrder, WsTicker, WsKline, WsTrade, WsDepth } from './binance';

export class BinanceAPI {
  private baseUrl: string;
  private wsUrl: string;
  private wsConnections: Map<string, WebSocket> = new Map();
  private apiKey: string = '';
  private apiSecret: string = '';
  private useTestnet: boolean = true;

  constructor() {
    // Default to testnet for safety
    this.baseUrl = BINANCE_CONFIG.rest.testnet;
    this.wsUrl = BINANCE_CONFIG.ws.stream.testnet[0];
  }

  setCredentials(apiKey: string, apiSecret: string, useTestnet: boolean = true) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.useTestnet = useTestnet;
    
    if (useTestnet) {
      this.baseUrl = BINANCE_CONFIG.rest.testnet;
      this.wsUrl = BINANCE_CONFIG.ws.stream.testnet[0];
    } else {
      this.baseUrl = BINANCE_CONFIG.rest.main[0];
      this.wsUrl = BINANCE_CONFIG.ws.stream.main[0];
    }
  }

  // ==================== REST API METHODS ====================

  /**
   * Get current price for all symbols
   */
  async getAllPrices(): Promise<{ symbol: string; price: string }[]> {
    try {
      const response = await fetch(`${this.baseUrl}/v3/ticker/price`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching prices:', error);
      throw error;
    }
  }

  /**
   * Get 24hr ticker statistics
   */
  async get24hrTicker(symbol?: string): Promise<BinanceTicker | BinanceTicker[]> {
    try {
      const url = symbol 
        ? `${this.baseUrl}/v3/ticker/24hr?symbol=${symbol}`
        : `${this.baseUrl}/v3/ticker/24hr`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching 24hr ticker:', error);
      throw error;
    }
  }

  /**
   * Get kline/candlestick data
   */
  async getKlines(symbol: string, interval: string = '1h', limit: number = 100): Promise<BinanceKline[]> {
    try {
      const url = `${this.baseUrl}/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      
      return data.map((k: any[]) => ({
        openTime: k[0],
        open: k[1],
        high: k[2],
        low: k[3],
        close: k[4],
        volume: k[5],
        closeTime: k[6],
        quoteVolume: k[7],
        trades: k[8],
        takerBuyBaseVolume: k[9],
        takerBuyQuoteVolume: k[10],
      }));
    } catch (error) {
      console.error('Error fetching klines:', error);
      throw error;
    }
  }

  /**
   * Get order book depth
   */
  async getOrderBook(symbol: string, limit: number = 20): Promise<BinanceOrderBook> {
    try {
      const url = `${this.baseUrl}/v3/depth?symbol=${symbol}&limit=${limit}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching order book:', error);
      throw error;
    }
  }

  /**
   * Get exchange information
   */
  async getExchangeInfo(): Promise<BinanceExchangeInfo> {
    try {
      const response = await fetch(`${this.baseUrl}/v3/exchangeInfo`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching exchange info:', error);
      throw error;
    }
  }

  /**
   * Get account information (requires signature)
   */
  async getAccountInfo(): Promise<BinanceAccountInfo> {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('API credentials not set');
    }

    try {
      const timestamp = Date.now();
      const queryString = `timestamp=${timestamp}`;
      const signature = await this.createSignature(queryString);
      
      const response = await fetch(`${this.baseUrl}/v3/account?${queryString}&signature=${signature}`, {
        headers: {
          'X-MBX-APIKEY': this.apiKey,
        },
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching account info:', error);
      throw error;
    }
  }

  /**
   * Place a new order (requires signature)
   */
  async placeOrder(params: {
    symbol: string;
    side: 'BUY' | 'SELL';
    type: string;
    quantity?: string;
    quoteOrderQty?: string;
    price?: string;
    timeInForce?: string;
  }): Promise<BinanceOrder> {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('API credentials not set');
    }

    try {
      const timestamp = Date.now();
      const queryParams = new URLSearchParams({
        ...params,
        timestamp: timestamp.toString(),
      });
      
      const signature = await this.createSignature(queryParams.toString());
      
      const response = await fetch(`${this.baseUrl}/v3/order?${queryParams.toString()}&signature=${signature}`, {
        method: 'POST',
        headers: {
          'X-MBX-APIKEY': this.apiKey,
        },
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  }

  /**
   * Get open orders (requires signature)
   */
  async getOpenOrders(symbol?: string): Promise<BinanceOrder[]> {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('API credentials not set');
    }

    try {
      const timestamp = Date.now();
      let queryString = `timestamp=${timestamp}`;
      if (symbol) queryString += `&symbol=${symbol}`;
      
      const signature = await this.createSignature(queryString);
      
      const response = await fetch(`${this.baseUrl}/v3/openOrders?${queryString}&signature=${signature}`, {
        headers: {
          'X-MBX-APIKEY': this.apiKey,
        },
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching open orders:', error);
      throw error;
    }
  }

  // ==================== WEBSOCKET METHODS ====================

  /**
   * Subscribe to ticker stream
   */
  subscribeTicker(symbol: string, callback: (data: WsTicker) => void): () => void {
    const streamName = `${symbol.toLowerCase()}@ticker`;
    return this.subscribeStream(streamName, (data) => callback(data as WsTicker));
  }

  /**
   * Subscribe to kline stream
   */
  subscribeKline(symbol: string, interval: string, callback: (data: WsKline) => void): () => void {
    const streamName = `${symbol.toLowerCase()}@kline_${interval}`;
    return this.subscribeStream(streamName, (data) => callback(data as WsKline));
  }

  /**
   * Subscribe to trade stream
   */
  subscribeTrade(symbol: string, callback: (data: WsTrade) => void): () => void {
    const streamName = `${symbol.toLowerCase()}@trade`;
    return this.subscribeStream(streamName, (data) => callback(data as WsTrade));
  }

  /**
   * Subscribe to depth stream
   */
  subscribeDepth(symbol: string, callback: (data: WsDepth) => void): () => void {
    const streamName = `${symbol.toLowerCase()}@depth`;
    return this.subscribeStream(streamName, (data) => callback(data as WsDepth));
  }

  /**
   * Subscribe to multiple tickers
   */
  subscribeAllTickers(callback: (data: WsTicker | WsTicker[]) => void): () => void {
    const streamName = '!ticker@arr';
    return this.subscribeStream(streamName, (data) => callback(data as WsTicker[]));
  }

  /**
   * Generic stream subscription
   */
  private subscribeStream(streamName: string, callback: (data: any) => void): () => void {
    const wsKey = streamName;
    
    if (this.wsConnections.has(wsKey)) {
      console.log(`Already subscribed to ${streamName}`);
      return () => this.unsubscribeStream(wsKey);
    }

    const wsUrl = `${this.wsUrl}/${streamName}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log(`WebSocket connected: ${streamName}`);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        callback(data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error) => {
      console.error(`WebSocket error for ${streamName}:`, error);
    };

    ws.onclose = () => {
      console.log(`WebSocket closed: ${streamName}`);
      this.wsConnections.delete(wsKey);
    };

    this.wsConnections.set(wsKey, ws);

    return () => this.unsubscribeStream(wsKey);
  }

  /**
   * Unsubscribe from stream
   */
  private unsubscribeStream(streamName: string) {
    const ws = this.wsConnections.get(streamName);
    if (ws) {
      ws.close();
      this.wsConnections.delete(streamName);
    }
  }

  /**
   * Close all WebSocket connections
   */
  closeAllConnections() {
    this.wsConnections.forEach((ws) => ws.close());
    this.wsConnections.clear();
  }

  // ==================== UTILITY METHODS ====================

  /**
   * Create HMAC SHA256 signature
   */
  private async createSignature(queryString: string): Promise<string> {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(this.apiSecret);
    const messageData = encoder.encode(queryString);

    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', key, messageData);
    const signatureArray = new Uint8Array(signature);
    
    return Array.from(signatureArray)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Get server time
   */
  async getServerTime(): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/v3/time`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.serverTime;
    } catch (error) {
      console.error('Error fetching server time:', error);
      throw error;
    }
  }

  /**
   * Test connectivity
   */
  async ping(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/v3/ping`);
      return response.ok;
    } catch (error) {
      console.error('Ping failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const binanceAPI = new BinanceAPI();
