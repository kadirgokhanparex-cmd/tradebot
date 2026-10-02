import { BINANCE_CONFIG, BinanceTicker, BinanceKline, BinanceOrderBook, BinanceExchangeInfo, BinanceAccountInfo, BinanceOrder, WsTicker, WsKline, WsTrade, WsDepth, FuturesAccountInfo, FuturesOrder, FuturesBalance, FuturesPosition } from './binance';

export class BinanceAPI {
  private baseUrl: string;
  private futuresUrl: string;
  private wsUrl: string;
  private wsConnections: Map<string, WebSocket> = new Map();
  private wsStatus: Map<string, 'connecting' | 'connected' | 'disconnected' | 'error'> = new Map();
  private apiKey: string = '';
  private apiSecret: string = '';
  private useTestnet: boolean = true;
  private onStatusChange: (() => void) | null = null;
  private useMockData: boolean = false; // CORS hatası durumunda mock data kullan

  constructor() {
    // Default to MAINNET for WebSocket (read-only data)
    this.baseUrl = BINANCE_CONFIG.rest.main[0];
    this.futuresUrl = BINANCE_CONFIG.futures.main;
    this.wsUrl = BINANCE_CONFIG.ws.stream.main;
    console.log('🔧 BinanceAPI başlatıldı - Mainnet modu');
  }

  /**
   * Set callback for WebSocket status changes
   */
  setOnStatusChange(callback: () => void) {
    this.onStatusChange = callback;
  }

  /**
   * Get WebSocket connection status
   */
  getWebSocketStatus(streamName?: string): Map<string, 'connecting' | 'connected' | 'disconnected' | 'error'> | string {
    if (streamName) {
      return this.wsStatus.get(streamName) || 'disconnected';
    }
    return this.wsStatus;
  }

  setCredentials(apiKey: string, apiSecret: string, useTestnet: boolean = true) {
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.useTestnet = useTestnet;
    
    if (useTestnet) {
      this.baseUrl = BINANCE_CONFIG.rest.testnet;
      this.futuresUrl = BINANCE_CONFIG.futures.testnet;
      this.wsUrl = BINANCE_CONFIG.ws.stream.testnet;
    } else {
      this.baseUrl = BINANCE_CONFIG.rest.main[0];
      this.futuresUrl = BINANCE_CONFIG.futures.main;
      this.wsUrl = BINANCE_CONFIG.ws.stream.main;
    }
  }

  // ==================== MOCK DATA (FALLBACK) ====================

  private getMockPrices(): { symbol: string; price: string }[] {
    const basePrices: Record<string, number> = {
      BTCUSDT: 67250, ETHUSDT: 3420, SOLUSDT: 145.80, BNBUSDT: 585.30,
      XRPUSDT: 0.58, ADAUSDT: 0.62, DOGEUSDT: 0.162, AVAXUSDT: 38.50,
      DOTUSDT: 7.85, MATICUSDT: 0.92, LINKUSDT: 14.80, UNIUSDT: 7.45,
      ATOMUSDT: 9.20, FILUSDT: 6.15, NEARUSDT: 5.80, APTUSDT: 8.90
    };

    return Object.entries(basePrices).map(([symbol, basePrice]) => {
      // Gerçekçi fiyat değişimi ekle
      const variation = (Math.random() - 0.5) * 0.02; // ±1%
      const price = basePrice * (1 + variation);
      return { symbol, price: price.toFixed(price < 1 ? 6 : 2) };
    });
  }

