// Binance API Configuration
export const BINANCE_CONFIG = {
  // REST API Endpoints
  rest: {
    main: [
      'https://api.binance.com/api',
      'https://api-gcp.binance.com/api',
      'https://api1.binance.com/api',
      'https://api2.binance.com/api',
      'https://api3.binance.com/api',
      'https://api4.binance.com/api',
    ],
    testnet: 'https://testnet.binance.vision/api',
  },

  // Futures API Endpoints (USDⓈ-M)
  futures: {
    main: 'https://fapi.binance.com/fapi',
    testnet: 'https://testnet.binancefuture.com/fapi',
  },

  // WebSocket Endpoints
  ws: {
    stream: {
      main: [
        'wss://stream.binance.com:9443/ws',
        'wss://stream.binance.com:9443/stream',
      ],
      testnet: [
        'wss://stream.testnet.binance.vision:9443/ws',
        'wss://stream.testnet.binance.vision:9443/stream',
      ],
    },
    wsApi: {
      main: [
        'wss://ws-api.binance.com:9443/ws-api/v3',
      ],
      testnet: [
        'wss://ws-api.testnet.binance.vision:9443/ws-api/v3',
      ],
    },
  },

  // FIX Protocol Endpoints
  fix: {
    oe: {
      main: {
        fixFix: 'tcp+tls://fix-oe.binance.com:9000',
        fixSbe: 'tcp+tls://fix-oe.binance.com:9001',
        sbeSbe: 'tcp+tls://fix-oe.binance.com:9002',
      },
      testnet: {
        fixFix: 'tcp+tls://fix-oe.testnet.binance.vision:9000',
        fixSbe: 'tcp+tls://fix-oe.testnet.binance.vision:9001',
        sbeSbe: 'tcp+tls://fix-oe.testnet.binance.vision:9002',
      },
    },
    dc: {
      main: {
        fixFix: 'tcp+tls://fix-dc.binance.com:9000',
        fixSbe: 'tcp+tls://fix-dc.binance.com:9001',
        sbeSbe: 'tcp+tls://fix-dc.binance.com:9002',
      },
      testnet: {
        fixFix: 'tcp+tls://fix-dc.testnet.binance.vision:9000',
        fixSbe: 'tcp+tls://fix-dc.testnet.binance.vision:9001',
        sbeSbe: 'tcp+tls://fix-dc.testnet.binance.vision:9002',
      },
    },
    md: {
      main: {
        fixFix: 'tcp+tls://fix-md.binance.com:9000',
        fixSbe: 'tcp+tls://fix-md.binance.com:9001',
        sbeSbe: 'tcp+tls://fix-md.binance.com:9002',
      },
      testnet: {
        fixFix: 'tcp+tls://fix-md.testnet.binance.vision:9000',
        fixSbe: 'tcp+tls://fix-md.testnet.binance.vision:9001',
        sbeSbe: 'tcp+tls://fix-md.testnet.binance.vision:9002',
      },
    },
  },
} as const;

// API Response Types
export interface BinanceTicker {
  symbol: string;
  priceChange: string;
  priceChangePercent: string;
  weightedAvgPrice: string;
  prevClosePrice: string;
  lastPrice: string;
  lastQty: string;
  bidPrice: string;
  bidQty: string;
  askPrice: string;
  askQty: string;
  openPrice: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
  openTime: number;
  closeTime: number;
  firstId: number;
  lastId: number;
  count: number;
}

export interface BinanceKline {
  openTime: number;
  open: string;
  high: string;
  low: string;
  close: string;
  volume: string;
  closeTime: number;
  quoteVolume: string;
  trades: number;
  takerBuyBaseVolume: string;
  takerBuyQuoteVolume: string;
}

export interface BinanceOrderBook {
  lastUpdateId: number;
  bids: [string, string][];
  asks: [string, string][];
}

export interface BinanceExchangeInfo {
  timezone: string;
  serverTime: number;
  symbols: BinanceSymbol[];
}

export interface BinanceSymbol {
  symbol: string;
  status: string;
  baseAsset: string;
  baseAssetPrecision: number;
  quoteAsset: string;
  quotePrecision: number;
  orderTypes: string[];
  icebergAllowed: boolean;
  isSpotTradingAllowed: boolean;
  isMarginTradingAllowed: boolean;
  filters: any[];
}

export interface BinanceAccountInfo {
  makerCommission: number;
  takerCommission: number;
  buyerCommission: number;
  sellerCommission: number;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  updateTime: number;
  accountType: string;
  balances: { asset: string; free: string; locked: string }[];
}

