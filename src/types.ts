export interface Bot {
  id: string;
  name: string;
  pair: string;
  strategy: string;
  status: 'running' | 'stopped' | 'error' | 'analyzing';
  profit: number;
  profitPercent: number;
  trades: number;
  winRate: number;
  investment: number;
  currentValue: number;
  createdAt: string;
  leverage: number;
  isSpot: boolean;
  currentAction: string;
  nextAction: string;
  currentIndicator: string;
}

export interface Trade {
  id: string;
  botId: string;
  botName: string;
  pair: string;
  type: 'BUY' | 'SELL';
  price: number;
  amount: number;
  total: number;
  profit: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'cancelled';
  leverage: number;
  isSpot: boolean;
}

export interface Strategy {
  id: string;
  name: string;
  description: string;
  risk: 'low' | 'medium' | 'high';
  avgReturn: number;
  maxDrawdown: number;
  winRate: number;
  tradesPerDay: number;
  indicators: string[];
}

export interface PortfolioData {
  totalValue: number;
  totalProfit: number;
  totalProfitPercent: number;
  todayProfit: number;
  todayProfitPercent: number;
  activeBots: number;
  totalBots: number;
}

export interface PricePoint {
  time: string;
  price: number;
  volume: number;
}

export interface MarketData {
  pair: string;
  symbol: string;
  price: number;
  change24h: number;
  change7d: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  marketCap: number;
  signal: 'STRONG_BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'STRONG_SELL';
  recommendedLeverage: number;
  recommendedPosition: number;
  isSpot: boolean;
  rsi: number;
  macdSignal: string;
  trend: 'bullish' | 'bearish' | 'sideways';
  volatility: number;
}

export interface Indicator {
  id: string;
  name: string;
  fullName: string;
  category: 'trend' | 'momentum' | 'volatility' | 'volume';
  description: string;
  whenToUse: string;
  buySignal: string;
  sellSignal: string;
  bestTimeframe: string;
  parameters: { name: string; defaultValue: number; min: number; max: number }[];
  currentValue?: number;
  signal?: 'buy' | 'sell' | 'neutral';
}

export interface LiveActivity {
  id: string;
  timestamp: string;
  botName: string;
  pair: string;
  action: string;
  type: 'info' | 'buy' | 'sell' | 'analysis' | 'alert' | 'signal';
  details: string;
  price?: number;
}

export interface OpenPosition {
  id: string;
  botId: string;
  botName: string;
  pair: string;
  type: 'LONG' | 'SHORT';
  entryPrice: number;
  currentPrice: number;
  amount: number;
  leverage: number;
  isSpot: boolean;
  pnl: number;
  pnlPercent: number;
  openedAt: string;
  stopLoss: number;
  takeProfit: number;
  strategy: string;
}