  private getMockKlines(symbol: string, interval: string, limit: number): BinanceKline[] {
    const basePrices: Record<string, number> = {
      BTCUSDT: 67250, ETHUSDT: 3420, SOLUSDT: 145.80, BNBUSDT: 585.30,
      XRPUSDT: 0.58, ADAUSDT: 0.62, DOGEUSDT: 0.162, AVAXUSDT: 38.50,
      DOTUSDT: 7.85, MATICUSDT: 0.92, LINKUSDT: 14.80, UNIUSDT: 7.45,
      ATOMUSDT: 9.20, FILUSDT: 6.15, NEARUSDT: 5.80, APTUSDT: 8.90
    };

    const basePrice = basePrices[symbol] || 100;
    const klines: BinanceKline[] = [];
    let currentPrice = basePrice * 0.95;
    const now = Date.now();

    for (let i = limit; i >= 0; i--) {
      const openTime = now - i * 3600000; // 1 saat aralıklarla
      const change = (Math.random() - 0.48) * basePrice * 0.01;
      currentPrice = Math.max(currentPrice + change, basePrice * 0.85);
      currentPrice = Math.min(currentPrice, basePrice * 1.15);

      const open = currentPrice;
      const high = open * (1 + Math.random() * 0.02);
      const low = open * (1 - Math.random() * 0.02);
      const close = low + Math.random() * (high - low);
      const volume = Math.random() * 1000000 + 500000;

      klines.push({
        openTime,
        open: open.toString(),
        high: high.toString(),
        low: low.toString(),
        close: close.toString(),
        volume: volume.toString(),
        closeTime: openTime + 3600000,
        quoteVolume: (volume * close).toString(),
        trades: Math.floor(Math.random() * 10000) + 1000,
        takerBuyBaseVolume: (volume * 0.5).toString(),
        takerBuyQuoteVolume: (volume * close * 0.5).toString(),
      });
    }

    return klines;
  }

  // ==================== REST API METHODS ====================