export interface BinanceOrder {
  symbol: string;
  orderId: number;
  orderListId: number;
  clientOrderId: string;
  transactTime: number;
  price: string;
  origQty: string;
  executedQty: string;
  cummulativeQuoteQty: string;
  status: string;
  timeInForce: string;
  type: string;
  side: string;
  fills?: any[];
}

export interface WsTicker {
  e: string;      // Event type
  E: number;      // Event time
  s: string;      // Symbol
  p: string;      // Price change
  P: string;      // Price change percent
  w: string;      // Weighted average price
  x: string;      // First trade(F)-1 price (first trade before the 24hr rolling window)
  c: string;      // Last price
  Q: string;      // Last quantity
  b: string;      // Best bid price
  B: string;      // Best bid quantity
  a: string;      // Best ask price
  A: string;      // Best ask quantity
  o: string;      // Open price
  h: string;      // High price
  l: string;      // Low price
  v: string;      // Total traded base asset volume
  q: string;      // Total traded quote asset volume
  O: number;      // Statistics open time
  C: number;      // Statistics close time
  F: number;      // First trade ID
  L: number;      // Last trade ID
  n: number;      // Total number of trades
}

export interface WsKline {
  e: string;
  E: number;
  s: string;
  k: {
    t: number;    // Kline start time
    T: number;    // Kline close time
    s: string;    // Symbol
    i: string;    // Interval
    f: number;    // First trade ID
    L: number;    // Last trade ID
    o: string;    // Open price
    c: string;    // Close price
    h: string;    // High price
    l: string;    // Low price
    v: string;    // Base asset volume
    n: number;    // Number of trades
    x: boolean;   // Is this kline closed?
    q: string;    // Quote asset volume
    V: string;    // Taker buy base asset volume
    Q: string;    // Taker buy quote asset volume
  };
}

export interface WsTrade {
  e: string;
  E: number;
  s: string;
  t: number;    // Trade ID
  p: string;    // Price
  q: string;    // Quantity
  b: number;    // Buyer order ID
  a: number;    // Seller order ID
  T: number;    // Trade time
  m: boolean;   // Is the buyer the market maker?
  M: boolean;   // Ignore
}

export interface WsDepth {
  e: string;
  E: number;
  s: string;
  U: number;    // First update ID in event
  u: number;    // Final update ID in event
  b: [string, string][];  // Bids
  a: [string, string][];  // Asks
}

// Futures Types
export interface FuturesAccountInfo {
  feeTier: number;
  canTrade: boolean;
  canDeposit: boolean;
  canWithdraw: boolean;
  updateTime: number;
  multiAssetsMargin: boolean;
  totalInitialMargin: string;
  totalMaintMargin: string;
  totalWalletBalance: string;
  totalUnrealizedProfit: string;
  totalMarginBalance: string;
  totalPositionInitialMargin: string;
  totalOpenOrderInitialMargin: string;
  totalCrossWalletBalance: string;
  totalCrossUnPnl: string;
  availableBalance: string;
  maxWithdrawAmount: string;
  assets: FuturesAsset[];
  positions: FuturesPosition[];
}

export interface FuturesAsset {
  asset: string;
  walletBalance: string;
  unrealizedProfit: string;
  marginBalance: string;
  maintMargin: string;
  initialMargin: string;
  positionInitialMargin: string;
  openOrderInitialMargin: string;
  crossWalletBalance: string;
  crossUnPnl: string;
  availableBalance: string;
  maxWithdrawAmount: string;
  marginAvailable: boolean;
  updateTime: number;
}

export interface FuturesPosition {
  symbol: string;
  initialMargin: string;
  maintMargin: string;
  unrealizedProfit: string;
  positionInitialMargin: string;
  openOrderInitialMargin: string;
  leverage: string;
  isolated: boolean;
  entryPrice: string;
  maxNotional: string;
  bidNotional: string;
  askNotional: string;
  positionSide: string;
  positionAmt: string;
  updateTime: number;
}

export interface FuturesOrder {
  clientOrderId: string;
  cumQty: string;
  cumQuote: string;
  executedQty: string;
  orderId: number;
  avgPrice: string;
  origQty: string;
  price: string;
  reduceOnly: boolean;
  side: string;
  positionSide: string;
  status: string;
  stopPrice: string;
  closePosition: boolean;
  symbol: string;
  timeInForce: string;
  type: string;
  origType: string;
  activatePrice: string;
  priceRate: string;
  updateTime: number;
  workingType: string;
}

export interface FuturesBalance {
  accountAlias: string;
  asset: string;
  balance: string;
  crossWalletBalance: string;
  crossUnPnl: string;
  availableBalance: string;
  maxWithdrawAmount: string;
  marginAvailable: boolean;
  updateTime: number;
}
