export interface Bot {
  id: string;
  name: string;
  pair: string;
  strategy: string;
  status: 'running' | 'stopped' | 'error';
  profit: number;
  profitPercent: number;
  trades: number;
  winRate: number;
  investment: number;
  currentValue: number;
  createdAt: string;
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
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
}