  /**
   * Get current price for all symbols
   */
  async getAllPrices(): Promise<{ symbol: string; price: string }[]> {
    try {
      console.log('📡 Fiyat verisi alınıyor...');
      const response = await fetch(`${this.baseUrl}/v3/ticker/price`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ ${data.length} fiyat verisi alındı`);
      this.useMockData = false;
      return data;
    } catch (error) {
      console.warn('⚠️ REST API hatası, mock data kullanılıyor:', error);
      this.useMockData = true;
      return this.getMockPrices();
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
      console.log(`📡 ${symbol} kline verisi alınıyor...`);
      const url = `${this.baseUrl}/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ ${symbol} için ${data.length} kline alındı`);
      this.useMockData = false;
      
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
      console.warn(`⚠️ ${symbol} kline hatası, mock data kullanılıyor:`, error);
      this.useMockData = true;
      return this.getMockKlines(symbol, interval, limit);
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
    let mockInterval: ReturnType<typeof setInterval> | null = null;
    let isUnsubscribed = false;
    
    console.log('🔌 WebSocket ticker aboneliği başlatılıyor...');
    
    // WebSocket bağlantısını dene
    const cleanup = this.subscribeStream(streamName, (data) => {
      callback(data as WsTicker[]);
    });
    
    // 5 saniye sonra hala bağlanmamışsa mock data kullan
    const fallbackTimeout = setTimeout(() => {
      if (isUnsubscribed) return;
      
      const status = this.wsStatus.get(streamName);
      if (status !== 'connected') {
        console.warn('⚠️ WebSocket bağlanamadı, mock ticker verisi kullanılıyor');
        
        // Mock ticker verisi oluştur
        mockInterval = setInterval(() => {
          if (isUnsubscribed) return;
          
          const mockTickers = this.getMockPrices().map(p => {
            const price = parseFloat(p.price);
            const change = (Math.random() - 0.5) * 0.02;
            const newPrice = price * (1 + change);
            
            return {
              e: '24hrTicker',
              E: Date.now(),
              s: p.symbol,
              p: (change * price).toString(),
              P: (change * 100).toString(),
              w: price.toString(),
              x: price.toString(),
              c: newPrice.toString(),
              Q: '100',
              b: (newPrice * 0.999).toString(),
              B: '50',
              a: (newPrice * 1.001).toString(),
              A: '50',
              o: price.toString(),
              h: (price * 1.02).toString(),
              l: (price * 0.98).toString(),
              v: (Math.random() * 1000000).toString(),
              q: (Math.random() * 1000000000).toString(),
              O: Date.now() - 86400000,
              C: Date.now(),
              F: 1,
              L: 10000,
              n: 10000,
            } as WsTicker;
          });
          
          callback(mockTickers);
        }, 2000); // Her 2 saniyede güncelle
      }
    }, 5000);
    
    // Cleanup fonksiyonunu döndür
    return () => {
      isUnsubscribed = true;
      cleanup();
      clearTimeout(fallbackTimeout);
      if (mockInterval) {
        clearInterval(mockInterval);
      }
    };
  }

  /**
   * Generic stream subscription with auto-reconnect and connection health check
   */
  private subscribeStream(streamName: string, callback: (data: any) => void): () => void {
    const wsKey = streamName;
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null;
    let healthCheckInterval: ReturnType<typeof setInterval> | null = null;
    let isUnsubscribed = false;
    let reconnectAttempts = 0;
    let lastMessageTime = Date.now();
    const maxReconnectAttempts = 10;
    const healthCheckIntervalMs = 30000; // 30 saniye
    const maxSilenceTime = 60000; // 60 saniye mesaj gelmezse reconnect

    const connect = () => {
      if (isUnsubscribed) return;

      // Close existing connection if any
      const existing = this.wsConnections.get(wsKey);
      if (existing) {
        existing.close();
        this.wsConnections.delete(wsKey);
      }

      // Clear existing health check
      if (healthCheckInterval) {
        clearInterval(healthCheckInterval);
        healthCheckInterval = null;
      }

      // Use correct WebSocket URL format
      const wsUrl = `${this.wsUrl}/${streamName}`;
      console.log(`🔌 WebSocket bağlanıyor: ${wsUrl} (Deneme ${reconnectAttempts + 1}/${maxReconnectAttempts})`);
      
      const ws = new WebSocket(wsUrl);

      // Connection timeout - 10 saniye
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          console.warn(`⏱️ WebSocket connection timeout: ${streamName}`);
          ws.close();
        }
      }, 10000);

      ws.onopen = () => {
        clearTimeout(connectionTimeout);
        console.log(`✅ WebSocket bağlandı: ${streamName}`);
        this.wsStatus.set(wsKey, 'connected');
        reconnectAttempts = 0; // Reset reconnect counter
        lastMessageTime = Date.now();
        
        if (this.onStatusChange) this.onStatusChange();

        // Start health check - her 30 saniyede bağlantıyı kontrol et
        healthCheckInterval = setInterval(() => {
          const silenceTime = Date.now() - lastMessageTime;
          
          if (silenceTime > maxSilenceTime) {
            console.warn(`⚠️ WebSocket sessizlik süresi aşıldı: ${streamName} (${silenceTime/1000} saniye)`);
            console.log(`🔄 Yeniden bağlanılıyor: ${streamName}`);
            ws.close();
          } else {
            console.log(`💓 WebSocket sağlıklı: ${streamName} (Son mesaj: ${silenceTime/1000} saniye önce)`);
          }
        }, healthCheckIntervalMs);
      };

      ws.onmessage = (event) => {
        lastMessageTime = Date.now(); // Update last message time
        
        try {
          const data = JSON.parse(event.data);
          callback(data);
        } catch (error) {
          console.error('❌ WebSocket mesaj parse hatası:', error);
        }
      };

      ws.onerror = (error) => {
        clearTimeout(connectionTimeout);
        console.error(`❌ WebSocket hatası ${streamName}:`, error);
        this.wsStatus.set(wsKey, 'error');
        if (this.onStatusChange) this.onStatusChange();
      };

      ws.onclose = (event) => {
        clearTimeout(connectionTimeout);
        
        // Clear health check
        if (healthCheckInterval) {
          clearInterval(healthCheckInterval);
          healthCheckInterval = null;
        }

        console.log(`🔌 WebSocket kapandı: ${streamName} (code: ${event.code}, reason: ${event.reason || 'N/A'})`);
        this.wsConnections.delete(wsKey);
        this.wsStatus.set(wsKey, 'disconnected');
        if (this.onStatusChange) this.onStatusChange();
        
        // Auto-reconnect with exponential backoff
        if (!isUnsubscribed && reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts - 1), 30000); // Max 30 saniye
          console.log(`🔄 Yeniden bağlanılıyor: ${streamName} (${delay/1000} saniye sonra, deneme ${reconnectAttempts}/${maxReconnectAttempts})`);
          
          reconnectTimeout = setTimeout(() => {
            connect();
          }, delay);
        } else if (reconnectAttempts >= maxReconnectAttempts) {
          console.error(`❌ Maksimum yeniden bağlanma denemesi aşıldı: ${streamName}`);
        }
      };

      this.wsConnections.set(wsKey, ws);
      this.wsStatus.set(wsKey, 'connecting');
      if (this.onStatusChange) this.onStatusChange();
    };

    // Initial connection
    connect();

    // Return unsubscribe function
    return () => {
      isUnsubscribed = true;
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (healthCheckInterval) {
        clearInterval(healthCheckInterval);
      }
      this.unsubscribeStream(wsKey);
    };
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

  // ==================== FUTURES API METHODS ====================

  /**
   * Get Futures account information (requires signature)
   */
  async getFuturesAccountInfo(): Promise<FuturesAccountInfo> {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('API credentials not set');
    }

    try {
      const timestamp = Date.now();
      const queryString = `timestamp=${timestamp}`;
      const signature = await this.createSignature(queryString);
      
      const response = await fetch(`${this.futuresUrl}/v2/account?${queryString}&signature=${signature}`, {
        headers: {
          'X-MBX-APIKEY': this.apiKey,
        },
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching futures account info:', error);
      throw error;
    }
  }

  /**
   * Get Futures account balance (requires signature)
   */
  async getFuturesBalance(): Promise<FuturesBalance[]> {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('API credentials not set');
    }

    try {
      const timestamp = Date.now();
      const queryString = `timestamp=${timestamp}`;
      const signature = await this.createSignature(queryString);
      
      const response = await fetch(`${this.futuresUrl}/v2/balance?${queryString}&signature=${signature}`, {
        headers: {
          'X-MBX-APIKEY': this.apiKey,
        },
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching futures balance:', error);
      throw error;
    }
  }

  /**
   * Place a new Futures order (requires signature)
   */
  async placeFuturesOrder(params: {
    symbol: string;
    side: 'BUY' | 'SELL';
    positionSide?: 'BOTH' | 'LONG' | 'SHORT';
    type: string;
    quantity?: string;
    price?: string;
    timeInForce?: string;
    reduceOnly?: boolean;
    stopPrice?: string;
    leverage?: number;
  }): Promise<FuturesOrder> {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('API credentials not set');
    }

    try {
      // Set leverage if provided
      if (params.leverage) {
        await this.setFuturesLeverage(params.symbol, params.leverage);
      }

      const timestamp = Date.now();
      const queryParams = new URLSearchParams({
        symbol: params.symbol,
        side: params.side,
        type: params.type,
        timestamp: timestamp.toString(),
      });

      if (params.positionSide) queryParams.append('positionSide', params.positionSide);
      if (params.quantity) queryParams.append('quantity', params.quantity);
      if (params.price) queryParams.append('price', params.price);
      if (params.timeInForce) queryParams.append('timeInForce', params.timeInForce);
      if (params.reduceOnly) queryParams.append('reduceOnly', 'true');
      if (params.stopPrice) queryParams.append('stopPrice', params.stopPrice);
      
      const signature = await this.createSignature(queryParams.toString());
      
      const response = await fetch(`${this.futuresUrl}/v1/order?${queryParams.toString()}&signature=${signature}`, {
        method: 'POST',
        headers: {
          'X-MBX-APIKEY': this.apiKey,
        },
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error placing futures order:', error);
      throw error;
    }
  }

  /**
   * Set leverage for a symbol (requires signature)
   */
  async setFuturesLeverage(symbol: string, leverage: number): Promise<any> {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('API credentials not set');
    }

    try {
      const timestamp = Date.now();
      const queryString = `symbol=${symbol}&leverage=${leverage}&timestamp=${timestamp}`;
      const signature = await this.createSignature(queryString);
      
      const response = await fetch(`${this.futuresUrl}/v1/leverage?${queryString}&signature=${signature}`, {
        method: 'POST',
        headers: {
          'X-MBX-APIKEY': this.apiKey,
        },
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error setting leverage:', error);
      throw error;
    }
  }

  /**
   * Get position information (requires signature)
   */
  async getFuturesPositions(symbol?: string): Promise<FuturesPosition[]> {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('API credentials not set');
    }

    try {
      const timestamp = Date.now();
      let queryString = `timestamp=${timestamp}`;
      if (symbol) queryString += `&symbol=${symbol}`;
      
      const signature = await this.createSignature(queryString);
      
      const response = await fetch(`${this.futuresUrl}/v2/positionRisk?${queryString}&signature=${signature}`, {
        headers: {
          'X-MBX-APIKEY': this.apiKey,
        },
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching futures positions:', error);
      throw error;
    }
  }

  /**
   * Get open Futures orders (requires signature)
   */
  async getFuturesOpenOrders(symbol?: string): Promise<FuturesOrder[]> {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('API credentials not set');
    }

    try {
      const timestamp = Date.now();
      let queryString = `timestamp=${timestamp}`;
      if (symbol) queryString += `&symbol=${symbol}`;
      
      const signature = await this.createSignature(queryString);
      
      const response = await fetch(`${this.futuresUrl}/v1/openOrders?${queryString}&signature=${signature}`, {
        headers: {
          'X-MBX-APIKEY': this.apiKey,
        },
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching futures open orders:', error);
      throw error;
    }
  }

  /**
   * Close a Futures position (requires signature)
   */
  async closeFuturesPosition(symbol: string, positionSide: 'LONG' | 'SHORT' | 'BOTH' = 'BOTH'): Promise<FuturesOrder> {
    if (!this.apiKey || !this.apiSecret) {
      throw new Error('API credentials not set');
    }

    try {
      // Get current position to determine quantity
      const positions = await this.getFuturesPositions(symbol);
      const position = positions.find(p => p.symbol === symbol && (positionSide === 'BOTH' || p.positionSide === positionSide));
      
      if (!position || parseFloat(position.positionAmt) === 0) {
        throw new Error('No position to close');
      }

      const closeSide = parseFloat(position.positionAmt) > 0 ? 'SELL' : 'BUY';
      const quantity = Math.abs(parseFloat(position.positionAmt)).toString();

      return await this.placeFuturesOrder({
        symbol,
        side: closeSide as 'BUY' | 'SELL',
        positionSide: positionSide as 'BOTH' | 'LONG' | 'SHORT',
        type: 'MARKET',
        quantity,
        reduceOnly: true,
      });
    } catch (error) {
      console.error('Error closing futures position:', error);
      throw error;
    }
  }

  /**
   * Get Futures exchange info
   */
  async getFuturesExchangeInfo(): Promise<any> {
    try {
      const response = await fetch(`${this.futuresUrl}/v1/exchangeInfo`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching futures exchange info:', error);
      throw error;
    }
  }

  /**
   * Get Futures mark price
   */
  async getFuturesMarkPrice(symbol?: string): Promise<any> {
    try {
      const url = symbol 
        ? `${this.futuresUrl}/v1/premiumIndex?symbol=${symbol}`
        : `${this.futuresUrl}/v1/premiumIndex`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      return await response.json();
    } catch (error) {
      console.error('Error fetching futures mark price:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const binanceAPI = new BinanceAPI();
